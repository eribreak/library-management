import { FC } from "react";
import styled from "./Header.module.css";

interface HeaderProps {
    toggleSidebar: () => void;
    isSidebarCollapsed: boolean;
}

const Header: FC<HeaderProps> = ({ toggleSidebar }) => {
    return (
        <div className={styled.header__wrapper}>
            <header className={styled.header}>
                <div className={styled.sidebar__logo}>
                    <span>Kiai</span>

                    <span>Library</span>
                </div>
                <div className={styled.sidebar__menu}>
                    <div className={styled.header__left}>
                        <div
                            className={styled.header__toggle}
                            onClick={toggleSidebar}
                        >
                            <img
                                src="/src/assets/images/images/svg/menu-icon.svg"
                                alt="Menu"
                            />
                        </div>
                        <div className={styled.header__search}>
                            <img
                                className={styled.header__search_icon}
                                src="/src/assets/images/images/svg/search-icon.svg"
                                alt="Search"
                            />
                            <input
                                type="text"
                                className={styled.header__search_input}
                                placeholder="Search"
                            />
                        </div>
                    </div>
                    <div className={styled.header__right}>
                        <div className={styled.header__notification}>
                            <img
                                src="/src/assets/images/images/svg/notification.svg"
                                alt="Notification"
                            />
                            <div className={styled.header__notification_badge}>
                                5
                            </div>
                        </div>
                        <div className={styled.header__language}>
                            <img
                                src="/src/assets/images/images/svg/flag.svg"
                                alt="Language"
                            />
                            <select id="language-dropdown" defaultValue={"en"}>
                                <option value="en">
                                    English
                                </option>
                                <option value="fr">Français</option>
                                <option value="es">Español</option>
                                <option value="de">Deutsch</option>
                                <option value="vi">Tiếng Việt</option>
                            </select>
                        </div>
                        <div className={styled.header__profile}>
                            <div className={styled.header__profile_avatar}>
                                <img
                                    src="/src/assets/images/images/avatar.svg"
                                    alt="User Avatar"
                                />
                            </div>
                            <div className={styled.header__profile_info}>
                                <div className={styled.header__profile_name}>
                                    Moni Roy
                                </div>
                                <div className={styled.header__profile_role}>
                                    Admin
                                </div>
                            </div>
                            <div className={styled.header__profile_selector}>
                                <img
                                    src="/src/assets/images/images/svg/arrow-down.svg"
                                    alt="User Profile"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
};

export default Header;
