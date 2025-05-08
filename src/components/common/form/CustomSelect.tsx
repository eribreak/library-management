import {
    createListCollection,
    Field,
    Portal,
    Select,
    SelectRootProps,
} from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";

export interface SelectOption {
    value: string;
    label: string;
}

type CustomSelectRootProps = Omit<SelectRootProps, "collection"> & {
    collection?: SelectRootProps["collection"];
};

export interface CustomSelectProps extends CustomSelectRootProps {
    name: string;
    label?: string;
    optionsList: SelectOption[];
    placeholder?: string;
    required?: boolean;
}

export const CustomSelect = ({
    name,
    label,
    optionsList,
    placeholder,
    required = false,
    ...selectProps
}: CustomSelectProps) => {
    const {
        control,
        formState: { errors },
    } = useFormContext();

    const error = errors[name]?.message as string | undefined;

    const validOptionsList = Array.isArray(optionsList) ? optionsList : [];

    const collection = createListCollection({
        items: validOptionsList,
    });

    return (
        <Field.Root invalid={!!error}>
            <Field.Label htmlFor={name}>
                {label} {required && <span style={{ color: "red" }}>*</span>}
            </Field.Label>
            <Controller
                name={name}
                control={control}
                render={({ field: { name, value, onChange, onBlur } }) => (
                    <Select.Root
                        {...selectProps}
                        name={name}
                        value={value}
                        onValueChange={({ value }) => {
                            onChange(value);
                            console.log("Selected value:", value);
                        }}
                        onInteractOutside={() => onBlur()}
                        collection={collection}
                    >
                        <Select.HiddenSelect />
                        <Select.Control>
                            <Select.Trigger>
                                <Select.ValueText placeholder={placeholder} />
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                                <Select.Indicator />
                            </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                            <Select.Positioner style={{ zIndex: 9999 }}>
                                <Select.Content>
                                    {(() => {
                                        if (validOptionsList.length === 0) {
                                            return (
                                                <Select.Item
                                                    item={{
                                                        value: "",
                                                        label: "Không có tùy chọn",
                                                    }}
                                                >
                                                    Không có tùy chọn
                                                </Select.Item>
                                            );
                                        } else {
                                            return validOptionsList.map(
                                                (option) => (
                                                    <Select.Item
                                                        item={option}
                                                        key={option.value}
                                                    >
                                                        {option.label}
                                                        <Select.ItemIndicator />
                                                    </Select.Item>
                                                )
                                            );
                                        }
                                    })()}
                                </Select.Content>
                            </Select.Positioner>
                        </Portal>
                    </Select.Root>
                )}
            />
            {error && <Field.ErrorText>{error}</Field.ErrorText>}
        </Field.Root>
    );
};
