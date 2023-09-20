import { Outlet } from "react-router-dom";
import DashHeader from "./DashHeader";
import DashFooter from "./DashFooter";

const DashLayout = () => {
    return (
        <div className="dash">
            <DashHeader />
            <div className="dash-container">
                <div>
                    <Outlet />
                </div>
            </div>
            <DashFooter />
        </div>
    )
}

export default DashLayout; 