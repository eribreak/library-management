import { useState, useEffect } from "react";
import "./assets/styles/variables.css";
import "./assets/styles/global.css";
import "./App.css";
import "./assets/css/react-select-custom.css";
import { Outlet, useNavigate } from "react-router-dom";
import { history } from "./routes/history";
import SideBar from "./components/layout/Sidebar/Sidebar";
import Header from "./components/layout/Header/Header";
import { ToasterProvider } from "./components/ui/toaster";

function App() {
    history.navigate = useNavigate();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const checkWindowWidth = () => {
        const isSmallScreen = window.innerWidth < 1024;
        setIsSidebarCollapsed(isSmallScreen);
    };

    const setupWindowResizeListener = () => {
        checkWindowWidth();
        window.addEventListener("resize", checkWindowWidth);
        return () => {
            window.removeEventListener("resize", checkWindowWidth);
        };
    };

    useEffect(() => {
        const cleanup = setupWindowResizeListener();
        return cleanup;
    }, []);

    const toggleSidebar = () => {
        setIsSidebarCollapsed((prev) => !prev);
    };

    return (
        <>
            <ToasterProvider>
                <div className="app" data-toaster-context>
                    <Header
                        toggleSidebar={toggleSidebar}
                        isSidebarCollapsed={isSidebarCollapsed}
                    />
                    <div className="app__container">
                        <SideBar isCollapsed={isSidebarCollapsed} />

                        <div
                            className={`app__container__content ${
                                isSidebarCollapsed
                                    ? "app__container__content--sidebar-collapsed"
                                    : ""
                            }`}
                        >
                            <Outlet />
                        </div>
                    </div>
                </div>
            </ToasterProvider>
        </>
    );
}

export default App;
