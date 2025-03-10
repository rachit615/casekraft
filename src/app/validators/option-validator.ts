// bg-blue-950 border-blue-950
// bg-zinc-900 border-zinc-900

import { PRODUCT_PRICES } from "@/config/products";

// bg-rose-950 border-rose-950
export const COLORS = [
  { label: "Black", value: "black", tw: "zinc-900" },
  { label: "Blue", value: "blue", tw: "blue-950" },
  { label: "Rose", value: "rose", tw: "rose-950" },
] as const;

export const MODELS = {
  name: "models",
  options: [
    { label: "iPhone 14", value: "iPhone14" },
    { label: "iPhone 14 Pro", value: "iPhone14Pro" },
    { label: "iPhone 14 Pro Max", value: "iPhone14ProMax" },
  ],
} as const;

export const MATERIALS = {
  name: "material",
  options: [
    {
      label: "Silicone",
      value: "silicone",
      description: undefined,
      price: PRODUCT_PRICES.material.silicone,
    },
    {
      label: "Soft Polycarbonate",
      value: "polycarbonate",
      description: "Scratch resistant coating",
      price: PRODUCT_PRICES.material.polycarbonate,
    },
  ],
} as const;

export const FINISHES = {
  name: "finish",
  options: [
    {
      label: "Smooth finish",
      value: "smooth",
      description: undefined,
      price: PRODUCT_PRICES.finish.smooth,
    },
    {
      label: "Textured finish",
      value: "textured",
      description: "Soft grippy texture",
      price: PRODUCT_PRICES.finish.textured,
    },
  ],
} as const;
