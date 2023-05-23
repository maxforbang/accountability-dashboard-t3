import type { ReactElement } from "react";
import Layout from "~/components/Layout";
// import NestedLayout from '../components/nested-layout';
import type { NextPageWithLayout } from "./_app";
import Head from "next/head";
import { useUser } from "@clerk/nextjs";

const Dashboard: NextPageWithLayout = () => {
  const { user } = useUser();

  if (!user) {
    return <p>Loading user...</p>;
  }

  return (
    <>
      <Head>
        <title>{`Dashboard | ${user.publicMetadata["currentTeamName"] as string}`}</title>
        <meta
          name="description"
          content="Accountability Dashboard. View goals and compare achievements weekly."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Dashboard;
