import { Discover } from "@/components/syndicates/portfolioAndDiscover/discover";
import ErrorBoundary from "@/components/errorBoundary";
import Layout from "@/components/layout";
import Head from "src/components/syndicates/shared/HeaderTitle";

export const DiscoverContent = () => {
  return (
    <Layout>
      <Head title="Discover" />
      <ErrorBoundary>
        <div className="w-full">
          {/* show discover content */}
          <div className="container mx-auto">
            <Discover />
          </div>
        </div>
      </ErrorBoundary>
    </Layout>
  );
};
