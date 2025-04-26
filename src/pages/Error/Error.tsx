import CustomButton from "@/components/common/button/CustomButton";
import { Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import styled from "./Error.module.css"

const Error = () => {
    return (
        <div className={styled.error_container}>
            <div className={styled.error_content}>
                <img src="/src/assets/images/images/error-banner.svg" alt="404" />
                <Text fontWeight={"700"} fontSize={"var(--font-size-xlarge)"} marginTop={"98px"}>Dường như sai địa chỉ...</Text>
                <CustomButton w={"100%"} h={"56px"} bg={"var(--primary-color)"} marginTop={"35px"}>
                    <Link to="/dashboard">Quay về trang chủ</Link>
                </CustomButton>
            </div>
        </div>
    );
}

export default Error;