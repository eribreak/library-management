import { useState } from "react";
import "./assets/styles/variables.css";
import "./assets/styles/global.css";
import "./App.css";
import { Outlet, useNavigate } from "react-router-dom";
import { history } from "./routes/history";
import SideBar from "./components/layout/Sidebar/Sidebar";
import Header from "./components/layout/Header/Header";

function App() {
    history.navigate = useNavigate();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarCollapsed((prev) => !prev);
    };

    return (
        <>
            <div className="app">
                <Header
                    toggleSidebar={toggleSidebar}
                    isSidebarCollapsed={isSidebarCollapsed}
                />
                <div className="app__container">
                    <SideBar isCollapsed={isSidebarCollapsed} />
                    <Outlet />
                </div>
            </div>
        </>
    );
}

export default App;
