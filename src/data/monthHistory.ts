import db from "@/lib/prisma/db";

class MonthHistory {
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
      console.error("Database Error - Transaction Service");
      return null;
    }
  }
}

export default MonthHistory;
