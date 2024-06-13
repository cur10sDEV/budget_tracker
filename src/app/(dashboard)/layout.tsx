import Navbar from "@/components/shared/navbar/Navbar";
import type { Metadata, Viewport } from "next";
import { PropsWithChildren } from "react";

const APP_NAME = "Budget Tracker";
const APP_DEFAULT_TITLE = "Budget Tracker";
const APP_TITLE_TEMPLATE = "%s - Budget Tracker";
const APP_DESCRIPTION =
  "This is a budget tracker application to track all your incomes and expenses";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#f97316",
};

const DashboardLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="relative h-screen w-full flex flex-col">
      <Navbar />
      <div className="w-full">{children}</div>
    </div>
  );
};
export default DashboardLayout;
