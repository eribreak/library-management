import { Field, TextareaProps, Textarea } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";

export interface CustomTextareaProps extends TextareaProps {
    name: string;
    label?: string;
    placeholder?: string;
    rows?: number;
}

export const CustomTextarea = ({
    name,
    label,
    placeholder,
    rows = 3,
    ...textareaProps
}: CustomTextareaProps) => {
    const {
        control,
        formState: { errors },
    } = useFormContext();

    const error = errors[name]?.message as string | undefined;

    return (
        <Field.Root invalid={!!error}>
            {label && <Field.Label htmlFor={name}>{label}</Field.Label>}
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <Textarea
                        id={name}
                        placeholder={placeholder}
                        rows={rows}
                        {...field}
                        {...textareaProps}
                    />
                )}
            />
            {error && <Field.ErrorText>{error}</Field.ErrorText>}
        </Field.Root>
    );
};
