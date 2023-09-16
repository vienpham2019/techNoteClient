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
        <>
            <span>{error?.data?.message}</span>
            <h1>Edit Form</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title</label>
                    <input name="title" type="text" value={title} onChange={onTiteChange} />
                </div>
                <div>
                    <label htmlFor="text">Text</label>
                    <input name="text" type="text" value={text} onChange={onTextChange} />
                </div>
                <div>
                    <label htmlFor="user">User</label>
                    <select name="user" id="user" onChange={onUserChange}>{options}</select>
                </div>
                <div>
                    <label htmlFor="completed">Completed: </label>
                    <input name="completed" type="checkbox" id="completed" checked={completed} onChange={onCompletedClick} />
                </div>
                <button disabled={!canSave} onClick={handleSubmit}>
                    Submit
                </button>
            </form>
        </>
    );

    return content;
}

export default EditNoteForm