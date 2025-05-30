import { useState, useEffect } from "react";
import "./assets/styles/variables.css";
import "./assets/styles/global.css";
import "./App.css";
import "./assets/css/react-select-custom.css";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { history } from "./routes/history";
import SideBar from "./components/layout/Sidebar/Sidebar";
import Header from "./components/layout/Header/Header";
import { ToasterProvider } from "./components/ui/toaster";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { resetCategoryState } from "@/store/slices/categorySlice";
import { resetAuthorState } from "@/store/slices/authorSlice";
import { resetPublisherState } from "@/store/slices/publisherSlice";

function App() {
    history.navigate = useNavigate();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const location = useLocation();
    const prevPath = useRef(location.pathname);
    const dispatch = useDispatch();

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

    useEffect(() => {
        if (
            prevPath.current === "/books-management" &&
            location.pathname !== "/books-management"
        ) {
            dispatch(resetCategoryState());
            dispatch(resetAuthorState());
            dispatch(resetPublisherState());
        }
        prevPath.current = location.pathname;
    }, [location.pathname, dispatch]);

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
