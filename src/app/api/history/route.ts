import MonthHistory from "@/data/monthHistory";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const periods = await MonthHistory.getHistoryPeriods(user.id);

  return Response.json(periods);
}
