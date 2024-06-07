import db from "@/lib/prisma/db";
import { HistoryData } from "@/types";

class YearHistoryService {
  static async getHistoryData(userId: string, year: number) {
    try {
      const data = await db.yearHistory.groupBy({
        by: ["month"],
        where: {
          userId,
          year,
        },
        _sum: {
          income: true,
          expense: true,
        },
        orderBy: {
          month: "asc",
        },
      });

      if (!data || data.length === 0) {
        [];
      }

      // transforming data for recharts
      const history: HistoryData[] = [];

      for (let i = 0; i < 12; i++) {
        let expense = 0;
        let income = 0;

        const month = data.find((row) => row.month === i);
        if (month) {
          expense = month._sum.expense || 0;
          income = month._sum.income || 0;
        }

        history.push({ year, income, expense, month: i });
      }

      return history;
    } catch (error) {
      console.error("Database Error - Year History Service");
      return null;
    }
  }
}

export default YearHistoryService;
