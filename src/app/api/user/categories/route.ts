import CategoryService from "@/data/categoryService";
import { validator } from "@/lib/zod/validator";
import { transactionTypeSchema } from "@/schemas/transaction";
import { TransactionType } from "@/types";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const { searchParams } = new URL(request.url);
  const paramType = searchParams.get("type");

  const validatedFields = validator(transactionTypeSchema, paramType);

  if (validatedFields && validatedFields.data) {
    const type = validatedFields.data as TransactionType;

    const userCategories = await CategoryService.getUserCategories(
      user.id,
      type
    );

    return Response.json(userCategories);
  }

  return Response.json("Invalid fields", { status: 400 });
}
