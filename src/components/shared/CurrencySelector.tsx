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
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { currencies } from "@/constants";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { typeCurrency } from "@/types";
import { UserSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import SkeletonWrapper from "./loaders/SkeletonWrapper";

const CurrencySelector = () => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [currency, setCurrency] = useState<typeCurrency | null>(null);

  const { isLoading, data } = useQuery<UserSettings>({
    queryKey: ["userSettings"],
    queryFn: () => fetch("/api/user/settings").then((res) => res.json()),
  });

  useEffect(() => {
    if (!data) return;

    const userCurrency = currencies.find(
      (currency) => currency.value === data.currency
    );
    if (userCurrency) {
      setCurrency(userCurrency);
    }
  }, [data]);

  if (isDesktop) {
    return (
      <SkeletonWrapper isLoading={isLoading}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild disabled={isLoading}>
            <Button variant="outline" className="w-full justify-start">
              {currency ? <>{currency.label}</> : <>Set Currency</>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <CurrencyList setOpen={setOpen} setCurrency={setCurrency} />
          </PopoverContent>
        </Popover>
      </SkeletonWrapper>
    );
  }

  return (
    <SkeletonWrapper isLoading={isLoading}>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild disabled={isLoading}>
          <Button variant="outline" className="w-full justify-start">
            {currency ? <>{currency.label}</> : <>Set Currency</>}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mt-4 border-t">
            <CurrencyList setOpen={setOpen} setCurrency={setCurrency} />
          </div>
        </DrawerContent>
      </Drawer>
    </SkeletonWrapper>
  );
};

function CurrencyList({
  setOpen,
  setCurrency,
}: {
  setOpen: (open: boolean) => void;
  setCurrency: (currency: typeCurrency | null) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter currencies..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {currencies.map((currency) => (
            <CommandItem
              key={currency.value}
              value={currency.value}
              onSelect={(value) => {
                setCurrency(
                  currencies.find((currency) => currency.value === value) ||
                    null
                );
                setOpen(false);
              }}
            >
              {currency.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

export default CurrencySelector;
