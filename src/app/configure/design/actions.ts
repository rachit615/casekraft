"use server";

import { db } from "@/db";
import {
  CaseColor,
  PhoneModel,
  CaseMaterial,
  CaseFinishes,
} from "@prisma/client";

export type SaveConfigArgs = {
  color: CaseColor;
  model: PhoneModel;
  material: CaseMaterial;
  finish: CaseFinishes;
  configId: string;
};

export async function saveConfigurationToDatabase({
  color,
  model,
  material,
  finish,
  configId,
}: SaveConfigArgs) {
  // Save the configuration to the database
  await db.configuration.update({
    where: { id: configId },
    data: {
      color,
      model,
      material,
      finish,
    },
  });
}
