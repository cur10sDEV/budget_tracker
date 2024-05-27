import Link from "next/link";
import { LuPiggyBank } from "react-icons/lu";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2">
      <LuPiggyBank className="stroke w-11 h-11 stroke-amber-500 stoke-[1.5]" />
      <p className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent">
        BudgetTracker
      </p>
    </Link>
  );
};
export default Logo;
