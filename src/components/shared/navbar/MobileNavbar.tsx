"use client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { navbarLinks } from "@/constants";
import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import { useState } from "react";
import Logo from "../Logo";
import ThemeSwitcher from "../ThemeSwitcher";
import NavbarItem from "./NavbarItem";

const MobileNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="block border-separate bg-background md:hidden">
      <nav className="container flex items-center justify-between px-8">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu />
            </Button>
          </SheetTrigger>
          {/* <SheetContent className="w-[360px] sm:w-[540px]"> */}
          <SheetContent className="w-[360px] sm:w-[540px]">
            <Logo />
            <div className="flex flex-col gap-4 pt-4">
              {navbarLinks.map((item) => (
                <NavbarItem
                  key={item.link}
                  label={item.label}
                  link={item.link}
                  clickCallback={() => setIsOpen((prev) => !prev)}
                />
              ))}
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex h-[80px] min-h-[80px] items-center gap-x-4">
          <Logo showLabel={false} />
        </div>
        <div className="flex h-[80px] min-h-[80px] items-center gap-x-4">
          <ThemeSwitcher />
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </nav>
    </div>
  );
};
export default MobileNavbar;
