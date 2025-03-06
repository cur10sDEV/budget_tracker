import {
  generateReportWithLLM,
  getUserInsights,
} from "@/server/actions/insights";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  try {
    const insights = await getUserInsights(user.id);

    const report = await generateReportWithLLM(insights);

    return NextResponse.json(report);
  } catch (error) {
    console.error(error);
    return NextResponse.json("Error generating insights");
  }
}
