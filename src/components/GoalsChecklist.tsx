/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import { Goal } from '@prisma/client'


const GoalsChecklist = ({ goals }: { goals: Goal[] }) => {
  
  const rows = goals.map((goal) => {
    return (
      <div className="relative flex items-start pb-4 pt-3.5">
      <div className="min-w-0 flex-1 text-sm leading-6">
        <label htmlFor="comments" className="font-medium text-gray-900">
          {goal.content}
        </label>
        <p id="comments-description" className="text-gray-500">
          {goal.description}
        </p>
      </div>
      <div className="ml-3 flex h-6 items-center">
        <input
          id="comments"
          aria-describedby="comments-description"
          name="comments"
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
          checked={goal.completed}
        />
      </div>
    </div>
    )
  })
  return (
    <fieldset className="border-b border-t border-gray-200">
      <legend className="sr-only">Notifications</legend>
      <div className="divide-y divide-gray-200">
      {rows}
      </div>
    </fieldset>
  )
}

export default GoalsChecklist;
