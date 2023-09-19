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
        <div className="form__container">
            <span>{error?.data?.message}</span>
            <h1>New techNote</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control" id="title" value={title} onChange={onTiteChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="text" className="form-label">Text</label>
                    <textarea type="text" class="form-control" rows="3" id="text" value={text} onChange={onTextChange} />
                </div>
                <div>
                    <label htmlFor="user" className="form-label">User</label>
                    <select className="form-select" name="user" id="user" onChange={onUserChange}>{options}</select>
                </div>
                <button className="btn btn-outline-info" disabled={!canSave} onClick={handleSubmit}>
                    Submit
                </button>
            </form>
        </div>
    );

    return content;

}

export default NewNoteForm; 