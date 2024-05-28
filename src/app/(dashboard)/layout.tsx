import Navbar from "@/components/shared/navbar/Navbar";
import { PropsWithChildren } from "react";

const DashboardLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="relative h-screen w-full flex flex-col">
      <Navbar />
      <div className="w-full">{children}</div>
    </div>
  );
};
export default DashboardLayout;
