"use client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface INavbarItemProps {
  label: string;
  link: string;
  clickCallback?: () => void;
}

const NavbarItem = ({ label, link, clickCallback }: INavbarItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === link;
  return (
    <div className="relative">
      <Link
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "w-full justify-start text-lg text-muted-foreground hover:text-foreground",
          isActive && "text-foreground"
        )}
        href={link}
        onClick={clickCallback && clickCallback}
      >
        {label}
      </Link>
      {isActive && (
        <div className="absolute -bottom-[8px] w-[80%] h-[4px] rounded-xl hidden bg-foreground left-1/2 -translate-x-1/2 md:block"></div>
      )}
    </div>
  );
};
export default NavbarItem;
