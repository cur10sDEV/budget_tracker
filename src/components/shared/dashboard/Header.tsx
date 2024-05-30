import { Button } from "@/components/ui/button";

interface IHeaderProps {
  firstName: string | null;
}

const Header = ({ firstName }: IHeaderProps) => {
  return (
    <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
      <p className="text-3xl font-bold">Hello, {firstName || "User"}! 👋</p>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          className="border-emerald-500 bg-emerald-950 text-white hover:bg-emerald-700"
        >
          New Income 🤑
        </Button>
        <Button
          variant="outline"
          className="border-rose-500 bg-rose-950 text-white hover:bg-rose-700"
        >
          New Expense 😤
        </Button>
      </div>
    </div>
  );
};
export default Header;
