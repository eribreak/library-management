import { Field } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";
import { SelectOption } from "./CustomSelect";
import ReactSelect from "react-select";

export interface CustomMultiSelectProps {
    name: string;
    label?: string;
    optionsList: SelectOption[];
    placeholder?: string;
    required?: boolean;
}

export const CustomMultiSelect = ({
    name,
    label,
    optionsList,
    placeholder = "Chọn tùy chọn",
    required = false,
}: CustomMultiSelectProps) => {
    const {
        control,
        formState: { errors },
    } = useFormContext();

    const error = errors[name]?.message as string | undefined;

    return (
        <Field.Root invalid={!!error}>
            <Field.Label>
                {label} {required && <span style={{ color: "red" }}>*</span>}
            </Field.Label>
            <Controller
                name={name}
                control={control}
                render={({ field: { value = [], onChange, onBlur } }) => (
                    <ReactSelect
                        isMulti
                        options={optionsList.map((option) => ({
                            value: option.value,
                            label: option.label,
                        }))}
                        placeholder={placeholder}
                        value={optionsList
                            .filter(
                                (option) =>
                                    Array.isArray(value) &&
                                    value.includes(option.value)
                            )
                            .map((option) => ({
                                value: option.value,
                                label: option.label,
                            }))}
                        onChange={(selectedOptions) => {
                            const values = selectedOptions
                                ? selectedOptions.map((option) => option.value)
                                : [];
                            onChange(values);
                        }}
                        onBlur={onBlur}
                        closeMenuOnSelect={false}
                        styles={{
                            control: (base) => ({
                                ...base,
                                minHeight: "40px",
                                borderRadius: "0.375rem",
                            }),
                            menu: (base) => ({
                                ...base,
                                zIndex: 9999,
                            }),
                        }}
                    />
                )}
            />
            {error && <Field.ErrorText>{error}</Field.ErrorText>}
        </Field.Root>
    );
};
