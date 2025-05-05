import { FC } from "react";
import styled from "./Header.module.css";
import { Box } from "@chakra-ui/react";

interface HeaderProps {
    toggleSidebar: () => void;
    isSidebarCollapsed: boolean;
}

const Header: FC<HeaderProps> = ({ toggleSidebar }) => {
    return (
        <div className={styled.header__wrapper}>
            <header className={styled.header}>
                <Box display={"flex"} minW={"240px"} alignItems="center">
                    <div className={styled.sidebar__logo}>
                        <span>Kiai</span>
                        <span>Library</span>
                    </div>
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
                    </div>
                </Box>
                <div className={styled.sidebar__menu}>
                    <div className={styled.header__right}>
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
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
};

export default Header;
