import { useUser } from "@clerk/nextjs";
import {
  CalendarDaysIcon,
  CreditCardIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Component } from "react";
import SelfAccountabilityCard from "./SelfAccountabilityCard";

const QuarterCard = () => {

  const { user, isSignedIn } = useUser();

  if (!user) {
    return <p>Loading...</p>;
  }
  
  return (
    <>
      <div className="lg:col-start-3 lg:row-end-1">
        <h2 className="sr-only">Summary</h2>
        <div className="rounded-lg bg-gray-50 shadow-sm ring-1 ring-gray-900/5">
          <dl className="flex flex-wrap">
            <div className="flex-auto pl-6 pt-6 text-3xl font-semibold leading-6 text-gray-900">
              Quarter 2
            </div>
            <div className="flex-none self-end px-6 pt-4">
              <dt className="sr-only">Status</dt>
              <dd className="rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-600 ring-1 ring-inset ring-green-600/20">
                Paid
              </dd>
            </div>
            {/* <div className="mt-6 flex w-full flex-none gap-x-4 border-t border-gray-900/5 px-6 pt-6"></div> */}

            {/* <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
                    <dt className="flex-none">
                      <span className="sr-only">Status</span>
                      <CreditCardIcon
                        className="h-6 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </dt>
                    <dd className="text-sm leading-6 text-gray-500">
                      Paid with MasterCard
                    </dd>
                  </div> */}
          </dl>
          <div className="mt-6 border-t border-gray-900/5 px-6 py-6">
            <SelfAccountabilityCard
              teamId={user.publicMetadata["currentTeamId"] as string}
              userId={user.id}
              date={new Date()}
              type="QUARTER"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default QuarterCard;