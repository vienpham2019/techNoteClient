import { faRightFromBracket, faFileCirclePlus, faUsers, faFile, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import useAuth from "../hooks/useAuth";

const DASH_REGEX = /^\/dash(\/)?$/
const NOTES_REGEX = /^\/dash\/notes(\/)?$/
const USERS_REGEX = /^\/dash\/users(\/)?$/

const DashHeader = () => {
    const { isManager, isAdmin } = useAuth()
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const [sendLogout, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useSendLogoutMutation();

    useEffect(() => {
        if (isSuccess) navigate('/')
    }, [isSuccess, navigate])

    const onNewNoteClicked = () => navigate('/dash/notes/new')
    const onNewUserClicked = () => navigate('/dash/users/new')
    const onNotesClicked = () => navigate('/dash/notes')
    const onUsersClicked = () => navigate('/dash/users')

    const onLogoutClicked = () => sendLogout();

    let newNoteBtn = null
    if (NOTES_REGEX.test(pathname)) {
        newNoteBtn = (
            <button
                className="btn btn-outline-light"
                title="New Note"
                onClick={onNewNoteClicked}
            >
                <FontAwesomeIcon icon={faFileCirclePlus} />
            </button>
        )
    }

    let notesBtn = null
    if (!NOTES_REGEX.test(pathname) && pathname.includes('/dash')) {
        notesBtn = (
            <button
                className="btn btn-outline-light"
                title="Notes"
                onClick={onNotesClicked}
            >
                <FontAwesomeIcon icon={faFile} />
            </button>
        )
    }

    let usersBtn = null
    if (isAdmin || isManager) {
        if (!USERS_REGEX.test(pathname) && pathname.includes('/dash')) {
            usersBtn = (
                <button
                    className="btn btn-outline-light"
                    title="Users"
                    onClick={onUsersClicked}
                >
                    <FontAwesomeIcon icon={faUsers} />
                </button>
            )
        }
    }

    let newUserBtn = null
    if (USERS_REGEX.test(pathname)) {
        newUserBtn = (
            <button
                className="btn btn-outline-light"
                title="New User"
                onClick={onNewUserClicked}
            >
                <FontAwesomeIcon icon={faUserPlus} />
            </button>
        )
    }

    const logOutBtn = (
        <button className="btn btn-outline-light" titile="logout" onClick={onLogoutClicked}>
            <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
    )

    let buttonContent
    if (isLoading) {
        buttonContent = <p>Loading ...</p>
    } else {
        buttonContent = (
            <div className="d-flex justify-content-end gap-3">
                {newNoteBtn}
                {notesBtn}
                {newUserBtn}
                {usersBtn}
                {logOutBtn}
            </div>
        )
    }

    const content = (
        <>
            {isError && <div className="alert alert-danger" role="alert">
                {error?.data?.message}
            </div>}
            <header className="dash-header">
                <div className="dash-header__continer d-flex justify-content-between align-items-center">
                    <Link to="/dash/notes">
                        <h1 className="dash-header__title">Tech Notes</h1>
                    </Link>
                    <nav className="dash-header__nav">
                        {buttonContent}
                    </nav>
                </div>
            </header>
        </>
    )
    return content;
}

export default DashHeader; 