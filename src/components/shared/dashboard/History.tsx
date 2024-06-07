"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Period, Timeframe } from "@/types";
import { UserSettings } from "@prisma/client";
import { useState } from "react";
import HistoryPeriodSelector from "./HistoryPeriodSelector";

interface IHistoryProps {
  userSettings: UserSettings;
}
const History = ({ userSettings }: IHistoryProps) => {
  const [timeframe, setTimeframe] = useState<Timeframe>("month");
  const [period, setPeriod] = useState<Period>({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  return (
    <div className="container">
      <h2 className="text-3xl font-bold mt-12">History</h2>
      <Card className="col-span-12 mt-12 w-full">
        <CardHeader className="gap-2">
          <CardTitle className="grid grid-flow-row justify-between gap-2 md:grid-flow-col">
            <HistoryPeriodSelector
              timeframe={timeframe}
              setTimeframe={setTimeframe}
              period={period}
              setPeriod={setPeriod}
            />

            <div className="flex h-10 gap-2">
              <Badge
                variant="outline"
                className="flex items-center gap-2 text-sm"
              >
                <div className="size-4 rounded-full bg-emerald-500"></div>
                Income
              </Badge>
              <Badge
                variant="outline"
                className="flex items-center gap-2 text-sm"
              >
                <div className="size-4 rounded-full bg-red-500"></div>
                Expense
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
};

export default History;
