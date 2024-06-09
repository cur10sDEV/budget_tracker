import db from "@/lib/prisma/db";

class TransactionService {
  static async getTransactionsWithin(userId: string, from: Date, to: Date) {
    try {
      const transactions = await db.transaction.findMany({
        where: {
          userId,
          date: {
            lte: to,
            gte: from,
          },
        },
        orderBy: {
          date: "desc",
        },
      });

      return transactions;
    } catch (error) {
      console.error("Database Error - Transaction Service");
      return null;
    }
  }

  static async getUserStats(userId: string, from: Date, to: Date) {
    try {
      const totals = await db.transaction.groupBy({
        by: ["type"],
        where: {
          userId,
          date: {
            gte: from,
            lte: to,
          },
        },
        _sum: {
          amount: true,
        },
      });

      return {
        expense: totals.find((t) => t.type === "expense")?._sum.amount || 0,
        income: totals.find((t) => t.type === "income")?._sum.amount || 0,
      };
    } catch (error) {
      console.error("Database Error - Transaction Service");
      return null;
    }
  }

  static async getUserCategoryStats(userId: string, from: Date, to: Date) {
    try {
      const stats = await db.transaction.groupBy({
        by: ["type", "category", "categoryIcon"],
        where: {
          userId,
          date: {
            gte: from,
            lte: to,
          },
        },
        _sum: {
          amount: true,
        },
        orderBy: {
          _sum: {
            amount: "desc",
          },
        },
      });

      return stats;
    } catch (error) {
      console.error("Database Error - Transaction Service");
      return null;
    }
  }
}

export default TransactionService;
