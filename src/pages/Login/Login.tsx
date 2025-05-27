import { CustomForm } from "@/components/common/form";
import { CustomCheckbox } from "@/components/common/form/CustomCheckbox";
import { CustomInputField } from "@/components/common/form/CustomInputField";
import {
    LoginSchemaType,
    loginSchema,
    LoginDataType,
} from "@/utils/validator/authForm";
import { Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginRequest, clearErrors } from "@/store/slices/authSlice";
import { RootState } from "@/store/store";
import styled from "./Login.module.css";

interface DataType {
    name: string;
    label: string;
    required?: boolean;
    placeholder?: string;
    type?: string;
}

const formDataArray: DataType[] = [
    {
        name: "email",
        label: "Địa chỉ email",
        placeholder: "example@gmail.com",
    },
    {
        name: "password",
        label: "Mật khẩu",
        placeholder: "Nhập mật khẩu",
        type: "password",
    },
];

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loginSuccess, setLoginSuccess] = useState(false);

    const { isAuthenticated, loading, error } = useSelector(
        (state: RootState) => state.auth
    );

    useEffect(() => {
        if (isAuthenticated && loginSuccess) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, loginSuccess, navigate]);

    useEffect(() => {
        if (error) {
            dispatch(clearErrors());
        }
    }, [error, dispatch]);

    const handleSubmit = (data: LoginDataType) => {
        if (data.email && data.password) {
            dispatch(
                loginRequest({
                    email: data.email,
                    password: data.password,
                })
            );
            setLoginSuccess(true);
        }
    };

    return (
        <div className={styled.login}>
            <div className={styled.container}>
                <div>
                    <h1 className={styled.title}>Đăng nhập vào tài khoản</h1>
                    <p className={styled.subtitle}>
                        Vui lòng nhập địa chỉ email và mật khẩu để tiếp tục
                    </p>
                </div>
                <CustomForm<LoginSchemaType>
                    schema={loginSchema}
                    onSubmit={handleSubmit}
                >
                    <div className="flex-container">
                        <div className={styled.text_container}>
                            {formDataArray.map((item, index) => {
                                if (item.name === "savePassword") {
                                    return (
                                        <CustomCheckbox
                                            key={index}
                                            name={item.name}
                                            label={item.label}
                                            variant={"outline"}
                                        />
                                    );
                                } else {
                                    return (
                                        <CustomInputField
                                            className={styled.input_field}
                                            required={item.required}
                                            key={index}
                                            name={item.name}
                                            label={item.label}
                                            placeholder={item.placeholder}
                                            type={item.type}
                                        />
                                    );
                                }
                            })}
                        </div>
                        <div>
                            <div className={styled.button_group}>
                                <Button
                                    className={styled.submit_button}
                                    type="submit"
                                    loading={loading}
                                    loadingText="Đang đăng nhập..."
                                >
                                    Đăng nhập
                                </Button>
                            </div>
                        </div>
                    </div>
                </CustomForm>
            </div>
        </div>
    );
};

export default Login;
