
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckDouble, faXmark } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../config/roles";

const USER_REGEX = /^[A-z]{3,20}$/;

const password_required = [
    { require: 'Contain at least 8 characters (12+ recommended)', regex: /(?=.{8,})/, isValid: false },
    { require: 'Contain at least one uppercase letter', regex: /(?=.*[A-Z])/, isValid: false },
    { require: 'Contain at least one lowercase letter', regex: /(?=.*[a-z])/, isValid: false },
    { require: 'Contain at least one number', regex: /(?=.*[0-9])/, isValid: false },
    { require: 'Contain at least one special character', regex: /(?=.*[@#$%^&+!=])/, isValid: false }
]

const UserForm = ({ user, title, formAction, isEditForm }) => {
    const [action, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = formAction();

    const navigate = useNavigate();

    const [username, setUserName] = useState(user.username);
    const [validUserName, setValidUserName] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordRequired, setPasswordRequired] = useState(password_required)
    const [validPassword, setValidPassword] = useState(false);
    const [roles, setRoles] = useState(user.roles);
    const [active, setActive] = useState(user.active);

    useEffect(() => {
        setValidUserName(USER_REGEX.test(username.trim()))
    }, [username]);

    useEffect(() => {
        if (isEditForm && !password) {
            setValidPassword(true)
        } else {
            let isValid = true;
            let newPasswordRequired = passwordRequired.map(r => {
                r.isValid = r.regex.test(password)
                isValid = isValid && r.isValid
                return r;
            })
            setPasswordRequired(newPasswordRequired)
            setValidPassword(isValid)
        }
    }, [password]);

    useEffect(() => {
        if (isSuccess) {
            setUserName('');
            setPassword('');
            setRoles([]);
            navigate('/dash/users');
        }
    }, [isSuccess, navigate]);

    const onUserNameChange = e => setUserName(e.target.value.trim());
    const onPasswordChange = e => setPassword(e.target.value);
    const onRolesChange = e => {
        const values = Array.from(e.target.selectedOptions, (option) => option.value);
        setRoles(values);
    };

    const onActiveChange = () => setActive(prev => !prev);

    const canSave =
        [roles.length, validUserName, validPassword].every(Boolean)
        && !isLoading

    const onSaveUserClick = async e => {
        e.preventDefault();
        if (canSave) {
            let actionObj = { username, roles }
            if (isEditForm) {
                actionObj.id = user.id
                actionObj.active = active
                if (password) {
                    actionObj.password = password
                }
            } else {
                actionObj.password = password
            }

            await action(actionObj)
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

    const password_required_content = (
        <div className="d-grid gap-1 bg-white p-2 rounded">
            {password_required.map((r, i) => {
                let icon = <FontAwesomeIcon icon={faXmark} />
                if (r.isValid) icon = <FontAwesomeIcon icon={faCheckDouble} />
                return (<p key={`password required ${i}`} className="m-0 p-0"><span className={r.isValid ? "text-success" : "text-danger"}>{icon}</span> {r.require}</p>)
            })}
        </div>
    )

    const username_required_content = (
        <div className="bg-white p-2 rounded">

            <p className="m-0 p-0">
                <span className={validUserName ? "text-success" : "text-danger"}>
                    {validUserName && <FontAwesomeIcon icon={faCheckDouble} />}
                    {!validUserName && <FontAwesomeIcon icon={faXmark} />}
                </span>
                <span className="ms-1">
                    Contain at least 3 to 20 character
                </span>
            </p>

        </div>
    )

    const content = (
        <div className="form__container">
            {isError && <p className="alert alert-danger">{error?.data?.message}</p>}
            <form onSubmit={onSaveUserClick}>
                <div>
                    <h2>{title}</h2>
                </div>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">User name</label>
                    <input type="text" autoComplete="off" className="form-control" id="username" value={username} onChange={onUserNameChange} />
                    <div id="userHelp" className="form-text">
                        {username_required_content}
                    </div>
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" autoComplete="off" className="form-control" id="password" value={password} onChange={onPasswordChange} />
                    <div id="passwordHelp" className="form-text">
                        {password_required_content}
                    </div>
                </div>

                <div className="mb-3">
                    <label htmlFor="roles" className="form-label">
                        ASSIGNED ROLES:
                    </label>
                    <select
                        className="form-select"
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
                {isEditForm && <div className="mb-3">
                    <label htmlFor="active" className="form-label me-2">
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
                </div>}
                <button className="btn btn-outline-info" disabled={!canSave} type="submit">
                    Submit
                </button>
            </form>
        </div>
    )

    return content;
}

export default UserForm