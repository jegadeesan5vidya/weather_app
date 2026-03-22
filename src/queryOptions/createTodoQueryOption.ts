import { queryOptions } from "@tanstack/react-query"

// We can create queryoptions into separate file for easy maintenance and use 
// it across multiple places of the project
const createTodoQueryOption = () => {
    // queryOptions({}) use control and spacebar to get to know more type safety 
    // and inteligence that we pass on to queryoptions
    return queryOptions(
        {
      queryKey: ['todos'],
      queryFn: getTodos,
    }
    )
}

// Return type is array of Todo type, wrap it inside promise, as we are using async
const getTodos = async () : Promise<Todo[]> => {
  // Set the timer to 1000 milli sec to see the loading image
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const response = await fetch("https://jsonplaceholder.typicode.com/todos")
  return await response.json()
}

// Create a typeScript object for typesafe same as the response object from the jsonplaceholder url 
type Todo = {
    userId: number,
    id: number,
    title: string,
    completed: boolean,
}

export default createTodoQueryOption
