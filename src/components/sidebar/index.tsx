import { useState } from "react";
import "./index.css"
import { Link } from "react-router-dom";
import { menus } from "./menus";
import AuthService from "src/services/auth";
import { useAuth } from "src/hooks/authContextProvider";
import { UserRole } from "@utils/enums";
import defaultProfile from "@assets/profile.jpeg";

export function SideBar() {
    const userLocalStorage = useAuth().user!
    const authService = new AuthService();

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleLogout = async () => {
        authService.logout();
        
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        window.location.href = '/';
    }

    const getProfileName = (role: UserRole) => {
        if (role === UserRole.COORDINATOR) return "Coordenador";
        else if (role === UserRole.ADVISOR) return "Orientador";
        else if (role === UserRole.STUDENT) return "Aluno";
    }

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
                        <img src={userLocalStorage.profile_picture || defaultProfile} alt="profile image" />
                        <div className="profile_content">
                            <div className="name">{userLocalStorage.full_name}</div>
                            <div className="designation">{getProfileName(userLocalStorage.role)}</div>
                        </div>
                    </div>
                    <i className="bx bx-log-out" id="log_out" onClick={handleLogout}></i>
                </li>

            </ul>

        </div>
    )
}