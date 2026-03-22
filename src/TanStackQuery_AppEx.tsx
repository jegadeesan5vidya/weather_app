import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import Loading from "./assets/Loading.svg?React"
import { Suspense, useState } from "react"
import createTodoQueryOption from "./queryOptions/createTodoQueryOption"

import Card from "./Card"

// Refer to https://www.youtube.com/watch?v=mPaCnwpFvZY for Tanstack query video

function App() {

  // This app is going to use two technologies
  // 1. TailWind for styling - Its a way of writing convenient css styles using 
  //  class name of JSX elements instead of using separate css files 
  // 2. Tanstack query (React Query) for data fetching

  // Below query hook takes two params, one is query key array (which should be unique) and second 
  // one is the query function (queryFn), is a function which runs when run a query that 
  // mentioned by the query key.  We can mention an API(fetch command or axios) which can fetch the required data
  // const query = useQuery({
  //   queryKey: ['todos'],
  //   queryFn: getTodos
  // })

  // What this useQuery returns, refer to https://tanstack.com/query/latest/docs/framework/react/reference/useQuery
  // Destructuing above code to specify what we need from the user query 
  // Here we extract data, isPending (loading),  isFetching(while fetching, refetch, error etc, from useQuery)
  // const {data, isPending, isFetching, refetch, error} = useQuery({
  //   queryKey: ['todos'],
  //   queryFn: getTodos
  // })

  // if(error)
  // {alert("Something went wrong...")}

  // Now we want to pass some parameter to an query, how to do that
  const [id, setId] = useState(1)

  // Pass this id below useQuery's queryKey and then to queryFn
  // const {data, isPending, isFetching, refetch, error} = useQuery({
  //   queryKey: ['comments', id],
  //   queryFn: () => getComments(id),
  // })

  // if(error)
  // {alert("Something went wrong...")}

  // We can call query based on certain condition - i.e., conditional query 
  // Below query runs when on is true and do not run when it is false...
  // const [on, setOn] = useState(true)
  // const {data, isPending1} = useQuery(
  //   {
  //     queryKey: ['todos'],
  //     queryFn: getTodos,
  //     enabled: on
  //   }
  // )

  // Also we can move above query into separate file for easy maintenance and use it across the project
  // refer to createTodoQueryOption.ts file under new folder queryOptions


  // When using useQuery, We may get data is undefined, to avoid this and get 
  // guaranteed data result, we can use useSuspenseQuery method  for e.g., use below stmt
  // We can see the difference of useQuery and useSuspenseQuery by hovering over the data variable 
  // which shows return type as undefined and Todo[] respectively
  //const {data, isFetching, refetch} = useQuery(createTodoQueryOption())
  // useSuspenseQuery will always make sure the data is well defined all the time
  const { data, isFetching, refetch } = useSuspenseQuery(createTodoQueryOption())

  /**  We can also use React's suspense component as below, when any suspenseQuery 
   * is used inside the suspense component, this will help to render the fallback component should the suspense query 
   * is failing due to some reason, otherwise if query is successful, then Card component will be rendered out
   * ***** This is a common way to manage loading state in REACT, and no need use isPending, isFetching ternary checks
   * Downside is: we cannot use the enabled property to mimic conditional querying, as the suspense query isnalready returning gauranteed query    
      <Suspense fallback={<Loading />}>
        <Card > </Card>
      </Suspense>
  */

  return (
    <div >
      {isFetching ? <h1>Loading data....</h1> : JSON.stringify(data.slice(0, 15)) // Displaying top 15 entries
      }
      <p />
      <button onClick={() => { alert("Button is clicked"); refetch() }}>Re-Fetch</button>
      {// To make re-fetch button works, get the refetch query function through destructing (add refetch  
        // besides data, isPending) and use onclick button to call this refetch() to retrigger the query
      }
      <p />
      <button onClick={() => setId((prev) => prev + 1)}>Increment Id</button>

      <Suspense fallback={<h1>Loading card data....</h1>}>
        <Card />
      </Suspense>

    </div>

  )
}

const getTodos = async () => {
  // Set the timer to 1000 milli sec to see the loading image
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const response = await fetch("https://jsonplaceholder.typicode.com/todos")
  return await response.json()
}

const getComments = async (id: number) => {
  // Set the timer to 1000 milli sec to see the loading image
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${id}`)
  return await response.json()
}

export default App
