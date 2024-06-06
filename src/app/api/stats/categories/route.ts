import TransactionService from "@/data/transactionService";
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

  const { data: range }: { data: DateRangeSchema } = validatedFields;

  const stats = await TransactionService.getUserCategoryStats(
    user.id,
    range.from,
    range.to
  );

  return Response.json(stats);
}
