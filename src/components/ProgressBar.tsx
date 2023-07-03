import { classNames } from "~/utils/shared/functions";

export function ProgressBar({ percentage }: { percentage: number }) {
  return (
    <div className="group relative">
      <div className="h-2 w-full rounded-full bg-gray-200 transition-all duration-300 dark:bg-gray-700">
        <span
          className={classNames(
            "absolute bottom-5 right-0 z-10 scale-0 rounded p-2 text-lg font-bold tracking-wide text-white duration-150 group-hover:scale-100 sm:right-16",
            percentage === 100 ? "bg-green-700" : "bg-sky-700"
          )}
        >
          {`${Math.round(percentage)}%`}
        </span>
        <div
          className={classNames(
            "h-2 rounded-full",
            percentage === 100 ? "bg-green-700" : "bg-sky-700"
          )}
          style={{ width: `${percentage}%`, transition: "width 0.5s" }}
        ></div>
      </div>
    </div>
  );
}
