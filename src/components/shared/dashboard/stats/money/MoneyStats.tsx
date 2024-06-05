import { dateToUTCDate, formatCurrency } from "@/lib/utils";
import { UserSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { useMemo } from "react";
import SkeletonWrapper from "../../../loaders/SkeletonWrapper";
import StatCard from "./MoneyStatCard";

interface IStatsProps {
  userSettings: UserSettings;
  from: Date;
  to: Date;
}
const Stats = ({ userSettings, from, to }: IStatsProps) => {
  const { data, isFetching } = useQuery<{ income: number; expense: number }>({
    queryKey: ["overview", "stats", from, to],
    queryFn: () =>
      fetch(
        `/api/stats?from=${dateToUTCDate(from)}&to=${dateToUTCDate(to)}`
      ).then((res) => res.json()),
  });

  const formatter = useMemo(() => {
    return formatCurrency(userSettings.currency);
  }, [userSettings.currency]);

  const income = data?.income || 0;
  const expense = data?.expense || 0;
  const balance = income - expense;

  return (
    <div className="container flex flex-wrap w-full gap-2 md:flex-nowrap">
      <SkeletonWrapper isLoading={isFetching}>
        <StatCard
          formatter={formatter}
          value={income}
          title="Income"
          icon={
            <TrendingUp className="size-12 items-center rounded-lg p-2 text-emerald-500 bg-emerald-400/10" />
          }
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={isFetching}>
        <StatCard
          formatter={formatter}
          value={expense}
          title="Expense"
          icon={
            <TrendingDown className="size-12 items-center rounded-lg p-2 text-red-500 bg-red-400/10" />
          }
        />
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={isFetching}>
        <StatCard
          formatter={formatter}
          value={balance}
          title="Balance"
          icon={
            <Wallet className="size-12 items-center rounded-lg p-2 text-violet-500 bg-violet-400/10" />
          }
        />
      </SkeletonWrapper>
    </div>
  );
};
export default Stats;
