import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

interface ISkeletonProps extends PropsWithChildren {
  isLoading: boolean;
  fullWidth?: boolean;
}

const SkeletonWrapper = ({
  children,
  isLoading,
  fullWidth = true,
}: ISkeletonProps) => {
  if (!isLoading) {
    return children;
  }

  return (
    <Skeleton className={cn(fullWidth && "w-full")}>
      <div className="opacity-0">{children}</div>
    </Skeleton>
  );
};
export default SkeletonWrapper;
