import { useQueries } from "@tanstack/react-query"
import createTodoQueryOption from "./queryOptions/createTodoQueryOption"
import createUsersQueryOptions from "./queryOptions/createUsersQueryOptions"
import createPostQueryOptions from "./queryOptions/createPostQueryOptions"

// Refer to https://www.youtube.com/watch?v=mPaCnwpFvZY for Tanstack query video

  /** Executing/calling multiple independant querries use useQueries() which takes an array of queries
   * to be exeucted for e.g., 
   * This approach will not be useful, when one query results is feed into another query
   */
const MultipleQueries = () => {

    const { {data}, data2, data3 } = useQueries({ 
        queries: [
            createTodoQueryOption(), 
            createUsersQueryOptions(),
            createPostQueryOptions(),
        ], })

        const Card = () => {
        return (
            <div className="p-4 border-blue-500 border-2">
                <h1 className="text-blue-500 text-5xl mb-2">CARD</h1>
                {JSON.stringify(data.slice(0,15))}

            </div>
        )
        }
}


