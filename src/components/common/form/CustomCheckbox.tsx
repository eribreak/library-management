import { Checkbox, Field } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";
import { CheckboxProps } from "../../ui/checkbox";

export interface CustomCheckboxProps extends CheckboxProps {
    name: string;
    label?: string;
}

export const CustomCheckbox = ({
    name,
    label,
    ...checkboxProps
}: CustomCheckboxProps) => {
    const {
        control,
        formState: { errors },
    } = useFormContext();

    const error = errors[name]?.message as string | undefined;

    return (
        <Field.Root invalid={!!error}>
            <Controller
                name={name}
                control={control}
                render={({ field: { value, onChange, ref } }) => (
                    <Checkbox.Root
                        {...checkboxProps}
                        checked={value}
                        onCheckedChange={(details) => onChange(details.checked)}
                        ref={ref}
                    >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control>
                            <Checkbox.Indicator />
                        </Checkbox.Control>
                        {label && <Checkbox.Label>{label}</Checkbox.Label>}
                    </Checkbox.Root>
                )}
            />
            {error && <Field.ErrorText>{error}</Field.ErrorText>}
        </Field.Root>
    );
};
