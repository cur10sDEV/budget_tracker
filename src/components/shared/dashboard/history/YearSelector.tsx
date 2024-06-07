import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GetMonthHistoryPeriods, Period } from "@/types";

interface IYearSelectorProps {
  period: Period;
  setPeriod: (period: Period) => void;
  years: GetMonthHistoryPeriods;
}

const YearSelector = ({ period, setPeriod, years }: IYearSelectorProps) => {
  return (
    <Select
      value={period.year.toString()}
      onValueChange={(value) =>
        setPeriod({
          month: period.month,
          year: parseInt(value),
        })
      }
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {years?.map((year) => (
          <SelectItem key={year} value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
export default YearSelector;
