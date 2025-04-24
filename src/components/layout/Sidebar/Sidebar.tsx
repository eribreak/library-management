import { FC } from "react";
import { Link } from "react-router-dom";
import styled from "./Sidebar.module.css";

interface SideBarProps {
    activePage?: string;
    isCollapsed?: boolean;
}

const SideBar: FC<SideBarProps> = ({
    activePage = "dashboard",
    isCollapsed = false,
}) => {
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
                        activePage === "dashboard"
                            ? styled.sidebar__nav_item_active
                            : ""
                    } ${isCollapsed ? styled.sidebar__nav_item_collapsed : ""}`}
                >
                    <img
                        src={`/src/assets/images/images/${
                            activePage === "dashboard"
                                ? "dashboard-icon.svg"
                                : "svg/black-dashboard.svg"
                        }`}
                        alt="Dashboard"
                    />
                    <span className={isCollapsed ? styled.text_hidden : ""}>
                        Trang chủ
                    </span>
                </Link>

                <Link
                    to="/employees-management"
                    className={`${styled.sidebar__nav_item} ${
                        activePage === "contact"
                            ? styled.sidebar__nav_item_active
                            : ""
                    } ${isCollapsed ? styled.sidebar__nav_item_collapsed : ""}`}
                >
                    <img
                        src={`/src/assets/images/images/${
                            activePage === "contact"
                                ? "white-contact.svg"
                                : "contact-icon.svg"
                        }`}
                        alt="Employees management"
                    />
                    <span className={isCollapsed ? styled.text_hidden : ""}>
                        Quản lý nhân viên
                    </span>
                </Link>

                <Link
                    to="/users-management"
                    className={`${styled.sidebar__nav_item} ${
                        activePage === "team"
                            ? styled.sidebar__nav_item_active
                            : ""
                    } ${isCollapsed ? styled.sidebar__nav_item_collapsed : ""}`}
                >
                    <img
                        src="/src/assets/images/images/team-icon.svg"
                        alt="Users management"
                    />
                    <span className={isCollapsed ? styled.text_hidden : ""}>
                        Quản lý người dùng
                    </span>
                </Link>

                <Link
                    to="/authors-management"
                    className={`${styled.sidebar__nav_item} ${
                        activePage === "team"
                            ? styled.sidebar__nav_item_active
                            : ""
                    } ${isCollapsed ? styled.sidebar__nav_item_collapsed : ""}`}
                >
                    <img
                        src="/src/assets/images/images/team-icon.svg"
                        alt="Authors management"
                    />
                    <span className={isCollapsed ? styled.text_hidden : ""}>
                        Quản lý tác giả
                    </span>
                </Link>

                <div className={styled.sidebar__divider}></div>

                <Link
                    to="/books-management"
                    className={`${styled.sidebar__nav_item} ${
                        activePage === "product-stock"
                            ? styled.sidebar__nav_item_active
                            : ""
                    } ${isCollapsed ? styled.sidebar__nav_item_collapsed : ""}`}
                >
                    <img
                        src={`/src/assets/images/images/${
                            activePage === "product-stock"
                                ? "svg/white-product-stock.svg"
                                : "product-stock-icon.svg"
                        }`}
                        alt="Books management"
                    />
                    <span className={isCollapsed ? styled.text_hidden : ""}>
                        Quản lý sách
                    </span>
                </Link>

                <Link
                    to="/publishers-management"
                    className={`${styled.sidebar__nav_item} ${
                        activePage === "calendar"
                            ? styled.sidebar__nav_item_active
                            : ""
                    } ${isCollapsed ? styled.sidebar__nav_item_collapsed : ""}`}
                >
                    <img
                        src="/src/assets/images/images/calendar-icon.svg"
                        alt="Publishers management"
                    />
                    <span className={isCollapsed ? styled.text_hidden : ""}>
                        Quản lý nhà xuất bản
                    </span>
                </Link>

                <Link
                    to="/categories-management"
                    className={`${styled.sidebar__nav_item} ${
                        activePage === "table"
                            ? styled.sidebar__nav_item_active
                            : ""
                    } ${isCollapsed ? styled.sidebar__nav_item_collapsed : ""}`}
                >
                    <img
                        src="/src/assets/images/images/table-icon.svg"
                        alt="Categories management"
                    />
                    <span className={isCollapsed ? styled.text_hidden : ""}>
                        Quản lý thể loại
                    </span>
                </Link>

                <Link
                    to="/borrowed-books-management"
                    className={`${styled.sidebar__nav_item} ${
                        activePage === "invoice"
                            ? styled.sidebar__nav_item_active
                            : ""
                    } ${isCollapsed ? styled.sidebar__nav_item_collapsed : ""}`}
                >
                    <img
                        src="/src/assets/images/images/invoice-icon.svg"
                        alt="Borrowed books management"
                    />
                    <span className={isCollapsed ? styled.text_hidden : ""}>
                        Quản lý đơn mượn
                    </span>
                </Link>

                <Link
                    to="/rates-management"
                    className={`${styled.sidebar__nav_item} ${
                        activePage === "inbox"
                            ? styled.sidebar__nav_item_active
                            : ""
                    } ${isCollapsed ? styled.sidebar__nav_item_collapsed : ""}`}
                >
                    <img
                        src="/src/assets/images/images/svg/inbox.svg"
                        alt="Rates management"
                    />
                    <span className={isCollapsed ? styled.text_hidden : ""}>
                        Quản lý đánh giá
                    </span>
                </Link>

                <div className={styled.sidebar__divider}></div>

                <Link
                    to="/logout"
                    className={`${styled.sidebar__nav_item} ${
                        activePage === "logout"
                            ? styled.sidebar__nav_item_active
                            : ""
                    } ${isCollapsed ? styled.sidebar__nav_item_collapsed : ""}`}
                >
                    <img
                        src="/src/assets/images/images/logout-icon.svg"
                        alt="Logout"
                    />
                    <span className={isCollapsed ? styled.text_hidden : ""}>
                        Đăng xuất
                    </span>
                </Link>
            </div>
        </div>
    );
};

export default SideBar;
