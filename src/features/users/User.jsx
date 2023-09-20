import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useDeleteUserMutation, useGetUsersQuery } from "./usersApiSlice";
import { memo } from "react";

const User = ({ userId }) => {
    const [deleteUser, {
        isSuccess,
        isLoading,
        isError,
        error
    }] = useDeleteUserMutation();

    const { user } = useGetUsersQuery('usersList', {
        selectFromResult: ({ data }) => ({
            user: data?.entities[userId]
        })
    })

    const navigate = useNavigate();

    const handleDelete = async () => {
        await deleteUser({ id: user.id })
    }

    if (user) {
        const handleEdit = () => navigate(`/dash/users/${userId}`);
        const userRolesString = user.roles.toString().replaceAll(',', ', ');
        const cellStatus = user.active ? "table-success" : 'table-danger';

        return (
            <tr className={`table__row user ${cellStatus}`}>
                <td >{user.username}</td>
                <td >{userRolesString}</td>
                <td >
                    <button
                        className="btn btn-outline-info"
                        onClick={handleEdit}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                    <button
                        className="btn btn-outline-danger ms-4"
                        onClick={handleDelete}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </td>
            </tr>
        )
    } else return null;
}

const memoizedUser = memo(User)
export default memoizedUser; 