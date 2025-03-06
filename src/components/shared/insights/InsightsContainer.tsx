"use client";

import SkeletonWrapper from "@/components/shared/loaders/SkeletonWrapper";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { DownloadIcon } from "lucide-react";
import Markdown from "react-markdown";

const InsightsContainer = () => {
  const { data, isFetching } = useQuery({
    queryKey: ["insights"],
    queryFn: async () => {
      const res = await fetch("/api/insights");
      const data = await res.json();
      return data;
    },
  });

  return (
    <div className="container flex flex-col gap-4 p-4 justify-center items-center">
      <Button variant={"secondary"} disabled={isFetching || !data}>
        <DownloadIcon className="mr-2 size-4" />
        {isFetching ? "Generating Insights ✨" : "Download Insights ✨"}
      </Button>
      {!data && !isFetching && (
        <div className="p-4 flex justify-center items-center">
          <p className="text-xl text-muted-foreground">
            No insights! <br />
            Click on Generate Insights button above to generate insights
          </p>
        </div>
      )}
      <ScrollArea
        className="h-[650px] lg:w-[700px] rounded-lg border shadow-md p-4"
        type="auto"
      >
        {isFetching && (
          <SkeletonWrapper isLoading={isFetching} fullWidth>
            <div className="w-full h-[600px]"></div>
          </SkeletonWrapper>
        )}

        {data && !isFetching && (
          <div className="report-container">
            <Markdown>{data}</Markdown>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default InsightsContainer;
