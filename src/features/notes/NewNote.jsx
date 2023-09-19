
import { PulseLoader } from "react-spinners";
import { useGetUsersQuery } from "../users/usersApiSlice";
import NewNoteForm from "./NewNoteForm";

const NewNote = () => {
    const { users } = useGetUsersQuery('usersList', {
        selectFromResult: ({ data }) => ({
            users: data?.ids.map(id => data?.entities[id])
        })
    })

    if (!users?.length) return <p>Not Current Avaliable</p>
    const content = users?.length ? <NewNoteForm users={users} /> : <PulseLoader color={"#FFF"} />

    return content;
}

export default NewNote; 