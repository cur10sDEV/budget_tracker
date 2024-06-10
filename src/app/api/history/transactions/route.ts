import TransactionService from "@/data/transactionService";
import UserService from "@/data/userService";
import { formatCurrency } from "@/lib/utils";
import { validator } from "@/lib/zod/validator";
import { dateRangeSchema } from "@/schemas/date";
import { DateRangeSchema } from "@/types";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const validatedFields = validator(dateRangeSchema, { from, to });

  if (!validatedFields || !validatedFields.data) {
    return Response.json("Invalid Fields", { status: 400 });
  }

  const data = validatedFields.data as DateRangeSchema;

  const userSettings = await UserService.getUserSettings(user.id);

  if (!userSettings) {
    throw new Error("User settings not found!");
  }

  const formatter = formatCurrency(userSettings.currency);

  const transactions = await TransactionService.getTransactionsWithin(
    user.id,
    data.from,
    data.to
  );

  const result = transactions?.map((t) => ({
    ...t,
    formattedAmount: formatter.format(t.amount),
  }));

  return Response.json(result);
}
