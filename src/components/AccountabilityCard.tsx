import { api } from "~/utils/api";
import { classNames, timeSinceModifiedString } from "~/utils/shared/functions";
import type { User } from "@clerk/nextjs/dist/server";
import type { Membership } from "@prisma/client";

interface AccountabilityProps {
  teamId: string;
  user: User;
  membership: Membership;
  date: Date;
  type: string | undefined;
}

const AccountabilityCard = ({
  teamId,
  user,
  membership,
  date,
  type = "WEEK",
}: AccountabilityProps) => {
  const { data: { goals = [] } = {} } =
    api.goals.getUserGoalsForCurrentAccountabilityPeriod.useQuery({
      teamId,
      userId: user.id,
      selectedDate: date,
      type,
    });

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
            className="h-12 w-12 fill-green-100 stroke-green-600 md:h-10 md:w-10 lg:h-7 lg:w-7"
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
          <p
            className={classNames(
              "text-sm font-semibold leading-6 ",
              goal.completed ? "text-emerald-700" : "text-gray-900"
            )}
          >
            {goal.content}
          </p>
          <p
            className={classNames(
              "mt-1 flex text-xs leading-5",
              goal.completed ? "text-emerald-600" : "text-gray-500"
            )}
          >
            {goal.description}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-x-6">
        <div className="hidden min-w-max sm:flex sm:flex-col sm:items-end">
          {/* <p className="text-sm leading-6 text-gray-900">{goal.weight}</p> */}

          <p className="ml-8 mt-1 text-xs leading-5 text-gray-400">
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
      <div className="-mx-4 divide-y-2 rounded-lg  bg-gray-50 shadow-sm ring-1 ring-gray-900/5  sm:mx-0 lg:col-span-2 lg:col-start-1 lg:row-span-2 ">
        <AccountabilityHeader user={user} membership={membership} />
        <ul
          role="list"
          className="divide-y divide-gray-100 px-4 sm:px-8 sm:pb-8 xl:px-12 xl:pb-6"
        >
          {goalRows}
        </ul>
      </div>
    </>
  );
};

export default AccountabilityCard;

function AccountabilityHeader({
  user,
  membership,
}: {
  user: User;
  membership: Membership;
}) {
  return (
    <div className="ml-2 h-full rounded-lg bg-gray-50 px-4 py-5 sm:px-6">
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <img
            className="h-12 w-12 rounded-full"
            src={user.profileImageUrl}
            alt=""
          />
        </div>
        <div className=" min-w-0 flex-1 items-center pl-1">
          <p className="text-sm font-semibold text-gray-900">
            {user?.firstName}
          </p>
          <p className="text-sm text-gray-500">{membership.role}</p>
        </div>
        <div className="flex flex-shrink-0 self-center">
          {/* AccountabilityCard Header Menu (Vote, Message, etc) */}
          {/* <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="-m-2 flex items-center rounded-full p-2 text-gray-400 hover:text-gray-600">
                <span className="sr-only">Open options</span>
                <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
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
                        href="#"
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "flex px-4 py-2 text-sm"
                        )}
                      >
                        <StarIcon
                          className="mr-3 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        <span>Add to favorites</span>
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "flex px-4 py-2 text-sm"
                        )}
                      >
                        <CodeBracketIcon
                          className="mr-3 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        <span>Embed</span>
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "flex px-4 py-2 text-sm"
                        )}
                      >
                        <FlagIcon
                          className="mr-3 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        <span>Report content</span>
                      </a>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu> */}
        </div>
      </div>
    </div>
  );
}
