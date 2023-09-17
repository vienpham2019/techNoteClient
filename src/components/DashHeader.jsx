import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";

const DASH_REGEX = /^\/dash(\/)?$/
const NOTES_REGEX = /^\/dash\/notes(\/)?$/
const USERS_REGEX = /^\/dash\/users(\/)?$/

const DashHeader = () => {

    const navigate = useNavigate();
    const { pathName } = useLocation();

    const [sendLogout, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useSendLogoutMutation();

    useEffect(() => {
        if (isSuccess) navigate('/')
    }, [isSuccess, navigate])

    const onLogoutClicked = () => sendLogout();

    if (isLoading) return <p>Logging Out...</p>

    if (isError) return <p>Error: {error.data?.message}</p>

    const logOutBtn = (
        <button className="btn btn-outline-info" titile="logout" onClick={onLogoutClicked}>
            <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
    )

    const content = (
        <header className="dash-header">
            <div className="dash-header__continer">
                <Link to="/dash/notes">
                    <h1 className="dash-header__title">Tech Notes</h1>
                </Link>
                <nav className="dash-header__nav">
                    {logOutBtn}
                </nav>
            </div>
        </header>
    )
    return content;
}

export default DashHeader; 