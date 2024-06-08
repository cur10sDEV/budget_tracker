"use server";

import CategoryService from "@/data/categoryService";
import { validator } from "@/lib/zod/validator";
import { categorySchema, deleteCategorySchema } from "@/schemas/category";
import { CategorySchema, DeleteCategorySchema } from "@/types";
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
      const { name, icon, type } = validatedFields.data as CategorySchema;

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

export const deleteCategory = async (formData: DeleteCategorySchema) => {
  try {
    const user = await currentUser();

    if (!user) {
      redirect("/sign-in");
    }

    const validatedFields = validator(deleteCategorySchema, formData);

    if (validatedFields && validatedFields.data) {
      const { name, type } = validatedFields.data as DeleteCategorySchema;

      const result = await CategoryService.deleteCategory(user.id, type, name);

      return result;
    }
  } catch (error) {
    console.error(error);
  }
};
