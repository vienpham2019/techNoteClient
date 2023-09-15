import { useEffect, useState } from "react";
import { useAddNewUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../config/roles";

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}/;

const NewUserForm = () => {
    const [addNewUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewUserMutation();

    const navigate = useNavigate();

    const [userName, setUserName] = useState('');
    const [validUserName, setValidUserName] = useState(false);
    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [roles, setRoles] = useState(['Employee']);

    useEffect(() => {
        setValidUserName(USER_REGEX.test(userName), [userName])
    });

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password), [password])
    });

    useEffect(() => {
        if (isSuccess) {
            setUserName('');
            setPassword('');
            setRoles([]);
            navigate('/dash/users');
        }
    }, [isSuccess, navigate]);

    const onUserNameChange = e => setUserName(e.target.value);
    const onPasswordChange = e => setPassword(e.target.value);

    const onRolesChange = e => {
        const values = Array.from(e.target.selectedOptions, (option) => option.value);
        setRoles(values);
    };

    const canSave = [roles.length, validUserName, validPassword].every(Boolean) && !isLoading;

    const onSaveUserClick = async e => {
        e.preventDefault();
        if (canSave) {
            await addNewUser({ username: userName, password, roles })
        }
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

    const errClass = isError ? "errmsg" : "offscreen";
    const validUserClass = !validUserName ? 'form__input-iscomplete' : '';
    const validPwdClass = !validPassword ? 'form__input-iscomplete' : '';
    const validRolesClass = !Boolean(roles.length) ? 'form__input-iscomplete' : '';

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>
            <form className="form" onSubmit={onSaveUserClick}>
                <div>
                    <h2>New User</h2>
                    <div>
                        <button title="Save" disabled={!canSave}><FontAwesomeIcon icon={faSave} /></button>
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

export default NewUserForm; 