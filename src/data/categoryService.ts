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
}

export default CategoryService;
