import InsightsContainer from "@/components/shared/insights/InsightsContainer";

const InsightsPage = () => {
  return (
    <>
      <div className="border-b bg-card">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
          <div>
            <p className="text-3xl font-bold">AI Insights</p>
            <p className="text-muted-foreground">
              The AI will generate you insights about your income and expense
              pattern
            </p>
          </div>
        </div>
      </div>
      <InsightsContainer />
    </>
  );
};

export default InsightsPage;
