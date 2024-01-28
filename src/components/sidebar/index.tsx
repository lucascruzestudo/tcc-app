import { useState } from "react";
import "./index.css"
import { Link } from "react-router-dom";
import { menus } from "./menus";

export function SideBar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
            
            <div className="logo_details">
                <i className="bx bxl-audible icon"></i>
                <div className="logo_name">Laboratório</div>
                <i
                    className={`bx ${isSidebarOpen ? "bx-menu-alt-right" : "bx-menu"} `}
                    id="btn"
                    onClick={toggleSidebar}
                ></i>
            </div>

            <ul className="nav-list">

                {menus.map(menu => (
                    <li key={menu.title}>
                        <Link to={menu.linkTo}>
                            <i className={`bx ${menu.icon}`} ></i>
                            <span className="link_name">{menu.title}</span>
                        </Link>
                        <span className="tooltip">{menu.title}</span>
                    </li>
                ))}

                <li className="profile">
                    <div className="profile_details">
                        <img src="/src/assets/rui-iconica-profile.jpeg" alt="profile image" />
                        <div className="profile_content">
                            <div className="name">Rui Silvestrin</div>
                            <div className="designation">Orientador</div>
                        </div>
                    </div>
                    <i className="bx bx-log-out" id="log_out"></i>
                </li>

            </ul>

        </div>
    )
}