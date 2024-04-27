// import { useEffect } from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import { useAuth } from "src/hooks/authContextProvider";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import { SideBar } from "./components/sidebar";

function App() {
    // const user = useAuth().user
    // const navigate = useNavigate();

    // useEffect(() => {
    //     if (!user) return;
    
    //     if (user.projectIds.length === 0) {
    //         navigate('/my-account', { replace: true });
    //     }
    
    //     if (user.projectIds.length === 1) {
    //         navigate(`/project-progress/${user.projectIds[0]}`, { replace: true });
    //     }
    
    // }, [user, navigate]);

    return (
        <>
            <SideBar />
            <div className="container-section">
                <main>
                    <Outlet />
                    <ToastContainer  position="top-right" theme="light" />
                </main>
            </div>
        </>
    )
}

export default App