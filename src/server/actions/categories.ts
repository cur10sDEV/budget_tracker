"use server";

import CategoryService from "@/data/categoryService";
import { validator } from "@/lib/zod/validator";
import { categorySchema } from "@/schemas/category";
import { CategorySchema } from "@/types";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const createCategory = async (formData: CategorySchema) => {
  try {
    const user = await currentUser();

    if (!user) {
      redirect("/sign-in");
    }

    const validatedFields = validator(categorySchema, formData);

    if (validatedFields && validatedFields.data) {
      const { name, icon, type } = validatedFields.data;

      const createdCategory = await CategoryService.createTransactionCategory({
        name,
        icon,
        type,
        userId: user?.id,
      });

      return createdCategory;
    }
  } catch (error) {
    console.error(error);
  }
};
