// import "@/components/templates/assets/css/login.css";
import { CustomForm } from "@/components/common/form";
import { CustomCheckbox } from "@/components/common/form/CustomCheckbox";
import { CustomInputField } from "@/components/common/form/CustomInputField";
import { FormSchemaType, formSchema, FormDataType } from "@/utils/validate";
import { Button } from "@chakra-ui/react";
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
        placeholder: "example@gmail.com"
    },
    {
        name: "password",
        label: "Mật khẩu",
        placeholder: "Nhập mật khẩu",
        type: "password",
    },
    {
        name: "savePassword",
        label: "Ghi nhớ mật khẩu",
    },
];

const Login = () => {
    // const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");
    // const [rememberMe, setRememberMe] = useState(true);

    const handleSubmit = (data: FormDataType) => {
        console.log(data);
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
                <CustomForm<FormSchemaType>
                    schema={formSchema}
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
                                            bg={"var(--input-background-color)"}
                                            borderRadius={"8px"}
                                            marginTop={"15px"}
                                            minHeight={"56px"}
                                            color={"var(--black)"}
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
                                    bg={"var(--secondary-color)"}
                                    padding={"0px 48px"}
                                    minHeight={"56px"}
                                    type="submit"
                                    width={"100%"}
                                    maxWidth={"418px"}
                                    
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
