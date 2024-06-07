import MonthHistoryService from "@/data/monthHistoryService";
import YearHistoryService from "@/data/yearHistoryService";
import { validator } from "@/lib/zod/validator";
import { queryHistoryDataSchema } from "@/schemas/history";
import { HistoryData, QueryHistoryData } from "@/types";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { searchParams } = new URL(request.url);
  const timeframe = searchParams.get("timeframe");
  const year = searchParams.get("year");
  const month = searchParams.get("month");

  const validatedFields = validator(queryHistoryDataSchema, {
    timeframe,
    year,
    month,
  });

  if (!validatedFields || !validatedFields.data) {
    return Response.json("Invalid Fields", { status: 400 });
  }

  const data = validatedFields.data as QueryHistoryData;

  let historyData: HistoryData[] | null = [];

  if (data.timeframe === "month") {
    historyData = await MonthHistoryService.getHistoryData(
      user.id,
      data.month,
      data.year
    );
  } else if (data.timeframe === "year") {
    historyData = await YearHistoryService.getHistoryData(user.id, data.year);
  }

  return Response.json(historyData);
}
