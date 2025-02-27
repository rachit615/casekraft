"use client";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import React, { useRef, useState } from "react";
import NextImage from "next/image";
import { base64ToBlob, cn, formatPrice } from "@/lib/utils";
import { Rnd } from "react-rnd";
import HandleComponent from "@/components/HandleComponent";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  COLORS,
  FINISHES,
  MATERIALS,
  MODELS,
} from "@/app/validators/option-validator";
import { RadioGroup } from "@headlessui/react";
import { Label } from "@/components/ui/label";
import DropdownMenuComponent from "@/components/DropdownMenu";
import { BASE_PRICE } from "@/config/products";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { SaveConfigArgs, saveConfigurationToDatabase } from "./actions";
import { useRouter } from "next/navigation";

interface DesignConfiguratorProps {
  configId: string;
  imageUrl: string;
  width: number;
  height: number;
}

const DesginConfigurator = ({
  configId,
  imageUrl,
  width,
  height,
}: DesignConfiguratorProps) => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const phoneCaseRef = useRef<HTMLDivElement>(null);

  const [options, setOptions] = useState<{
    color: (typeof COLORS)[number];
    model: (typeof MODELS)["options"][number];
    material: (typeof MATERIALS)["options"][number];
    finish: (typeof FINISHES)["options"][number];
  }>({
    color: COLORS[0],
    model: MODELS.options[0],
    material: MATERIALS.options[0],
    finish: FINISHES.options[0],
  });

  console.log("options", options);

  const [renderedDimensions, setRenderedDimensions] = useState({
    width: width / 4,
    height: height / 4,
  });

  const [renderedPosition, setRenderedPosition] = useState({
    x: 150,
    y: 205,
  });

  const { startUpload } = useUploadThing("imageUploader");
  const { toast } = useToast();

  const { mutate: saveConfig } = useMutation({
    mutationKey: ["save-config"],
    mutationFn: async (args: SaveConfigArgs) => {
      await Promise.all([
        saveCroppedImage(),
        saveConfigurationToDatabase(args),
      ]);
    },
    onError: () => {
      toast({
        title: "Something went wrong.",
        description: "Please try again later.",
      });
    },
    onSuccess: () => {
      router.push(`/configure/preview?id=${configId}`);
    },
  });

  async function saveCroppedImage() {
    try {
      const { left: phoneCaseLeft, top: phoneCaseTop } =
        phoneCaseRef.current!.getBoundingClientRect();
      const { left: containerLeft, top: containerTop } =
        containerRef.current!.getBoundingClientRect();
      const leftOffset = phoneCaseLeft - containerLeft;
      const topOffset = phoneCaseTop - containerTop;

      const actualX = renderedPosition.x - leftOffset;
      const actualY = renderedPosition.y - topOffset;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      const userImage = new Image();
      userImage.crossOrigin = "anonymous";
      userImage.src = imageUrl;

      // Wait for the image to load
      await new Promise((resolve) => (userImage.onload = resolve));

      // Safely draw the image because it’s now loaded (actualX, actualY) are relative to the phone case

      ctx?.drawImage(userImage, actualX, actualY);

      const base64 = canvas.toDataURL();
      const base64Data = base64.split(",")[1];

      const blob = base64ToBlob(base64Data, "image/png");
      const file = new File([blob], "filename.png", { type: "image/png" });
      await startUpload([file], { configId });
      console.log("blob", blob);
    } catch {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was problem saving your config, please try again !",
        variant: "destructive",
      });
    }
  }

  const handleChangeOptions = (
    value: { label: string; value: string },
    name: string
  ) => {
    setOptions((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="relative mt-20 pb-20 mb-20 grid grid-cols-3">
      <div
        className="relative h-[37.5rem] overflow-hidden col-span-2 w-full max-w-4xl flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center focus:outline-none focus
      :ring-2 focus:ring-primary focus:ring-offset-2 "
        ref={containerRef}
      >
        <div className="relative w-60 bg-opacity-50 pointer-events-none aspect-[896/1831] ">
          <AspectRatio
            ratio={896 / 1831}
            ref={phoneCaseRef}
            className="pointer-events-none relative z-50 aspect-[896/1831] w-full" // phone z-index = 50
          >
            <NextImage
              src={"/phone-template.png"}
              fill
              alt="phone image"
              className="pointer-events-none z-50 select-none"
            />
          </AspectRatio>
          <div className="absolute z-50 inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[32px] shadow-[0_0_0_99999px_rgba(229,231,235,0.6)]" />

          <div
            className={cn(
              "absolute z-40 inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[32px]",
              {
                [`bg-${options.color.tw}`]: true,
              }
            )}
          />
        </div>

        {/* User Image */}
        <Rnd
          default={{
            x: 150,
            y: 200,
            width: width / 4,
            height: height / 4,
          }}
          onResizeStop={(_, __, ref, ___, { x, y }) => {
            setRenderedDimensions({
              width: parseInt(ref.style.width.slice(0, -2)),
              height: parseInt(ref.style.height.slice(0, -2)),
            });
            setRenderedPosition({ x, y });
          }}
          lockAspectRatio
          className="absolute border-[0.5px]  "
          style={{
            zIndex: 41,
          }}
          resizeHandleComponent={{
            bottomRight: <HandleComponent />,
            bottomLeft: <HandleComponent />,
            topRight: <HandleComponent />,
            topLeft: <HandleComponent />,
          }}
        >
          <div className="w-full h-full relative">
            <NextImage
              src={imageUrl}
              fill
              className="pointer-events-none "
              alt="your image"
            />
          </div>
        </Rnd>
      </div>

      <div className="h-[37.5rem] flex flex-col bg-white">
        <ScrollArea className="flex-1 overflow-auto">
          <div
            area-hidden="true"
            className="absolute z-10 inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white pointer-events-none"
          />
          <div className="px-8 pb-12 pt-8">
            <h2 className="tracking-tight text-3xl font-bold">
              Customize your case
            </h2>

            <div className="w-full h-px bg-zinc-200 my-6"></div>

            <div className="relative mt-4 h-full flex flex-col justify-between">
              <RadioGroup
                value={options.color}
                onChange={(val) => {
                  handleChangeOptions(val, "color");
                }}
              >
                <Label>Color: {options.color.label}</Label>
                <div className="mt-3 flex items-center space-x-3">
                  {COLORS.map((color) => {
                    return (
                      <RadioGroup.Option
                        key={color.label}
                        value={color}
                        className={({ active, checked }) =>
                          cn(
                            "flex cursor-pointer items-center justify-center p-0.5 rounded-full border-2 border-transparent ",
                            {
                              [`border-${color.tw}`]: active || checked,
                            }
                          )
                        }
                      >
                        <span
                          className={cn(
                            `bg-${color.tw}`,
                            "h-8 w-8 rounded-full border border-black border-opacity-10"
                          )}
                        />
                      </RadioGroup.Option>
                    );
                  })}
                </div>
              </RadioGroup>
            </div>

            <div className="relative flex flex-col gap-3 w-full">
              <Label>Model: {options.model.label}</Label>
              <DropdownMenuComponent
                options={options}
                onChange={handleChangeOptions}
              />
            </div>

            {[MATERIALS, FINISHES].map(
              ({ name, options: selectableOptions }) => (
                <RadioGroup
                  key={name}
                  value={options[name as keyof typeof options]}
                  onChange={(val) => handleChangeOptions(val, name)}
                >
                  <Label>
                    {name.slice(0, 1).toUpperCase() + name.slice(1)}
                  </Label>

                  <div className="mt-3 space-y-4">
                    {selectableOptions.map((option) => {
                      return (
                        <RadioGroup.Option
                          key={option.value}
                          value={option}
                          className={({ active, checked }) =>
                            cn(
                              " cursor-pointer flex items-start justify-between  rounded-lg bg-white px-6 py-4 shadow-sm border-2 border-zinc-200",
                              {
                                "border-primary": active || checked,
                              }
                            )
                          }
                        >
                          <span className="flex  flex-col ">
                            <span className="text-sm font-medium">
                              {option.label}
                            </span>
                            {option.description && (
                              <span className="text-xs text-zinc-500">
                                {option.description}
                              </span>
                            )}
                          </span>
                          <RadioGroup.Description
                            as="span"
                            className={
                              "mt-2  text-sm sm:ml-4 sm:mt-0 sm:flex-col sm:text-right"
                            }
                          >
                            <span className="text-sm font-medium text-gray-900">
                              {formatPrice(option.price / 100)}
                            </span>
                          </RadioGroup.Description>
                        </RadioGroup.Option>
                      );
                    })}
                  </div>
                </RadioGroup>
              )
            )}
          </div>
        </ScrollArea>

        <div className="px-8 ">
          <div className="w-full h-px bg-zinc-200" />
          <div className="mt-4 flex justify-between ">
            <div>{formatPrice(BASE_PRICE / 100)}</div>
            <div className="w-full ml-4">
              <Button
                onClick={() =>
                  saveConfig({
                    color: options.color.value,
                    model: options.model.value,
                    material: options.material.value,
                    finish: options.finish.value,
                    configId,
                  })
                }
                size="sm"
                className="w-full"
              >
                Continue
                <ArrowRight
                  className="ml-1.5
                    "
                />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesginConfigurator;
