import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { TransactionType } from "@/types";
import { Category } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { PlusSquare, TrendingDown, TrendingUp } from "lucide-react";
import CreateCategoryDialog from "../CreateCategoryDialog";
import SkeletonWrapper from "../loaders/SkeletonWrapper";
import CategoryCard from "./CategoryCard";

interface ICategoryListProps {
  type: TransactionType;
}
const CategoryList = ({ type }: ICategoryListProps) => {
  const { data, isFetching, refetch } = useQuery<Category[]>({
    queryKey: ["categories", type],
    queryFn: () =>
      fetch(`/api/user/categories?type=${type}`).then((res) => res.json()),
  });

  const isDataAvailable = data && data.length > 0;

  return (
    <SkeletonWrapper isLoading={isFetching}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {type === "expense" ? (
                <TrendingDown className="size-12 items-center rounded-lg bg-red-400/10 p-2 text-red-500" />
              ) : (
                <TrendingUp className="size-12 items-center rounded-lg bg-emerald-400/10 p-2 text-emerald-500" />
              )}
              <div className="ml-2">
                {type === "income" ? "Incomes" : "Expenses"} Categories
                <div className="text-sm text-muted-foreground">
                  Sorted by name
                </div>
              </div>
            </div>
            <CreateCategoryDialog
              type={type}
              successCallback={() => refetch()}
              trigger={
                <Button className="gap-2 text-sm">
                  <PlusSquare className="size-4" />
                  Create Category
                </Button>
              }
            />
          </CardTitle>
        </CardHeader>
        <Separator />
        {!isDataAvailable && (
          <div className="flex h-40 w-full flex-col items-center justify-center">
            <p>
              No{" "}
              <span
                className={cn(
                  "m-1",
                  type === "income" ? "text-emerald-500" : "text-red-500"
                )}
              >
                {type}
              </span>
              categories yet
            </p>
            <p className="text-sm text-muted-foreground">
              Create one to get started
            </p>
          </div>
        )}
        {isDataAvailable && (
          <div className="grid grid-flow-row gap-2 p-2 sm:grid-flow-row sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {data.map((category) => (
              <CategoryCard category={category} key={category.id} />
            ))}
          </div>
        )}
      </Card>
    </SkeletonWrapper>
  );
};
export default CategoryList;
