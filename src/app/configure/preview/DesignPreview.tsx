"use client";
import React, { useMemo } from "react";
import Phone from "@/components/Phone";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Configuration } from "@prisma/client";
import { formatPrice } from "@/lib/utils";
import { BASE_PRICE, PRODUCT_PRICES } from "@/config/products";
import { COLORS, FINISHES, MATERIALS } from "@/app/validators/option-validator";
import { useMutation } from "@tanstack/react-query";
import { createCheckoutSession } from "./actions";
import { toast } from "@/hooks/use-toast";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

const DesignPreview = ({ configuration }: { configuration: Configuration }) => {
  const { isAuthenticated } = useKindeBrowserClient();

  console.log("configuration", configuration);
  const { color, material, finish, croppedImageUrl } = configuration;

  const calculatePrice = useMemo(() => {
    const materialPrice = PRODUCT_PRICES.material[material!];
    const finishPrice = PRODUCT_PRICES.finish[finish!];

    return BASE_PRICE + materialPrice + finishPrice;
  }, [finish, material]);

  const tw = COLORS.find((c) => c.value === color)?.tw;

  const { mutate: handlePaymentSession } = useMutation({
    mutationKey: ["handle-checkout-session"],
    mutationFn: createCheckoutSession,
  });

  const handleCheckout = () => {
    if (isAuthenticated) {
      handlePaymentSession({ configId: configuration.id });
    } else {
      toast({
        title: "Please sign in to checkout",
        description: "You need to be signed in to checkout",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="grid grid-cols-12 mt-20 md:gap-x-8 ">
        <div className="sm:col-span-4">
          <Phone imgSrc={croppedImageUrl!} className={`w-60 bg-${tw}`} />
        </div>

        <div className="sm:col-span-8">
          <h3 className="text-2xl font-bold">Your iPhone X Case</h3>
          <div
            className="flex items-center mt-3 gap-3
          "
          >
            <Check className="h-4 w-4 text-green-500" />
            <span>In stock and ready to ship</span>
          </div>

          <div className="text-sm md:py-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-6 ">
              <div>
                <span className="font-medium text-base text-zinc-950">
                  Highlights
                </span>
                <ol className="mt-4 text-base list-disc list-inside text-zinc-700">
                  <li>Wireless charging compatible</li>
                  <li>TPU shock absorption</li>
                  <li>Packaging made from recycled materials</li>
                  <li>5 year print warranty</li>
                </ol>
              </div>

              <div>
                <span className="font-medium text-base text-zinc-950">
                  Materials
                </span>
                <ol className="mt-4 text-base list-disc list-inside text-zinc-700">
                  <li>High-quality, durable material</li>
                  <li>Scratch and fingerprint resistant coating</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="sm:p-8">
              <div className="flex justify-between">
                <p className="text-gray-600">Base price</p>
                <p className="text-gray-600 font-semibold">
                  {formatPrice(BASE_PRICE / 100)}
                </p>
              </div>

              {material === "polycarbonate" && (
                <div className="flex justify-between">
                  <p className="text-gray-600">
                    {MATERIALS.options.find((i) => i.value === material)?.label}
                  </p>
                  <p className="text-gray-600 font-semibold">
                    {formatPrice(PRODUCT_PRICES.material[material] / 100)}
                  </p>
                </div>
              )}

              {finish === "textured" && (
                <div className="flex justify-between">
                  <p className="text-gray-600">
                    {FINISHES.options.find((i) => i.value === finish)?.label}
                  </p>
                  <p className="text-gray-600 font-semibold">
                    {formatPrice(PRODUCT_PRICES.finish[finish] / 100)}
                  </p>
                </div>
              )}
              <div className="my-2 h-px bg-gray-200"></div>

              <div className="flex justify-between">
                <p className="text-gray-600 font-semibold">Order total</p>
                <p className="text-gray-600 font-semibold">
                  {formatPrice(calculatePrice / 100)}
                </p>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-end pb-12">
              <Button onClick={handleCheckout}>Checkout</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignPreview;
