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
}

export const CustomSelect = ({
    name,
    label,
    optionsList,
    placeholder,
    ...selectProps
}: CustomSelectProps) => {
    const {
        control,
        formState: { errors },
    } = useFormContext();

    const error = errors[name]?.message as string | undefined;
    const collection = createListCollection({
        items: optionsList,
    });

    return (
        <Field.Root invalid={!!error}>
            <Field.Label htmlFor={name}>{label}</Field.Label>
            <Controller
                name={name}
                control={control}
                render={({ field: { name, value, onChange, onBlur } }) => (
                    <Select.Root
                        {...selectProps}
                        name={name}
                        value={value}
                        onValueChange={({ value }) => onChange(value)}
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
                            <Select.Positioner>
                                <Select.Content>
                                    {collection.items.map((option) => (
                                        <Select.Item
                                            item={option}
                                            key={option.value}
                                        >
                                            {option.label}
                                            <Select.ItemIndicator />
                                        </Select.Item>
                                    ))}
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
