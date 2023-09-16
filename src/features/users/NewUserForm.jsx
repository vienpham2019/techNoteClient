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
        <div className="form__container">
            <p className={errClass}>{error?.data?.message}</p>
            <form onSubmit={onSaveUserClick}>
                <div>
                    <h2>New User</h2>
                </div>
                <div className="mb-3">
                    <label for="username" className="form-label">User name</label>
                    <input type="text" autoComplete="off" className="form-control" id="username" value={userName} onChange={onUserNameChange} />
                    <div id="userHelp" className="form-text">3-20 letters</div>
                </div>

                <div className="mb-3">
                    <label for="password" className="form-label">Password</label>
                    <input type="password" autoComplete="off" className="form-control" id="password" value={password} onChange={onPasswordChange} />
                    <div id="passwordHelp" className="form-text">4-12 chars incl. !@#$%</div>
                </div>

                <div className="mb-3">
                    <label for="roles" className="form-label">
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
                <button className="btn btn-outline-info" disabled={!canSave} type="submit">
                    Submit
                </button>
            </form>
        </div>
    )

    return content;
}

export default NewUserForm; 