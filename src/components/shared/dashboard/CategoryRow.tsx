import { Category } from "@prisma/client";

interface ICategoryProps {
  category: Category;
}
const CategoryRow = ({ category }: ICategoryProps) => {
  return (
    <div className="flex items-center gap-2">
      <span role="img">{category.icon}</span>
      <span>{category.name}</span>
    </div>
  );
};
export default CategoryRow;
