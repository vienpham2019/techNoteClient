import { useGetUsersQuery } from "./usersApiSlice";
import User from "./User";

const UsersList = () => {

    const {
        data: users,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetUsersQuery('usersList', {
        pollingInterval: 60000, // 60s the data will fetch again
        refertchOnFocus: true, // data will fetch when page on focus 
        refetchOnMountOrArgChange: true // it will refresh data when remount component 
    });

    let content;

    if (isLoading) content = <p>Loading...</p>
    if (isError) {
        content = <p className={isError ? "errmsg" : "offscreen"}>
            {error?.data?.message}
        </p>
    }

    if (isSuccess) {
        const { ids } = users;
        const tableContent = ids?.length
            ? ids.map(userId => <User key={userId} userId={userId} />)
            : null

        content = (
            <table className="table table-bordered border-secondary m-5">
                <thead className="">
                    <tr>
                        <th scope="col" className="table__th user__roles">Username</th>
                        <th scope="col" className="table__th user__roles">Roles</th>
                        <th scope="col" className="table__th user__roles">Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {tableContent}
                </tbody>
            </table>
        )
    }

    return content;
}

export default UsersList; 