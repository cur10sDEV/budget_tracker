import Header from "@/components/shared/dashboard/Header";
import History from "@/components/shared/dashboard/History";
import Overview from "@/components/shared/dashboard/Overview";
import UserService from "@/data/userService";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const userSettings = await UserService.getUserSettings(user.id);

  if (!userSettings) {
    redirect("/wizard");
  }

  return (
    <div className="h-full bg-background">
      <div className="border-b bg-card">
        <Header firstName={user.firstName} />
      </div>
      <Overview userSettings={userSettings} />
      <History userSettings={userSettings} />
    </div>
  );
};
export default DashboardPage;
