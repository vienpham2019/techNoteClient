import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router";

const DashFooter = () => {

    const navigate = useNavigate();
    const { pathName } = useLocation();

    const onGoHomeClicked = () => navigate('/dash');

    let goHomeButton = null;
    if (pathName !== '/dash') {
        goHomeButton = (
            <button
                className="dash-footer__button icon-button"
                title="Home"
                onClick={onGoHomeClicked}
            >
                <FontAwesomeIcon icon={faHouse} />
            </button>
        )
    }

    const content = (
        <footer className="dash-footer">
            <div className="dash-footer__container">
                {goHomeButton}
                <p>Current User:</p>
                <p>Status: </p>
            </div>
        </footer>
    )

    return content;
}

export default DashFooter