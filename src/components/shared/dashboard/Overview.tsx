"use client";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MAX_DATE_RANGE_DAYS } from "@/constants";
import { UserSettings } from "@prisma/client";
import { differenceInDays, startOfMonth } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import MoneyStats from "./stats/money/MoneyStats";

interface IOverviewProps {
  userSettings: UserSettings;
}
const Overview = ({ userSettings }: IOverviewProps) => {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  return (
    <>
      <div className="container flex flex-wrap items-end justify-between gap-2 py-6">
        <h2 className="text-3xl font-bold">Overview</h2>
        <div className="flex items-center gap-3">
          <DateRangePicker
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            showCompare={false}
            onUpdate={(values) => {
              const { from, to } = values.range;
              if (!from || !to) return;

              if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                toast.error(
                  `The selected date is too big, max allowed date range is ${MAX_DATE_RANGE_DAYS}`
                );
                return;
              }

              setDateRange({ from, to });
            }}
          />
        </div>
      </div>
      <MoneyStats
        userSettings={userSettings}
        from={dateRange.from}
        to={dateRange.to}
      />
    </>
  );
};
export default Overview;
