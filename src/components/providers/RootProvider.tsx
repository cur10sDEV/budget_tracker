import { PropsWithChildren } from "react";
import QueryProvider from "./QueryProvider";
import ThemeProvider from "./ThemeProvider";

const RootProvider = ({ children }: PropsWithChildren) => {
  return (
    <QueryProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryProvider>
  );
};
export default RootProvider;
