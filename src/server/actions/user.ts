"use server";

import UserService from "@/data/userService";
import { validator } from "@/lib/zod/validator";
import { userSettingsSchema } from "@/schemas/user";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const updateUserCurrency = async (inputCurrency: string) => {
  try {
    const { data } = validator(userSettingsSchema, { currency: inputCurrency });

    const user = await currentUser();
    if (!user) {
      redirect("/sign-in");
    }

    const updatedUserSettings = await UserService.updateUserSettings(
      data.currency,
      user.id
    );

    return updatedUserSettings;
  } catch (error) {
    console.error(error);
  }
};
