import { useEffect, useState } from "react";
import { useDeleteUserMutation, useUpdateUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../config/roles";

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}/;

const EditUserForm = ({ user }) => {
    const navigate = useNavigate();
    const [updateUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateUserMutation();

    const [deleteUser, {
        isSuccess: isDeleteSuccess,
        isLoading: isDeleteLoading,
        isError: isDeleteError,
        error: deleteError
    }] = useDeleteUserMutation();

    const [userName, setUserName] = useState(user.username);
    const [validUserName, setValidUserName] = useState(false);
    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [roles, setRoles] = useState(user.roles);
    const [active, setActive] = useState(user.active);

    useEffect(() => {
        setValidUserName(USER_REGEX.test(userName))
    }, [userName]);

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password))
    }, [password]);

    useEffect(() => {
        if (isSuccess || isDeleteSuccess) {
            setUserName('');
            setPassword('');
            setRoles([]);
            navigate('/dash/users')
        }
    }, [isSuccess, isDeleteSuccess, navigate]);

    const onUserNameChange = e => setUserName(e.target.value);
    const onPasswordChange = e => setPassword(e.target.value);

    const onRolesChange = e => {
        const values = Array.from(e.target.selectedOptions, (option) => option.value);
        setRoles(values);
    };

    const onActiveChange = () => setActive(prev => !prev);

    const onSaveUserClick = async () => {
        let updateUserObj = { id: user.id, username: userName, roles, active };
        if (password) {
            updateUserObj.password = password;
        };
        await updateUser(updateUserObj);
    }

    const onDeleteUserClick = async () => {
        await deleteUser({ id: user.id })
    }

    const options = Object.values(ROLES).map(role => {
        return (
            <option
                key={role}
                value={role}
            >
                {role}
            </option>
        )
    });

    let canSave = [roles.length, validUserName].every(Boolean) && !isLoading;
    if (password) {
        canSave = validPassword && canSave;
    }

    const errClass = isError ? "errmsg" : "offscreen";
    const validUserClass = !validUserName ? 'form__input-iscomplete' : '';
    const validPwdClass = !validPassword ? 'form__input-iscomplete' : '';
    const validRolesClass = !Boolean(roles.length) ? 'form__input-iscomplete' : '';

    const errorContent = (error?.data?.message || deleteError?.data?.message) ?? '';

    const content = (
        <div className="form__container">
            <p className={errClass}>{error?.data?.message}</p>
            <form onSubmit={onSaveUserClick}>
                <div>
                    <h2>Edit Form</h2>
                </div>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">User name</label>
                    <input type="text" autoComplete="off" className="form-control" id="username" value={userName} onChange={onUserNameChange} />
                    <div id="userHelp" className="form-text">3-20 letters</div>
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" autoComplete="off" className="form-control" id="password" value={password} onChange={onPasswordChange} />
                    <div id="passwordHelp" className="form-text">4-12 chars incl. !@#$%</div>
                </div>

                <div className="mb-3">
                    <label htmlFor="roles" className="form-label">
                        ASSIGNED ROLES:
                    </label>
                    <select
                        class="form-select"
                        name="roles"
                        id="roles"
                        multiple={true}
                        size="3"
                        value={roles}
                        onChange={onRolesChange}
                    >
                        {options}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="active" className="form-label">
                        Active
                    </label>
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="active"
                        name="active"
                        checked={active}
                        onChange={onActiveChange}
                    />
                </div>
                <button className="btn btn-outline-info" disabled={!canSave} type="submit">
                    Submit
                </button>
            </form>
        </div>
    )

    return content;
}

export default EditUserForm; 