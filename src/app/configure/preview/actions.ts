"use server";
import { BASE_PRICE, PRODUCT_PRICES } from "@/config/products";
import { db } from "@/db";
import stripe from "@/lib/stripe";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Order } from "@prisma/client";

export async function createCheckoutSession({
  configId,
}: {
  configId: string;
}) {
  const configuration = await db.configuration.findUnique({
    where: { id: configId },
  });

  if (!configuration) {
    throw new Error("Configuration not found");
  }

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error("User not logged in");
  }

  const { material, finish } = configuration;
  let price = BASE_PRICE;

  if (material === "polycarbonate") {
    price += PRODUCT_PRICES.material.polycarbonate;
  }
  if (finish === "textured") {
    price += PRODUCT_PRICES.finish.textured;
  }

  // check if this configuration has already order

  let order: Order | undefined = undefined;

  const existingOrder = await db.order.findFirst({
    where: {
      userId: user.id,
      configurationId: configuration.id,
    },
  });

  

  if (existingOrder) {
    order = existingOrder;
  } else {
    order = await db.order.create({
      data: {
        userId: user.id,
        configurationId: configuration.id,
        amount: price / 100,
      },
    });
  }

  const product = await stripe.products.create({
    name: "Custom iPhone Case",
    images: [configuration.imageUrl],
    default_price_data: {
      currency: "usd",
      unit_amount: price,
    },
  });

  const stripeSession = await stripe.checkout.sessions.create({
    success_url: `${process.env.NEXT_PUBLIC_URL}/thank-you?orderId=${order.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/preview?id=${configuration.id}`,
    mode: "payment",
    payment_method_types: ["card", "paypal"],
    metadata: {
      userId: user.id,
      orderId: order.id,
    },
    shipping_address_collection: {
      allowed_countries: ["US", "IN"],
    },
    line_items: [
      {
        price: product.default_price as string,
        quantity: 1,
      },
    ],
  });

  return { url: stripeSession.url };
}
