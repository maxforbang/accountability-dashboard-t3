import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import GoalsChecklist from "./GoalsChecklist";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import EditGoalsChecklist from "./EditGoalsChecklist";
import { useUser } from "@clerk/nextjs";
import { classNames } from "~/utils/shared/functions";
import type { AccountabilityPeriod, Goal } from "@prisma/client";

const dateFormatOptions: Intl.DateTimeFormatOptions = {
  month: "long",
  day: "numeric",
};

interface AccountabilityProps {
  teamId: string;
  userId: string;
  date: Date;
  type: string | undefined;
}

// type AccountabilityGoals =
//   RouterOutputs["goals"]["getUserGoalsForCurrentAccountabilityPeriod"];

const SelfAccountabilityCard = ({
  teamId,
  userId,
  date,
  type = "WEEK",
}: AccountabilityProps) => {
  const ctx = api.useContext();
  const { user } = useUser();

  const { mutate: markAllComplete } = api.goals.markAllComplete.useMutation({
    onSuccess: () => {
      void ctx.goals.getUserGoalsForCurrentAccountabilityPeriod.invalidate();
    },
  });

  const { mutate: deleteAllGoals } = api.goals.deleteAll.useMutation({
    onSuccess: () => {
      void ctx.goals.getUserGoalsForCurrentAccountabilityPeriod.invalidate();
    },
  });

  const { data: { goals = [] as Goal[], accountabilityPeriod = {} as AccountabilityPeriod} = {}, isSuccess } =
    api.goals.getUserGoalsForCurrentAccountabilityPeriod.useQuery({
      teamId,
      userId,
      selectedDate: date,
      type,
      
    });

  const [editMode, setEditMode] = useState(false);

  
  useEffect(() => {
    if (isSuccess && goals.length === 0) {
      setEditMode(true);
    }
  }, [isSuccess]);
  
  if (!user) {
    return null;
  }
  
  return (
    <>
      <div className="border-b border-gray-200 px-3 pb-8 sm:px-0">
        <div className="flex sm:flex sm:items-baseline sm:justify-between">
          <div className="min-w-5 sm:w-0 sm:flex-1">
            <h1
              id="message-heading"
              className="text-4xl font-semibold text-gray-900 "
            >
              {`${type[0] ?? ""}${type.slice(1, type.length).toLowerCase() ?? ""}`} Goals
            </h1>
            <p className="ml-1 mt-2 truncate text-xl text-gray-500">
              {accountabilityPeriod?.startDay?.toLocaleDateString(
                undefined,
                dateFormatOptions
              )}{" "}
              -{" "}
              {accountabilityPeriod?.endDay?.toLocaleDateString(
                undefined,
                dateFormatOptions
              )}
            </p>
          </div>

          <div className="ml-auto mt-4 flex sm:ml-6 sm:mt-0 sm:flex-shrink-0 sm:justify-start ">
            {/* <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              Open
            </span> */}
            <Menu as="div" className="relative ml-3 inline-block text-left">
              <div>
                <Menu.Button className="-my-2 flex items-center rounded-full bg-gray-200 p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <span className="sr-only">Open options</span>
                  <EllipsisVerticalIcon
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "flex px-4 py-2 text-sm"
                          )}
                          onClick={() => setEditMode(!editMode)}
                        >
                          {editMode ? (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="h-6 w-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                                />
                              </svg>

                              <span className="ml-2">Finish Editing</span>
                            </>
                          ) : (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="h-6 w-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                />
                              </svg>

                              <span className="ml-2">Edit</span>
                            </>
                          )}
                        </a>
                      )}
                    </Menu.Item>
                    {/* Duplicate Option */}
                    {/* <Menu.Item>
                      {({ active }) => (
                        <a
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "flex px-4 py-2 text-sm"
                          )}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="h-6 w-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                            />
                          </svg>

                          <span className="ml-2">Duplicate</span>
                        </a>
                      )}
                    </Menu.Item> */}
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          type="button"
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "flex w-full px-4 py-2 text-sm"
                          )}
                          onClick={
                            editMode
                              ? () =>
                                  deleteAllGoals({
                                    userId: user.id,
                                    accountabilityPeriodId:
                                      accountabilityPeriod.id,
                                  })
                              : () =>
                                  markAllComplete({
                                    userId: user.id,
                                    accountabilityPeriodId:
                                      accountabilityPeriod.id,
                                  })
                          }
                        >
                          {editMode ? (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="h-6 w-6 fill-red-200 stroke-red-500"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                />
                              </svg>
                              <span className="ml-2 text-red-500">
                                Delete all goals
                              </span>
                            </>
                          ) : (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="h-6 w-6 fill-green-100 stroke-green-600"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>

                              <span className="ml-2 text-green-700">
                                Mark all as complete
                              </span>
                            </>
                          )}
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
      {editMode ? (
        <EditGoalsChecklist
          goals={goals}
          accountabilityPeriod={accountabilityPeriod}
        />
      ) : (
        <GoalsChecklist goals={goals} />
      )}
    </>
  );
};

export default SelfAccountabilityCard;
