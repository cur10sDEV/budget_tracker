import { Button } from "@/components/ui/button";
import { Category } from "@prisma/client";
import { TrashIcon } from "lucide-react";

interface ICategoryCardProps {
  category: Category;
}
const CategoryCard = ({ category }: ICategoryCardProps) => {
  return (
    <div className="flex flex-col border-separate justify-between rounded-md border shadow-md shadow-black/[0.1] dark:shadow-white/[0.1]">
      <div className="flex flex-col items-center gap-2 p-4">
        <span className="text-3xl" role="image">
          {category.icon}
        </span>
        <span>{category.name}</span>
      </div>
      <Button
        className="flex border-separate w-full items-center gap-2 rounded-t-none text-muted-foreground hover:bg-red-500/20"
        variant="secondary"
      >
        <TrashIcon className="size-4" />
      </Button>
    </div>
  );
};

export default CategoryCard;
