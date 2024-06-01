"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { TransactionType } from "@/types";
import { Category } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import CreateCategoryDialog from "../CreateCategoryDialog";
import CategoryRow from "./CategoryRow";

interface ICategoryPickerProps {
  type: TransactionType;
  onChange: (value: string) => void;
}

const CategoryPicker = ({ type, onChange }: ICategoryPickerProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (!value) return;
    onChange(value);
  }, [value, onChange]);

  const userCategories = useQuery<Category[]>({
    queryKey: ["userCategories", type],
    queryFn: () =>
      fetch(`/api/user/categories?type=${type}`).then((res) => res.json()),
  });

  const selectedCategory = userCategories.data?.find(
    (category) => category.name === value
  );

  const successCallback = (category: Category) => {
    setValue(category.name);
    setOpen((prev) => !prev);
  };

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
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command onSubmit={(e) => e.preventDefault()}>
          <CommandInput placeholder="Select category..." />
          <CreateCategoryDialog type={type} successCallback={successCallback} />
          <CommandEmpty>
            <p>Category not found</p>
            <p className="tex-muted-foreground text-xs">
              Tip: Create a new category
            </p>
          </CommandEmpty>
          <CommandGroup>
            <CommandList>
              {userCategories &&
                userCategories.data &&
                userCategories.data.map((category) => (
                  <CommandItem
                    key={category.name}
                    value={category.name}
                    onSelect={() => {
                      setValue(category.name);
                      setOpen((prev) => !prev);
                    }}
                    className="flex justify-between"
                  >
                    <CategoryRow category={category} />
                    <Check
                      className={cn(
                        "mr-2 size-4 opacity-0",
                        value === category.name && "opacity-100"
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
export default CategoryPicker;
