import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useGetNotesQuery } from './notesApiSlice';
import { useGetUsersQuery } from "../users/usersApiSlice";
import EditNoteForm from "./EditNoteForm";
import { PulseLoader } from "react-spinners";
import useAuth from "../../hooks/useAuth";

const EditNote = () => {
    const { id } = useParams();
    const { username, isManager, isAdmin } = useAuth()

    const { note } = useGetNotesQuery('notesList', {
        selectFromResult: ({ data }) => ({
            note: data?.entities[id]
        })
    })

    const { users } = useGetUsersQuery('usersList', {
        selectFromResult: ({ data }) => ({
            users: data?.ids.map(u_id => data?.entities[u_id])
        })
    })
    if (!users || !users?.length) return <PulseLoader color={"#FFF"} />

    if (!isManager && !isAdmin) {
        if (note.username !== username) {
            return <p>No Access</p>
        }
    }
    const content = <EditNoteForm note={note} users={users} />

    return content;
}

export default EditNote; 