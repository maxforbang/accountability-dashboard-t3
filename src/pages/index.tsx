import type { ReactElement } from "react";
import Layout from "../components/Layout";
import type { NextPageWithLayout } from "./_app";
import Head from "next/head";
import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import SelfAccountabilityCard from "~/components/SelfAccountabilityCard";
import AccountabilityCard from "~/components/AccountabilityCard";

const Dashboard: NextPageWithLayout = () => {
  const { user } = useUser();

  if (!user) {
    return <p>Loading...</p>;
  }

  const { data: { memberships = [], users = [] } = {} } =
    api.goals.getTeammates.useQuery({
      userId: user.id,
      teamId: user.publicMetadata["currentTeamId"] as string,
    });

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
      <main>
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3 ">
            <div className="-mx-4 rounded-lg bg-gray-50 px-4 py-8 shadow-sm ring-1 ring-gray-900/5 sm:mx-0 sm:px-8 sm:pb-8 lg:col-span-1 lg:col-start-3 lg:row-span-1 lg:row-end-1 xl:px-8 xl:pb-6 xl:pt-8">
              <SelfAccountabilityCard
                teamId={user.publicMetadata["currentTeamId"] as string}
                userId={user.id}
                date={new Date()}
                type="QUARTER"
              />
            </div>

            <div className="-mx-4 rounded-lg bg-gray-50 px-4 py-8 shadow-sm ring-1 ring-gray-900/5 sm:mx-0 sm:px-8 sm:pb-8 lg:col-span-2 lg:col-start-1 lg:row-span-2 lg:row-end-2 xl:px-12 xl:pb-6 xl:pt-12">
              <SelfAccountabilityCard
                teamId={user.publicMetadata["currentTeamId"] as string}
                userId={user.id}
                date={new Date()}
                type="WEEK"
              />
            </div>
            {memberships.map((member) => {
              const memberUser = users.find(
                (user) => user.id === member.userId
              );
              return (
                memberUser && (
                  <AccountabilityCard
                    user={memberUser}
                    membership={member}
                    teamId={member.teamId}
                    date={new Date()}
                    type="WEEK"
                  />
                )
              );
            })}

            <div className="lg:col-start-3 lg:row-start-2">
              {/* <ActivityFeed /> */}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
