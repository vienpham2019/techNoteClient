
import { useParams } from "react-router-dom";
import { useGetUsersQuery, useUpdateUserMutation } from "./usersApiSlice";
import { PulseLoader } from "react-spinners";
import UserForm from "./UserForm";

const EditUser = () => {
    const { id } = useParams();
    const { user } = useGetUsersQuery('usersList', {
        selectFromResult: ({ data }) => ({
            user: data?.entities[id]
        })
    })

    const content = user
        ? <UserForm
            user={user}
            title={'Edit User'}
            isEditForm={true}
            formAction={useUpdateUserMutation}
        />
        : <PulseLoader color={"#FFF"} />
    return content;
}

export default EditUser; 