import { Field } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";
import Editor from "react-simple-wysiwyg";
import { CSSProperties } from "react";
import styles from "./CustomWysiwygEditor.module.css";
import clsx from "clsx";

export interface CustomWysiwygEditorProps {
    name: string;
    label?: string;
    required?: boolean;
    height?: string;
    className?: string;
    style?: CSSProperties;
}

export const CustomWysiwygEditor = ({
    name,
    label,
    required,
    height = "200px",
    className = "",
    style = {},
}: CustomWysiwygEditorProps) => {
    const {
        control,
        formState: { errors },
    } = useFormContext();

    const error = errors[name]?.message as string | undefined;

    const customStyle: CSSProperties = {
        "--editor-height": height,
        ...style,
    } as CSSProperties;

    return (
        <Field.Root invalid={!!error} className={className}>
            {label && (
                <Field.Label htmlFor={name}>
                    {label}
                    {required && <span style={{ color: "red" }}>*</span>}
                </Field.Label>
            )}
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <div
                        className={clsx(styles.wysiwygEditor, {
                            [styles.wysiwygEditor_error]: error,
                        })}
                        style={customStyle}
                    >
                        <Editor 
                            
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value)}
                        />
                    </div>
                )}
            />
            {error && <Field.ErrorText>{error}</Field.ErrorText>}
        </Field.Root>
    );
};

export default CustomWysiwygEditor;
