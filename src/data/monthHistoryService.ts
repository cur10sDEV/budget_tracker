import db from "@/lib/prisma/db";
import { HistoryData } from "@/types";
import { getDaysInMonth } from "date-fns";

class MonthHistoryService {
  static async getHistoryPeriods(userId: string) {
    try {
      const result = await db.monthHistory.findMany({
        where: {
          userId,
        },
        select: {
          year: true,
        },
        distinct: ["year"],
        orderBy: [{ year: "asc" }],
      });

      const years = result.map((el) => el.year);

      if (years.length === 0) {
        return [new Date().getFullYear()];
      }

      return years;
    } catch (error) {
      console.error("Database Error - Month History Service");
      return null;
    }
  }

  static async getHistoryData(userId: string, month: number, year: number) {
    try {
      const data = await db.monthHistory.groupBy({
        by: ["day"],
        where: {
          userId,
          month,
          year,
        },
        _sum: {
          income: true,
          expense: true,
        },
        orderBy: {
          day: "asc",
        },
      });

      if (!data || data.length === 0) {
        [];
      }

      // transforming data for recharts
      const history: HistoryData[] = [];
      const daysInMonth = getDaysInMonth(new Date(year, month));

      for (let i = 0; i <= daysInMonth; i++) {
        let expense = 0;
        let income = 0;

        const day = data.find((row) => row.day === i);
        if (day) {
          expense = day._sum.expense || 0;
          income = day._sum.income || 0;
        }

        history.push({ year, income, expense, month, day: i });
      }

      return history;
    } catch (error) {
      console.error("Database Error - Month History Service");
      return null;
    }
  }
}

export default MonthHistoryService;
