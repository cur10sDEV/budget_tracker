"use server";

import db from "@/lib/prisma/db";
import { FinancialSummary } from "@/types";
import Groq from "groq-sdk";

const groq = new Groq();
export async function getUserInsights(userId: string) {
  // Aggregate yearly earnings, expenses, and savings
  const yearlyData = await db.yearHistory.groupBy({
    by: ["year"],
    where: { userId },
    _sum: { income: true, expense: true },
  });

  // Calculate average spending, earning, and savings for each year
  const yearlySummary = yearlyData.map((year) => ({
    year: year.year,
    averageEarning: (year._sum.income ?? 0) / 12, // Assuming 12 months
    averageSpending: (year._sum.expense ?? 0) / 12,
    averageSavings: ((year._sum.income ?? 0) - (year._sum.expense ?? 0)) / 12,
    totalIncome: year._sum.income ?? 0,
    totalExpense: year._sum.expense ?? 0,
  }));

  // Total income and expenses up till now
  const totalStats = await db.transaction.aggregate({
    where: { userId },
    _sum: { amount: true },
  });

  // Income per category
  const incomeStats = await db.transaction.groupBy({
    by: ["category"],
    where: { userId, type: "income" },
    _sum: { amount: true },
  });

  // Expense per category
  const expenseStats = await db.transaction.groupBy({
    by: ["category"],
    where: { userId, type: "expense" },
    _sum: { amount: true },
  });

  // Find most and least performing income category
  const sortedIncome = incomeStats.sort(
    (a, b) => (b._sum.amount ?? 0) - (a._sum.amount ?? 0)
  );
  const bestIncomeCategory = sortedIncome[0] ?? null;
  const worstIncomeCategory = sortedIncome[sortedIncome.length - 1] ?? null;

  // Find most and least performing expense category
  const sortedExpense = expenseStats.sort(
    (a, b) => (b._sum.amount ?? 0) - (a._sum.amount ?? 0)
  );
  const highestExpenseCategory = sortedExpense[0] ?? null;
  const lowestExpenseCategory = sortedExpense[sortedExpense.length - 1] ?? null;

  return {
    summary: {
      totalIncome: totalStats._sum.amount ?? 0,
      totalExpense: totalStats._sum.amount ?? 0,
    },
    yearlySummary,
    categorySummary: {
      incomeCategories: incomeStats.map((i) => ({
        category: i.category,
        totalEarned: i._sum.amount ?? 0,
      })),
      expenseCategories: expenseStats.map((e) => ({
        category: e.category,
        totalSpent: e._sum.amount ?? 0,
      })),
    },
    bestAndWorstCategories: {
      bestIncomeCategory: bestIncomeCategory
        ? {
            category: bestIncomeCategory.category,
            totalEarned: bestIncomeCategory._sum.amount,
          }
        : null,
      worstIncomeCategory: worstIncomeCategory
        ? {
            category: worstIncomeCategory.category,
            totalEarned: worstIncomeCategory._sum.amount,
          }
        : null,
      highestExpenseCategory: highestExpenseCategory
        ? {
            category: highestExpenseCategory.category,
            totalSpent: highestExpenseCategory._sum.amount,
          }
        : null,
      lowestExpenseCategory: lowestExpenseCategory
        ? {
            category: lowestExpenseCategory.category,
            totalSpent: lowestExpenseCategory._sum.amount,
          }
        : null,
    },
  };
}

export const generateReportWithLLM = async (insights: FinancialSummary) => {
  if (!insights) return `Problem Generating Insights 😥`;

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          'You are a financial assistant. Given the user\'s financial data in JSON format, generate a detailed financial insights report in a structured and human-friendly format. The report should include the following sections:\n\n  1. Financial Overview\n  Total income and expenses so far\n  Net savings so far\n\n  2. Yearly Financial Trends\n  Total income, expenses, and savings for each year\n  Average monthly income, spending, and savings\n\n  3. Category-Wise Breakdown\n  Income categories: Which category earned the most and the least\n  Expense categories: Which category had the highest and lowest spending\n\n  4. Predictions (if possible based on past trends)\n  Estimated income and expenses for the next month\n  Projected total income and expenses for the year\n  Estimated savings by the end of the year\n\n  5. Key Insights & Suggestions\n  Provide useful insights based on trends\n  Identify any spending patterns\n  Suggest ways to improve financial health\n\n  💾 Input Data Format (Example JSON):\n  {\n    "summary": {\n      "totalIncome": 5779,\n      "totalExpense": 5779\n    },\n    "yearlySummary": [\n      {\n        "year": 2025,\n        "averageEarning": 291.67,\n        "averageSpending": 189.92,\n        "averageSavings": 101.75,\n        "totalIncome": 3500,\n        "totalExpense": 2279\n      }\n    ],\n    "categorySummary": {\n      "incomeCategories": [\n        {\n          "category": "Freelancing",\n          "totalEarned": 3500\n        }\n      ],\n      "expenseCategories": [\n        {\n          "category": "Audio",\n          "totalSpent": 1200\n        },\n        {\n          "category": "Tech",\n          "totalSpent": 999\n        },\n        {\n          "category": "Junk Food",\n          "totalSpent": 80\n        }\n      ]\n    },\n    "bestAndWorstCategories": {\n      "bestIncomeCategory": {\n        "category": "Freelancing",\n        "totalEarned": 3500\n      },\n      "worstIncomeCategory": {\n        "category": "Freelancing",\n        "totalEarned": 3500\n      },\n      "highestExpenseCategory": {\n        "category": "Audio",\n        "totalSpent": 1200\n      },\n      "lowestExpenseCategory": {\n        "category": "Junk Food",\n        "totalSpent": 80\n      }\n    }\n  }\n\n  📌 Output Format:\n  Generate the report in an engaging, structured, and easy-to-read format like this:\n  Use emojis for better readability\n  Provide bullet points for insights\n  Keep financial terminology clear and user-friendly',
      },
      {
        role: "user",
        content: `Generate financial report for the user data: ${JSON.stringify(
          insights
        )}`,
      },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 1,
    max_completion_tokens: 1024,
    top_p: 1,
    stream: true,
    stop: null,
  });

  const chunks = [];
  for await (const chunk of chatCompletion) {
    chunks.push(chunk.choices[0]?.delta?.content || "");
  }

  const content = chunks.join("");
  return content;
};
