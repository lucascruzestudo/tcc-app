import { Outlet } from "react-router-dom"
import "./App.css"
import { SideBar } from "./components/sidebar"

function App() {
    return (
        <>
            <SideBar />
            <div className="container-section">
                <main>
                    <Outlet />
                </main>
            </div>
        </>
    )
}

export default App