import SkeletonWrapper from "@/components/shared/loaders/SkeletonWrapper";
import { dateToUTCDate, formatCurrency } from "@/lib/utils";
import { GetUserCategoryStats } from "@/types";
import { UserSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import CategoryStatCard from "./CategoryStatCard";

interface ICategoryStatsProps {
  userSettings: UserSettings;
  from: Date;
  to: Date;
}

const CategoryStats = ({ userSettings, from, to }: ICategoryStatsProps) => {
  const { data, isFetching } = useQuery<GetUserCategoryStats>({
    queryKey: ["overview", "stats", "category", from, to],
    queryFn: () =>
      fetch(
        `/api/stats/categories?from=${dateToUTCDate(from)}&to=${dateToUTCDate(
          to
        )}`
      ).then((res) => res.json()),
  });

  const formatter = useMemo(() => {
    return formatCurrency(userSettings.currency);
  }, [userSettings.currency]);

  return (
    <div className="flex flex-wrap w-full gap-2 md:flex-nowrap">
      <SkeletonWrapper isLoading={isFetching}>
        <CategoryStatCard
          formatter={formatter}
          type="income"
          data={data || []}
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={isFetching}>
        <CategoryStatCard
          formatter={formatter}
          type="expense"
          data={data || []}
        />
      </SkeletonWrapper>
    </div>
  );
};
export default CategoryStats;
