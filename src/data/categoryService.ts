import db from "@/lib/prisma/db";

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
  }: {
    name: string;
    icon: string;
    type: string;
    userId: string;
  }) {
    try {
      const createdCategory = await db.category.create({
        data: {
          userId,
          name,
          type,
          icon,
        },
      });

      return createdCategory;
    } catch (error) {
      console.error("Database Error - Category Service");
      return null;
    }
  }

  static async getAUserCategoryByName(userId: string, name: string) {
    try {
      const category = await db.category.findFirst({
        where: {
          userId,
          name,
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
