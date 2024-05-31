"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { TransactionType } from "@/types";
import { Category } from "@prisma/client";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { PopoverContent } from "@radix-ui/react-popover";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import CreateCategoryDialog from "../CreateCategoryDialog";
import CategoryRow from "./CategoryRow";

interface ICategoryPickerProps {
  type: TransactionType;
}

const CategoryPicker = ({ type }: ICategoryPickerProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const userCategories = useQuery<Category[]>({
    queryKey: ["userCategories", type],
    queryFn: () =>
      fetch(`/api/user/categories?type=${type}`).then((res) => res.json()),
  });

  const selectedCategory = userCategories.data?.find(
    (category) => category.name === value
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedCategory ? (
            <CategoryRow category={selectedCategory} />
          ) : (
            "Select category"
          )}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Select category..." className="h-9" />
          <CreateCategoryDialog type={type} />
          <CommandEmpty>Category not found.</CommandEmpty>
          <CommandGroup>
            {userCategories &&
              userCategories.data &&
              userCategories.data.map((category) => (
                <CommandItem
                  key={category.name}
                  value={category.name}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {category.name}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === category.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
export default CategoryPicker;
