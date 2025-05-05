import { FC } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styled from "./Sidebar.module.css";
import { useDispatch } from "react-redux";
import { logout } from "@/store/slices/authSlice";

interface SideBarProps {
    isCollapsed?: boolean;
}

const SideBar: FC<SideBarProps> = ({ isCollapsed = false }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;

    const isActive = (path: string) => {
        return currentPath.startsWith(path);
    };

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        dispatch(logout());
        navigate("/login");
    };

    return (
        <div
            className={`${styled.sidebar} ${
                isCollapsed ? styled.sidebar_collapsed : ""
            }`}
        >
            <div className={styled.sidebar__nav}>
                <Link
                    to="/dashboard"
                    className={`${styled.sidebar__nav_item} ${
                        isActive("/dashboard")
                            ? styled.sidebar__nav_item_active
                            : ""
                    } ${isCollapsed ? styled.sidebar__nav_item_collapsed : ""}`}
                >
                    <img
                        src="/src/assets/images/images/svg/black-dashboard.svg"
                        alt="Dashboard"
                    />
                    <span className={isCollapsed ? styled.text_hidden : ""}>
                        Trang chủ
                    </span>
                </Link>

                <Link
                    to="/employees-management"
                    className={`${styled.sidebar__nav_item} ${
                        isActive("/employees-management")
                            ? styled.sidebar__nav_item_active
                            : ""
                    } ${isCollapsed ? styled.sidebar__nav_item_collapsed : ""}`}
                >
                    <img
                        src="/src/assets/images/images/contact-icon.svg"
                        alt="Employees management"
                    />
                    <span className={isCollapsed ? styled.text_hidden : ""}>
                        Nhân viên
                    </span>
                </Link>

                <Link
                    to="/users-management"
                    className={`${styled.sidebar__nav_item} ${
                        isActive("/users-management")
                            ? styled.sidebar__nav_item_active
                            : ""
                    } ${isCollapsed ? styled.sidebar__nav_item_collapsed : ""}`}
                >
                    <img
                        src="/src/assets/images/images/team-icon.svg"
                        alt="Users management"
                    />
                    <span className={isCollapsed ? styled.text_hidden : ""}>
                        Người dùng
                    </span>
                </Link>

                <Link
                    to="/authors-management"
                    className={`${styled.sidebar__nav_item} ${
                        isActive("/authors-management")
                            ? styled.sidebar__nav_item_active
                            : ""
                    } ${isCollapsed ? styled.sidebar__nav_item_collapsed : ""}`}
                >
                    <img
                        src="/src/assets/images/images/team-icon.svg"
                        alt="Authors management"
                    />
                    <span className={isCollapsed ? styled.text_hidden : ""}>
                        Tác giả
                    </span>
                </Link>

                <div className={styled.sidebar__divider}></div>

                <Link
                    to="/books-management"
                    className={`${styled.sidebar__nav_item} ${
                        isActive("/books-management")
                            ? styled.sidebar__nav_item_active
                            : ""
                    } ${isCollapsed ? styled.sidebar__nav_item_collapsed : ""}`}
                >
                    <img
                        src="/src/assets/images/images/product-stock-icon.svg"
                        alt="Books management"
                    />
                    <span className={isCollapsed ? styled.text_hidden : ""}>
                        Sách
                    </span>
                </Link>

                <Link
                    to="/publishers-management"
                    className={`${styled.sidebar__nav_item} ${
                        isActive("/publishers-management")
                            ? styled.sidebar__nav_item_active
                            : ""
                    } ${isCollapsed ? styled.sidebar__nav_item_collapsed : ""}`}
                >
                    <img
                        src="/src/assets/images/images/calendar-icon.svg"
                        alt="Publishers management"
                    />
                    <span className={isCollapsed ? styled.text_hidden : ""}>
                        Nhà xuất bản
                    </span>
                </Link>

                <Link
                    to="/categories-management"
                    className={`${styled.sidebar__nav_item} ${
                        isActive("/categories-management")
                            ? styled.sidebar__nav_item_active
                            : ""
                    } ${isCollapsed ? styled.sidebar__nav_item_collapsed : ""}`}
                >
                    <img
                        src="/src/assets/images/images/table-icon.svg"
                        alt="Categories management"
                    />
                    <span className={isCollapsed ? styled.text_hidden : ""}>
                        Thể loại
                    </span>
                </Link>

                <Link
                    to="/orders-management"
                    className={`${styled.sidebar__nav_item} ${
                        isActive("/orders-management")
                            ? styled.sidebar__nav_item_active
                            : ""
                    } ${isCollapsed ? styled.sidebar__nav_item_collapsed : ""}`}
                >
                    <img
                        src="/src/assets/images/images/invoice-icon.svg"
                        alt="Borrowed books management"
                    />
                    <span className={isCollapsed ? styled.text_hidden : ""}>
                        Đơn mượn
                    </span>
                </Link>

                <Link
                    to="/reviews-management"
                    className={`${styled.sidebar__nav_item} ${
                        isActive("/reviews-management")
                            ? styled.sidebar__nav_item_active
                            : ""
                    } ${isCollapsed ? styled.sidebar__nav_item_collapsed : ""}`}
                >
                    <img
                        src="/src/assets/images/images/svg/inbox.svg"
                        alt="Rates management"
                    />
                    <span className={isCollapsed ? styled.text_hidden : ""}>
                        Đánh giá
                    </span>
                </Link>

                <div className={styled.sidebar__divider}></div>

                <a
                    href="#"
                    onClick={handleLogout}
                    className={`${styled.sidebar__nav_item} ${
                        isCollapsed ? styled.sidebar__nav_item_collapsed : ""
                    }`}
                >
                    <img
                        src="/src/assets/images/images/logout-icon.svg"
                        alt="Logout"
                    />
                    <span className={isCollapsed ? styled.text_hidden : ""}>
                        Đăng xuất
                    </span>
                </a>
            </div>
        </div>
    );
};

export default SideBar;
