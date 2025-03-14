import { dateToUTCDate, formatCurrency } from "@/lib/utils";
import { UserSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";
import SkeletonWrapper from "../../../loaders/SkeletonWrapper";
import MoneyStatCard from "./MoneyStatCard";

interface IMoneyStatsProps {
  userSettings: UserSettings;
  from: Date;
  to: Date;
}
const MoneyStats = ({ userSettings, from, to }: IMoneyStatsProps) => {
  const { data, isFetching } = useQuery<{ income: number; expense: number }>({
    queryKey: ["overview", "stats", from, to],
    queryFn: () =>
      fetch(
        `/api/stats/balance?from=${dateToUTCDate(from)}&to=${dateToUTCDate(to)}`
      ).then(async (res) => {
        const data = await res.json();
        if (data.expense > data.income) {
          toast.warning(`Your Expenses are greater than your Income`, {
            duration: 5000,
          });
        }
        return data;
      }),
  });

  const formatter = useMemo(() => {
    return formatCurrency(userSettings.currency);
  }, [userSettings.currency]);

  const income = data?.income || 0;
  const expense = data?.expense || 0;
  const balance = income - expense;

  return (
    <div className="flex flex-wrap w-full gap-2 md:flex-nowrap">
      <SkeletonWrapper isLoading={isFetching}>
        <MoneyStatCard
          formatter={formatter}
          value={income}
          title="Income"
          icon={
            <TrendingUp className="size-12 items-center rounded-lg p-2 text-emerald-500 bg-emerald-400/10" />
          }
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={isFetching}>
        <MoneyStatCard
          formatter={formatter}
          value={expense}
          title="Expense"
          icon={
            <TrendingDown className="size-12 items-center rounded-lg p-2 text-red-500 bg-red-400/10" />
          }
        />
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={isFetching}>
        <MoneyStatCard
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
export default MoneyStats;
