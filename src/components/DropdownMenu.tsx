import React from "react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { MODELS } from "@/app/validators/option-validator";
import { cn } from "@/lib/utils";

interface DropdownMenuProps {
  options: {
    model: {
      label: string;
      value: string;
    };
  };
  onChange: (model: { label: string; value: string }, name: string) => void;
}

const DropdownMenuComponent = ({ options, onChange }: DropdownMenuProps) => {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={"w-full justify-between"}
          >
            {options.model.label}
            <ChevronsUpDown className="w-4 h-4 shrink-0 ml-2 opacity-50" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          style={{
            width: "var(--radix-dropdown-menu-trigger-width)", // Dynamically adjusts the width
            backgroundColor: "white",
          }}
        >
          {MODELS.options.map((model) => {
            return (
              <DropdownMenuItem
                key={model.value}
                className={cn(
                  "flex items-center text-sm  gap-1 p-1.5 cursor-pointer hover:bg-zinc-100",
                  {
                    [`bg-zinc-100`]: options.model.value === model.value,
                  }
                )}
                onSelect={() => {
                  onChange(model, "model");
                }}
              >
                {model.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DropdownMenuComponent;
