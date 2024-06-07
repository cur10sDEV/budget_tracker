import SkeletonWrapper from "@/components/shared/loaders/SkeletonWrapper";
import { Card } from "@/components/ui/card";
import { HistoryData } from "@/types";
import { UserSettings } from "@prisma/client";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import CustomTooltip from "./CustomTooltip";

interface IChartProps {
  isFetching: boolean;
  data: HistoryData[] | undefined;
  timeframe: "month" | "year";
  userSettings: UserSettings;
}
const Chart = ({ isFetching, data, timeframe, userSettings }: IChartProps) => {
  const isDataAvailable = data && data.length > 0;

  return (
    <SkeletonWrapper isLoading={isFetching}>
      {isDataAvailable ? (
        <ResponsiveContainer height={300} width={"100%"}>
          <BarChart height={300} data={data} barCategoryGap={5}>
            <defs>
              <linearGradient id="incomeBar" x1={0} y1={0} x2={0} y2={1}>
                <stop offset={0} stopOpacity={1} stopColor="#10b981" />
                <stop offset={1} stopOpacity={0} stopColor="#10b981" />
              </linearGradient>
              <linearGradient id="expenseBar" x1={0} y1={0} x2={0} y2={1}>
                <stop offset={0} stopOpacity={1} stopColor="#ef4444" />
                <stop offset={1} stopOpacity={0} stopColor="#ef4444" />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="5 5"
              strokeOpacity={0.2}
              vertical={false}
            />
            <XAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              padding={{ left: 5, right: 5 }}
              dataKey={(data) => {
                const { day, year, month } = data;
                const date = new Date(year, month, day || 1);
                if (timeframe === "year") {
                  return date.toLocaleDateString("default", {
                    month: "long",
                  });
                }
                return date.toLocaleDateString("default", {
                  day: "2-digit",
                });
              }}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Bar
              dataKey="income"
              label="Income"
              fill="url(#incomeBar)"
              radius={4}
              className="cursor-pointer"
            />
            <Bar
              dataKey="expense"
              label="Expense"
              fill="url(#expenseBar)"
              radius={4}
              className="cursor-pointer"
            />
            <Tooltip
              cursor={{ opacity: 0.1 }}
              content={(props) => (
                <CustomTooltip userSettings={userSettings} {...props} />
              )}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <Card className="flex h-[300px] flex-col items-center justify-center bg-background">
          No data for the selected period
          <p className="text-sm text-muted-foreground">
            Try selecting a different period or adding new transactions
          </p>
        </Card>
      )}
    </SkeletonWrapper>
  );
};
export default Chart;
