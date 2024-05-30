import CurrencySelector from "@/components/shared/CurrencySelector";
import Logo from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

const WizardPage = async () => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="container max-w-2xl flex flex-col items-center justify-between gap-4">
      <div className="text-center">
        <h1 className="text-3xl">
          Welcome, <span className="ml-2 font-bold">{user?.firstName}! 👋</span>
        </h1>
        <h2 className="mt-4 text-base text-muted-foreground">
          Let &apos;s get started by setting up your currency
        </h2>
        <h3 className="mt-2 text-sm text-muted-foreground">
          You can change this setting at any time
        </h3>
      </div>
      <Separator />
      <Card className="w-full bg-slate-900">
        <CardHeader>
          <CardTitle>Currency</CardTitle>
          <CardDescription>
            Set your default currency for description
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CurrencySelector />
        </CardContent>
      </Card>
      <Separator />
      <Button className="w-full" asChild>
        <Link href="/">I&apos;m done! Take me to the dashboard</Link>
      </Button>
      <div className="mt-8">
        <Logo />
      </div>
    </div>
  );
};
export default WizardPage;
