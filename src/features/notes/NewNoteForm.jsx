import { useEffect, useState } from "react";
import { useAddNewNoteMutation } from "./notesApiSlice";
import { useNavigate } from "react-router-dom";

const NewNoteForm = ({ users }) => {
    const navigate = useNavigate();
    const [addNewNote, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewNoteMutation();

    const [user, setUser] = useState(users[0].id);
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');

    useEffect(() => {
        if (isSuccess) {
            setUser([users[0].id]);
            setTitle('');
            setText('');
            navigate('/dash/notes')
        }
    }, [isSuccess, navigate]);

    const canSave = [user, title, text].every(Boolean) && !isLoading;

    const onUserChange = (e) => setUser(e.target.value);
    const onTiteChange = (e) => setTitle(e.target.value);
    const onTextChange = (e) => setText(e.target.value);

    const options = users.map(u =>
        <option key={u.id} value={u.id}>{u.username}</option>
    );

    const handleSubmit = async e => {
        e.preventDefault();
        if (canSave) {
            await addNewNote({ user, title, text });
        }
    }

    const content = (
        <>
            <span>{error?.data?.message}</span>
            <h1>New techNote</h1>
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
                <button disabled={!canSave} onClick={handleSubmit}>
                    Submit
                </button>
            </form>
        </>
    );

    return content;

}

export default NewNoteForm; 