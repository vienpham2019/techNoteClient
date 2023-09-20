
import { useAddNewUserMutation } from "./usersApiSlice";

import UserForm from "./UserForm";

const NewUser = () => {

    const newUser = {
        username: '',
        roles: ['Employee'],
        active: true
    }

    return (
        <UserForm
            user={newUser}
            title={'New Users'}
            isEditForm={false}
            formAction={useAddNewUserMutation}
        />

    )
}

export default NewUser; 