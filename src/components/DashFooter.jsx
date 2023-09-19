import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";

const DashFooter = () => {

    const { username, status } = useAuth()

    const navigate = useNavigate();
    const { pathName } = useLocation();

    const onGoHomeClicked = () => navigate('/dash');

    let goHomeButton = null;
    if (pathName !== '/dash') {
        goHomeButton = (
            <button
                className="btn btn-light"
                title="Home"
                onClick={onGoHomeClicked}
            >
                <FontAwesomeIcon icon={faHouse} />
            </button>
        )
    }

    const content = (
        <footer className="dash-footer">
            <div className="dash-footer__container text-light">
                <div className="d-flex gap-3">
                    {goHomeButton}
                    <div className="d-grid">
                        <p><span className="text-info">Current user:</span> {username}</p>
                        <p><span className="text-info">Status: </span> {status}</p>
                    </div>
                </div>
            </div>
        </footer>
    )

    return content;
}

export default DashFooter