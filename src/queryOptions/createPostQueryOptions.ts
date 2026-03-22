import { queryOptions } from "@tanstack/react-query";

const creaetPostQueryOptions = () => {

    return queryOptions(
        {
          queryKey: ['postQuery'],
          queryFn: getPosts,
        }
        )
}

// Dummy method
const getPosts = async () => {

}


export default creaetPostQueryOptions