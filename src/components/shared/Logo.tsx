import { PiggyBank } from "lucide-react";
import Link from "next/link";

interface ILogoProps {
  showIcon?: boolean;
  showLabel?: boolean;
}

const Logo = ({ showIcon = true, showLabel = true }: ILogoProps) => {
  return (
    <Link href="/" className="flex items-center gap-2">
      {showIcon && (
        <PiggyBank className="stroke w-11 h-11 stroke-amber-500 stoke-[1.5]" />
      )}
      {showLabel && (
        <p className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent">
          BudgetTracker
        </p>
      )}
    </Link>
  );
};
export default Logo;
