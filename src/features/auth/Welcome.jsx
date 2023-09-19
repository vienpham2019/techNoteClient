import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faUsers, faUserPlus, faFileCirclePlus } from "@fortawesome/free-solid-svg-icons";

const Welcome = () => {
    const date = new Date()
    const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date)

    const { username, isManager, isAdmin } = useAuth()

    const content = (
        <section className="welcome">

            <p>{today}</p>

            <h1>Welcome!  {username}</h1>

            <p><Link to="/dash/notes"><FontAwesomeIcon icon={faFile} /> View techNotes </Link></p>
            <p><Link to="/dash/notes/new"><FontAwesomeIcon icon={faFileCirclePlus} /> Add New techNote</Link></p>

            {(isManager || isAdmin) &&
                <>
                    <p><Link to="/dash/users"><FontAwesomeIcon icon={faUsers} /> View User Settings</Link></p>
                    <p><Link to="/dash/users/new"><FontAwesomeIcon icon={faUserPlus} /> Add New User</Link></p>
                </>
            }

        </section>
    )

    return content
}

export default Welcome; 