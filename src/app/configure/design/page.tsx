import { db } from "@/db";
import { notFound } from "next/navigation";
import React from "react";
import DesginConfigurator from "./desginConfigurator";

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const Design = async ({ searchParams }: PageProps) => {
  const { id } = searchParams;

  if (!id || typeof id !== "string") {
    return notFound();
  }

  // make db call to get the saved image config

  const configuration = await db.configuration.findUnique({
    where: { id },
  });

  if (!configuration) {
    return notFound();
  }

  const { imageUrl, width, height } = configuration;

  return (
    <DesginConfigurator
      imageUrl={imageUrl}
      width={width}
      height={height}
      configId={configuration.id}
    />
  );
};

export default Design;
