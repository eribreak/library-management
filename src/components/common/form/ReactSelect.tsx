import React from "react";
import Select from "react-select";
import { Controller, useFormContext } from "react-hook-form";
import { Field } from "@chakra-ui/react";

export interface SelectOption {
    value: string;
    label: string;
}

export interface ReactSelectProps {
    name: string;
    label?: string;
    options: SelectOption[];
    placeholder?: string;
    required?: boolean;
    isMulti?: boolean;
    isSearchable?: boolean;
    isClearable?: boolean;
}

export const ReactSelect = ({
    name,
    label,
    options,
    placeholder = "Chọn...",
    required = false,
    isMulti = false,
    isSearchable = true,
    isClearable = false,
}: ReactSelectProps) => {
    const {
        control,
        formState: { errors },
    } = useFormContext();

    const error = errors[name]?.message as string | undefined;

    return (
        <Field.Root invalid={!!error}>
            <Field.Label htmlFor={name}>
                {label} {required && <span style={{ color: "red" }}>*</span>}
            </Field.Label>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <Select
                        {...field}
                        options={options}
                        placeholder={placeholder}
                        isMulti={isMulti}
                        menuPlacement="top"
                        isSearchable={isSearchable}
                        isClearable={isClearable}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        styles={{
                            control: (provided, state) => ({
                                ...provided,
                                borderColor: error ? "red" : "rgb(228 228 231)",
                                minHeight: "38px",
                                boxShadow: state.isFocused
                                    ? "0 0 0 1px var(--border-color)"
                                    : "none",
                                "&:hover": {
                                    borderColor: error
                                        ? "red"
                                        : "var(--border-color)",
                                },
                            }),
                            menu: (provided) => ({
                                ...provided,
                                zIndex: 9999,
                            }),
                        }}
                        value={
                            isMulti
                                ? options.filter((option) =>
                                      field.value?.includes(option.value)
                                  )
                                : options.find(
                                      (option) => option.value === field.value
                                  ) || null
                        }
                        onChange={(selectedOption) => {
                            if (isMulti) {
                                const values = selectedOption
                                    ? (selectedOption as SelectOption[]).map(
                                          (option) => option.value
                                      )
                                    : [];
                                field.onChange(values);
                            } else {
                                const value = selectedOption
                                    ? (selectedOption as SelectOption).value
                                    : null;
                                field.onChange(value);
                            }
                        }}
                    />
                )}
            />
            {error && <Field.ErrorText position={"absolute"} bottom={"-20px"}>{error}</Field.ErrorText>}
        </Field.Root>
    );
};
