import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectNoteById, useDeleteNoteMutation } from "./notesApiSlice";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { parseISO, formatDistanceToNow } from "date-fns";
import useAuth from "../../hooks/useAuth";

const Note = ({ noteId }) => {
    const { isManager, isAdmin } = useAuth()
    const note = useSelector(state => selectNoteById(state, noteId));
    const [deleteNote, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useDeleteNoteMutation();

    const navigate = useNavigate();

    const timeAgo = () => {
        const date = parseISO(note.createdAt);
        const timePeriod = formatDistanceToNow(date);
        return timePeriod + " ago";
    }

    const handleDelete = async () => {
        await deleteNote({ id: note.id });
    }

    if (note) {
        const handleEdit = () => navigate(`/dash/notes/${noteId}`);
        const created = new Date(note.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long' });

        return (
            <div className="note">
                <div className="note--info">
                    <span className="note--info-ticket">{note.ticket}#</span>
                    <span>{created}</span>
                </div>
                <div className="note--header">
                    <div className="note--header-user">
                        <img src="https://i.pravatar.cc/100?img=47" alt="image" />
                        <div className="note--header-user-info">
                            <span className="note--username">{note.username}</span>
                            <span className="note--time">{timeAgo()}</span>
                        </div>
                    </div>
                    <span className={`note--header-status ${note.completed ? 'note--completed' : 'note--open'}`}>
                        {note.completed ? 'Completed' : 'Open'}
                    </span>
                </div>
                <div className="note--body">
                    <h2 className="note--body-title">{note.title}</h2>
                    <p>{note.text}</p>
                </div>

                <div className="note--footer">
                    <button className="note--footer-edit" onClick={handleEdit}>
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                    {(isManager || isAdmin) &&
                        <button className="note--footer-delete" onClick={handleDelete}>
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    }
                </div>
            </div>
        )
    } else return null;
}

export default Note; 