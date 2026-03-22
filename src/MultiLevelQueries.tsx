import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import createUsersQueryOptions from "./queryOptions/createUsersQueryOptions"
import createTodoQueryOption from "./queryOptions/createTodoQueryOption"
import creaetPostQueryOptions from "./queryOptions/createPostQueryOptions";

// Refer to https://www.youtube.com/watch?v=mPaCnwpFvZY for Tanstack query video
const MultiLevelQueries = () => {

    const {data: users} = useQuery(createUsersQueryOptions());
    const randomId = Math.floor(Math.random() * users.length)
    //Below function we can use enabled property to make sure users are undefined
    // Here we can convert user array as boolean by adding double exclamation symbol !! 
            // Which means if users are defined, then we execute the below post query, 
            // otherwise, the query will not run 
    const {data: posts, isPending} = useQuery({...creaetPostQueryOptions(), enabled: !!users });

    // Alternatively we can use suspense query as below and get rid of enabled property as below
    ///// const {data: users} = useSuspenseQuery(createUsersQueryOptions());
    ///// const randomId = Math.floor(Math.random() * users.length)
    ///// const {data: posts, isPending} = useQuery(creaetPostQueryOptions());

  return (
    <div>MultiLevelQueries</div>
  )
}

export default MultiLevelQueries