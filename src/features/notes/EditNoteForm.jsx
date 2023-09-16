import { useEffect, useState } from "react";
import { useUpdateNoteMutation } from "./notesApiSlice";
import { useNavigate } from "react-router-dom";

const EditNoteForm = ({ note, users }) => {
    const navigate = useNavigate();
    const [updateNote, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateNoteMutation();

    const [user, setUser] = useState(note.user);
    const [title, setTitle] = useState(note.title);
    const [text, setText] = useState(note.text);
    const [completed, setConpleted] = useState(note.completed);

    useEffect(() => {
        if (isSuccess) {
            setUser([]);
            setTitle('');
            setText('');
            navigate('/dash/notes')
        }
    }, [isSuccess, navigate]);

    const canSave = [user, title, text].every(Boolean) && !isLoading;

    const onUserChange = (e) => setUser(e.target.value);
    const onTiteChange = (e) => setTitle(e.target.value);
    const onTextChange = (e) => setText(e.target.value);
    const onCompletedClick = () => setConpleted(!completed);

    const options = users.map(u =>
        <option key={u.id} value={u.id}>{u.username}</option>
    );

    const handleSubmit = async e => {
        e.preventDefault();
        if (canSave) {
            await updateNote({ id: note.id, obj: { user, title, text, completed } });
        }
    }

    const content = (
        <div className="form__container">
            <span>{error?.data?.message}</span>
            <h1>Edit Form</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label for="title" className="form-label">Title</label>
                    <input type="text" className="form-control" id="title" value={title} onChange={onTiteChange} />
                </div>
                <div className="mb-3">
                    <label for="text" class="form-label">Text</label>
                    <textarea type="text" class="form-control" rows="3" id="text" value={text} onChange={onTextChange} />
                </div>
                <div>
                    <label for="user">User</label>
                    <select className="form-select" name="user" id="user" onChange={onUserChange}>{options}</select>
                </div>
                <div>
                    <label for="completed">Completed: </label>
                    <input className="form-check-input" name="completed" type="checkbox" id="completed" checked={completed} onChange={onCompletedClick} />
                </div>
                <button className="btn btn-outline-info" disabled={!canSave} onClick={handleSubmit}>
                    Submit
                </button>
            </form>
        </div>
    );

    return content;
}

export default EditNoteForm