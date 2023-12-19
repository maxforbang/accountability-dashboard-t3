import { useState, type ReactElement } from "react";
import Layout from "~/components/Layout";
import type { NextPageWithLayout } from "./_app";
import Head from "next/head";
import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import SelfAccountabilityCard from "~/components/SelfAccountabilityCard";
import AccountabilityCard from "~/components/AccountabilityCard";

const Dashboard: NextPageWithLayout = () => {
  const { user } = useUser();

  const [selectedDate, setSelectedDate] = useState(new Date());

  const { data: { memberships = [], users = [] } = {} } =
    api.goals.getTeammates.useQuery({
      userId: user?.id || '1',
      teamId: user?.publicMetadata["currentTeamId"] as string,
    });

    if (!user) {
      return <p>Loading...</p>;
    }

  return (
    <>
      <Head>
        <title>
          {`${user.publicMetadata["currentTeamName"] as string}`}
        </title>
        <meta
          name="description"
          content="Accountability Dashboard. View goals and compare achievements weekly."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex flex-col items-start gap-8 lg:mx-0 lg:flex-row ">
            <div className="flex w-full flex-col lg:order-2 lg:basis-7/12">
              <div className="rounded-lg bg-gray-50 px-8 py-8 shadow-sm ring-1 ring-gray-900/5 sm:mx-0 sm:px-8 sm:pb-8 xl:px-12 xl:pb-6 xl:pt-12">
                <SelfAccountabilityCard
                  teamId={user.publicMetadata["currentTeamId"] as string}
                  userId={user.id}
                  date={selectedDate}
                  type="QUARTER"
                  editable={false}
                  setSelectedDate={setSelectedDate}
                />
              </div>
              <div>{/* <ActivityFeed /> */}</div>
            </div>
            <div className="flex w-full flex-col gap-8 ">
              <div className="rounded-lg bg-gray-50 px-8 py-8 shadow-sm ring-1 ring-gray-900/5 sm:mx-0 sm:px-8 sm:pb-8 xl:px-12 xl:pb-6 xl:pt-12">
                <SelfAccountabilityCard
                  teamId={user.publicMetadata["currentTeamId"] as string}
                  userId={user.id}
                  date={selectedDate}
                  type="WEEK"
                  setSelectedDate={setSelectedDate}
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
                      date={selectedDate}
                      type="WEEK"
                    />
                  )
                );
              })}
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
