import { Box, Field } from "@chakra-ui/react";
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
            <Field.Label gap={"0px"}>
                {label}
                {required && <span style={{ color: "red" }}>*</span>}
            </Field.Label>
            <Controller
                name={name}
                control={control}
                render={({ field: { value = [], onChange, onBlur } }) => {
                    const mapOptions = (options: SelectOption[]) =>
                        options.map((option) => ({
                            value: option.value,
                            label: option.label,
                        }));

                    const getSelectedOptions = (
                        options: SelectOption[],
                        selectedValues: any[]
                    ) => {
                        return options
                            .filter((option) => {
                                const optionVal = String(option.value);
                                const isIncluded =
                                    Array.isArray(selectedValues) &&
                                    selectedValues.some(
                                        (val) => String(val) === optionVal
                                    );
                                return isIncluded;
                            })
                            .map((option) => ({
                                value: option.value,
                                label: option.label,
                            }));
                    };

                    const handleChange = (selectedOptions: any) => {
                        const values = selectedOptions
                            ? selectedOptions.map((option: any) => option.value)
                            : [];
                        onChange(values);
                    };

                    return (
                        <Box w={"100%"}>
                            <ReactSelect
                                menuPlacement="top"
                                isMulti
                                options={mapOptions(optionsList)}
                                placeholder={placeholder}
                                value={getSelectedOptions(optionsList, value)}
                                onChange={handleChange}
                                onBlur={onBlur}
                                closeMenuOnSelect={false}
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        borderColor: error
                                            ? "#ef4444"
                                            : "rgb(228 228 231)",
                                    }),
                                    menu: (base) => ({
                                        ...base,
                                        zIndex: 10,
                                    }),
                                }}
                            />
                        </Box>
                    );
                }}
            />
            {error && <Field.ErrorText>{error}</Field.ErrorText>}
        </Field.Root>
    );
};
