"use server";

import CategoryService from "@/data/categoryService";
import TransactionService from "@/data/transactionService";
import db from "@/lib/prisma/db";
import { validator } from "@/lib/zod/validator";
import { transactionSchema } from "@/schemas/transaction";
import { TransactionSchema } from "@/types";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const createTransaction = async (formData: TransactionSchema) => {
  try {
    const user = await currentUser();

    if (!user) {
      redirect("/sign-in");
    }

    const validatedFields = validator(transactionSchema, formData);

    if (validatedFields && validatedFields.data) {
      const { type, amount, category, description, date } =
        validatedFields.data as TransactionSchema;

      const isCategory = await CategoryService.getAUserCategoryByName(
        user.id,
        category
      );

      if (!isCategory) {
        throw new Error("Category not found!");
      }

      // db $transaction to perform multiple operations - new transaction and update aggregate tables

      await db.$transaction([
        db.transaction.create({
          data: {
            amount,
            date,
            description: description || "",
            type,
            category: isCategory.name,
            categoryIcon: isCategory.icon,
            userId: user.id,
          },
        }),
        db.monthHistory.upsert({
          where: {
            day_month_year_userId: {
              userId: user.id,
              day: date.getUTCDate(),
              year: date.getUTCFullYear(),
              month: date.getUTCMonth(),
            },
          },
          create: {
            userId: user.id,
            day: date.getUTCDate(),
            year: date.getUTCFullYear(),
            month: date.getUTCMonth(),
            expense: type === "expense" ? amount : 0,
            income: type === "income" ? amount : 0,
          },
          update: {
            expense: {
              increment: type === "expense" ? amount : 0,
            },
            income: {
              increment: type === "income" ? amount : 0,
            },
          },
        }),
        db.yearHistory.upsert({
          where: {
            month_year_userId: {
              year: date.getUTCFullYear(),
              month: date.getUTCMonth(),
              userId: user.id,
            },
          },
          create: {
            userId: user.id,
            year: date.getUTCFullYear(),
            month: date.getUTCMonth(),
            expense: type === "expense" ? amount : 0,
            income: type === "income" ? amount : 0,
          },
          update: {
            expense: {
              increment: type === "expense" ? amount : 0,
            },
            income: {
              increment: type === "income" ? amount : 0,
            },
          },
        }),
      ]);
    }
  } catch (error) {
    console.error(error);
  }
};

export const deleteTransaction = async (id: string) => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const transaction = await TransactionService.getUserTransactionById(
    id,
    user.id
  );

  if (!transaction) {
    throw new Error("Bad Request - Transaction not found!");
  }

  await db.$transaction([
    db.transaction.delete({
      where: {
        id: transaction.id,
        userId: user.id,
      },
    }),
    db.monthHistory.update({
      where: {
        day_month_year_userId: {
          userId: user.id,
          day: transaction.date.getUTCDate(),
          month: transaction.date.getUTCMonth(),
          year: transaction.date.getUTCFullYear(),
        },
      },
      data: {
        ...(transaction.type === "expense" && {
          expense: {
            decrement: transaction.amount,
          },
        }),
        ...(transaction.type === "income" && {
          income: {
            decrement: transaction.amount,
          },
        }),
      },
    }),
    db.yearHistory.update({
      where: {
        month_year_userId: {
          userId: user.id,
          month: transaction.date.getUTCMonth(),
          year: transaction.date.getUTCFullYear(),
        },
      },
      data: {
        ...(transaction.type === "expense" && {
          expense: {
            decrement: transaction.amount,
          },
        }),
        ...(transaction.type === "income" && {
          income: {
            decrement: transaction.amount,
          },
        }),
      },
    }),
  ]);
};
