import db from "@/lib/prisma/db";

class UserService {
  static async getUserSettings(userId: string) {
    try {
      const settings = await db.userSettings.findUnique({
        where: {
          userId,
        },
      });

      return settings;
    } catch (error) {
      console.error("Database Error - User Service");
      return null;
    }
  }

  static async createDefaultUserSettings(userId: string) {
    try {
      const settings = await db.userSettings.create({
        data: {
          currency: "USD",
          userId: userId,
        },
      });

      return settings;
    } catch (error) {
      console.error("Database Error - User Service");
      return null;
    }
  }
}

export default UserService;
