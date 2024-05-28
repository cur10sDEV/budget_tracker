import { navbarLinks } from "@/constants";
import { UserButton } from "@clerk/nextjs";
import Logo from "../Logo";
import ThemeSwitcher from "../ThemeSwitcher";
import NavbarItem from "./NavbarItem";

const DesktopNavbar = () => {
  return (
    <nav className="hidden border-separate border-b bg-background px-8 md:block">
      <div className="flex h-[80px] min-h-[60px] items-center justify-between gap-x-4">
        <Logo />
        <div className="flex items-center h-full gap-x-2">
          {navbarLinks.map((item) => (
            <NavbarItem key={item.link} link={item.link} label={item.label} />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </div>
    </nav>
  );
};
export default DesktopNavbar;
