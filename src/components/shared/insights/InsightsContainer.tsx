"use client";

import SkeletonWrapper from "@/components/shared/loaders/SkeletonWrapper";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { DownloadIcon } from "lucide-react";
import { useRef } from "react";
import Markdown from "react-markdown";

const InsightsContainer = () => {
  const printElementRef = useRef<HTMLDivElement | null>(null);

  const { data, isFetching } = useQuery({
    queryKey: ["insights"],
    queryFn: async () => {
      const res = await fetch("/api/insights");
      const data = await res.json();
      return data;
    },
  });

  const handleClick = async () => {
    if (printElementRef.current && !isFetching && data) {
      const html2pdf = await require("html2pdf.js");
      html2pdf(printElementRef.current, {
        margin: 0.25,
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
        filename: `Financial_Report_${new Date().toLocaleString()}.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      });
    }
  };

  return (
    <div className="container flex flex-col gap-4 p-4 justify-center items-center">
      {isFetching ? (
        <p>Insights Generating... ✨</p>
      ) : (
        <p>Financial Insights Report ✨</p>
      )}
      {!data && !isFetching && (
        <div className="p-4 flex justify-center items-center">
          <p className="text-xl text-muted-foreground">
            No insights! <br />
            Click on Generate Insights button above to generate insights
          </p>
        </div>
      )}
      <ScrollArea
        className="h-[600px] lg:w-[800px] rounded-lg border shadow-md p-4"
        type="auto"
      >
        {isFetching && (
          <SkeletonWrapper isLoading={isFetching} fullWidth>
            <div className="w-full h-[565px]"></div>
          </SkeletonWrapper>
        )}

        {data && !isFetching && (
          <div className="report-container" ref={printElementRef}>
            <Markdown>{data}</Markdown>
          </div>
        )}
      </ScrollArea>
      <Button
        variant={"secondary"}
        disabled={isFetching || !data}
        onClick={handleClick}
      >
        <DownloadIcon className="mr-2 size-4" />
        Download Report
      </Button>
    </div>
  );
};

export default InsightsContainer;
