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
        <>
            <p className={errClass}>{errorContent}</p>
            <form className="form" onSubmit={e => e.preventDefault()}>
                <div>
                    <h2>New User</h2>
                    <div>
                        <button
                            title="Save"
                            disabled={!canSave} onClick={onSaveUserClick}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                            title="Delete"
                            disabled={!canSave} onClick={onDeleteUserClick}
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                    </div>
                </div>
                <label htmlFor="userName">
                    Username: <span>[3-20 letters]</span>
                </label>
                <input
                    type="text"
                    id="userName"
                    name="userName"
                    autoComplete="off"
                    value={userName}
                    onChange={onUserNameChange}
                />

                <label htmlFor="password">
                    Password: <span>[4-12 chars incl. !@#$%]</span>
                </label>
                <input
                    type="text"
                    id="password"
                    name="password"
                    autoComplete="off"
                    value={password}
                    onChange={onPasswordChange}
                />

                <label htmlFor="active">
                    Active
                </label>
                <input
                    type="checkbox"
                    id="active"
                    name="active"
                    checked={active}
                    onChange={onActiveChange}
                />

                <label htmlFor="roles">
                    ASSIGNED ROLES:
                </label>
                <select
                    name="roles"
                    id="roles"
                    multiple={true}
                    size="3"
                    value={roles}
                    onChange={onRolesChange}
                >
                    {options}
                </select>
            </form>
        </>
    )

    return content;
}

export default EditUserForm; 