import db from "@/lib/prisma/db";
import { TransactionType } from "@/types";

class CategoryService {
  static async getUserCategories(userId: string, type: string | null) {
    try {
      const userCategories = await db.category.findMany({
        where: {
          userId,
          ...(type && { type }), // include type in the filters if it's defined
        },
        orderBy: {
          name: "asc",
        },
      });

      return userCategories;
    } catch (error) {
      console.error("Database Error - Category Service");
      return null;
    }
  }

  static async createTransactionCategory({
    name,
    icon,
    type,
    userId,
    limit,
  }: {
    name: string;
    icon: string;
    type: string;
    userId: string;
    limit: number | undefined;
  }) {
    try {
      const createdCategory = await db.category.create({
        data: {
          userId,
          name,
          type,
          ...(limit && { limit }),
          icon,
        },
      });

      return createdCategory;
    } catch (error) {
      console.error("Database Error - Category Service");
      return null;
    }
  }

  static async getAUserCategoryById(userId: string, id: string) {
    try {
      const category = await db.category.findUnique({
        where: {
          userId,
          id,
        },
      });

      return category;
    } catch (error) {
      console.error("Database Error - Category Service");
      return null;
    }
  }

  static async deleteCategory(
    userId: string,
    type: TransactionType,
    name: string
  ) {
    try {
      const category = await db.category.delete({
        where: {
          name_type_userId: {
            userId,
            name,
            type,
          },
        },
      });

      return category;
    } catch (error) {
      console.error("Database Error - Category Service");
      return null;
    }
  }
}

export default CategoryService;
