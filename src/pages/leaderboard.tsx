import type { ReactElement } from "react";
import Layout from "~/components/Layout";
// import NestedLayout from '../components/nested-layout';
import type { NextPageWithLayout } from "./_app";
import Head from "next/head";
import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";

const Dashboard: NextPageWithLayout = () => {
  const { user } = useUser();

  if (!user) {
    return <p>Loading user...</p>;
  }

  return (
    <>
      <Head>
        <title>{`Leaderboard | ${user.publicMetadata["currentTeamName"] as string}`}</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto  max-w-2xl items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3 ">
          <div className="-mx-4 rounded-lg bg-gray-50 px-4 py-8 shadow-sm ring-1 ring-gray-900/5 sm:mx-0 sm:px-8 sm:pb-8 lg:col-span-1 lg:col-start-3 lg:row-span-1 lg:row-end-1 xl:px-8 xl:pb-6 xl:pt-8">
            <Leaderboard />
          </div>
        </div>
      </div>
    </>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Dashboard;

function Leaderboard() {

  const {user} = useUser();

  if (!user) {
    return <p>Loading...</p>
  }

  const { data: {memberships = [], users = []} = {} } = api.goals.getTeam.useQuery({
    teamId: user.publicMetadata["currentTeamId"] as string,
  });

  users.sort((userA, userB) => {
    const userAEars = memberships.find(member => member.userId === userA.id)?.pigEars;
    const userBEars = memberships.find(member => member.userId === userB.id)?.pigEars;
    return (userBEars ?? 0) - (userAEars ?? 0);
  })

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-semibold leading-6 text-gray-900">
            Pig Ears
          </h1>
          <p className="mt-4 text-sm text-gray-700">
            Number of times your bean 🫘 has hit this quarter.
          </p>
        </div>
        {/* Leaderboard Action Button */}
        {/* <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add user
          </button>
        </div> */}
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Pig Ears
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Member
                  </th>
                  {/* Most Recent */}
                  {/* <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Most Recent
                  </th> */}


                  {/* Empty th for Edit Row Button */}
                  {/* <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-gray-50">
                {users.map((user) => (
                  <tr key={`table-row-${user.id}`}>

                    <td className="whitespace-nowrap px-3 py-5 text-xl text-gray-500">
                      <div className="text-gray-900">{memberships.find(member => member.userId === user.id)?.pigEars}</div>
                      {/* <div className="mt-1 text-gray-500">
                        {person.department}
                      </div> */}
                    </td>
                    <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                      <div className="flex items-center">
                        <div className="h-11 w-11 flex-shrink-0">
                          <img
                            className="h-11 w-11 rounded-full"
                            src={user.profileImageUrl}
                            alt=""
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="mt-1 text-gray-500">
                            {memberships.find(member => member.userId === user.id)?.role}
                          </div>
                        </div>
                      </div>
                    </td>
                    {/* Most Recent */}
                    {/* <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        Active
                      </span>
                    </td> */}


                    {/* Edit Row Button */}
                    {/* <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <a
                        href="#"
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit<span className="sr-only">, {person.name}</span>
                      </a>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
