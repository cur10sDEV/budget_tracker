import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GetMonthHistoryPeriods, Period, Timeframe } from "@/types";
import { useQuery } from "@tanstack/react-query";
import SkeletonWrapper from "../../loaders/SkeletonWrapper";
import YearSelector from "./YearSelector";

interface IHistoryPeriodSelector {
  period: Period;
  setPeriod: (period: Period) => void;
  timeframe: Timeframe;
  setTimeframe: (timeframe: Timeframe) => void;
}

const HistoryPeriodSelector = ({
  period,
  setPeriod,
  setTimeframe,
  timeframe,
}: IHistoryPeriodSelector) => {
  const { data, isFetching } = useQuery<GetMonthHistoryPeriods>({
    queryKey: ["overview", "history", "periods"],
    queryFn: () => fetch("/api/history").then((res) => res.json()),
  });
  return (
    <div className="flex flex-wrap items-center gap-4">
      <SkeletonWrapper isLoading={isFetching} fullWidth={false}>
        <Tabs
          value={timeframe}
          onValueChange={(value) => setTimeframe(value as Timeframe)}
        >
          <TabsList>
            <TabsTrigger value="year">Year</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </SkeletonWrapper>
      <div className="flex flex-wrap items-center gap-2">
        <SkeletonWrapper isLoading={isFetching}>
          <YearSelector
            period={period}
            setPeriod={setPeriod}
            years={data || []}
          />
        </SkeletonWrapper>
      </div>
    </div>
  );
};
export default HistoryPeriodSelector;
