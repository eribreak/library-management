import { Field, Input, InputProps } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

export interface CustomInputFieldProps extends InputProps {
    name: string;
    label?: string;
    required?: boolean;
}

export const CustomInputField = ({
    name,
    label,
    required,
    ...inputProps
}: CustomInputFieldProps) => {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    const error = errors[name]?.message as string | undefined;

    return (
        <Field.Root invalid={!!error}>
            <Field.Label htmlFor={name} gap={"0px"}>
                {label}
                {required && <span style={{ color: "red" }}>*</span>}
            </Field.Label>
            <Input {...inputProps} id={name} {...register(name)} />
            {error && <Field.ErrorText>{error}</Field.ErrorText>}
        </Field.Root>
    );
};
