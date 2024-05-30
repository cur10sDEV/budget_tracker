import UserService from "@/data/userService";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  try {
    let userSettings = await UserService.getUserSettings(user.id);

    if (!userSettings) {
      userSettings = await UserService.createDefaultUserSettings(user.id);
    }

    revalidatePath("/");
    return Response.json(userSettings);
  } catch (error) {
    console.error(error);
  }
}
