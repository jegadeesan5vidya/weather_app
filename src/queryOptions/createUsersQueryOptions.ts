import { queryOptions } from "@tanstack/react-query";

const createUsersQueryOptions = () => {

        return queryOptions(
            {
              queryKey: ['userQuery'],
              queryFn: getUsers,
            }
            )
}

// Dummy method
const getUsers = async () => {

}

export default createUsersQueryOptions