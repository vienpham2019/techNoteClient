import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectNoteById } from "./notesApiSlice";

const Note = ({ noteId }) => {
    const note = useSelector(state => selectNoteById(state, noteId));

    const navigate = useNavigate();

    if (note) {
        const handleEdit = () => navigate(`/dash/notes/${noteId}`);
        const created = new Date(note.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long' });
        const updated = new Date(note.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long' });

        return (
            <tr>
                <td>
                    {note.completed
                        ? <span>Completed</span>
                        : <span>Open</span>
                    }
                </td>
                <td>{created}</td>
                <td>{updated}</td>
                <td>{note.tile}</td>
                <td>{note.username}</td>

                <td>
                    <button onClick={handleEdit}>
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </td>
            </tr>
        )
    } else return null;
}

export default Note; 