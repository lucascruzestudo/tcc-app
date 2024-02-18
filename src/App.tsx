import "./App.css";
import { Outlet } from "react-router-dom";
import { SideBar } from "./components/sidebar";
import { ToastContainer } from "react-toastify";

function App() {
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