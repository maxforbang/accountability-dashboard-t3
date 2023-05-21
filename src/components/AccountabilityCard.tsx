import { Component } from "react";
import { api } from "~/utils/api";
import GoalsChecklist, {  } from "./GoalsChecklist";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { timeSinceModifiedString } from "~/utils/shared/functions";
//import { AccountabilityType } from "@prisma/client";

interface AccountabilityProps {
  teamId: string;
  userId: string;
  date: Date;
  type: string | undefined;
}

const AccountabilityCard = ({
  teamId,
  userId,
  date,
  type = "WEEK",
}: AccountabilityProps) => {
  const { data: { goals = [], accountabilityPeriod } = {} } =
    api.goals.getUserGoalsForCurrentAccountabilityPeriod.useQuery({
      teamId,
      userId,
      selectedDate: date,
      type,
    });

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const goalRows = goals.map((goal) => (
    <li key={goal.id} className="flex justify-between gap-x-6 py-5 ">
      <div className="flex items-center gap-x-4">
        {goal.completed ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-12 w-12 lg:h-7 lg:w-7 md:h-10 md:w-10 fill-green-100 stroke-green-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-7 w-7 stroke-gray-300 "
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}

        <div className="min-w-0 flex-auto">
          <p className={classNames("text-sm font-semibold leading-6 ", goal.completed ? "text-emerald-700" : "text-gray-900")}>
            {goal.content}
          </p>
          <p className={classNames("mt-1 flex text-xs leading-5", goal.completed ? "text-emerald-600" : "text-gray-500")}>
            {goal.description}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-x-6">
        <div className="hidden sm:flex sm:flex-col sm:items-end min-w-max">
          <p className="text-sm leading-6 text-gray-900">{goal.weight}</p>

          <p className="mt-1 text-xs leading-5 text-gray-400 ml-8">
            {timeSinceModifiedString(goal)}
          </p>
        </div>
        {/* Teammate Goal Options (View Info, Comment, Duplicate?) */}
        {/* <Menu as="div" className="relative flex-none">
          <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
            <span className="sr-only">Open options</span>
            <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? "bg-gray-50" : "",
                      "block px-3 py-1 text-sm leading-6 text-gray-900"
                    )}
                  >
                    View profile
                    <span className="sr-only">, {person.name}</span>
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? "bg-gray-50" : "",
                      "block px-3 py-1 text-sm leading-6 text-gray-900"
                    )}
                  >
                    Message
                    <span className="sr-only">, {person.name}</span>
                  </a>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu> */}
      </div>
    </li>
  ));

  return (
    <>
      <div className="-mx-4 rounded-lg bg-gray-50 px-4 py-8 shadow-sm ring-1 ring-gray-900/5 sm:mx-0 sm:px-8 sm:pb-8 lg:col-span-2 lg:col-start-1 lg:row-span-2 xl:px-12 xl:pb-6 xl:pt-12">
        <h2 className="mb-8 text-3xl font-semibold leading-6 text-gray-900">
          Goals
        </h2>

        <ul role="list" className="divide-y divide-gray-100">
          {goalRows}
        </ul>
      </div>
    </>
  );
};

export default AccountabilityCard;
