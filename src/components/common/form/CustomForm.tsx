import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodTypeAny } from "zod";
import React from "react";

interface CustomFormProps<T extends ZodTypeAny>
    extends React.HTMLAttributes<HTMLFormElement> {
    schema: T;
    onSubmit: (data: z.infer<T>) => void;
    children: React.ReactNode;
}

const CustomForm = <T extends ZodTypeAny>({
    schema,
    onSubmit,
    children,
    ...formProps
}: CustomFormProps<T>) => {
    const methods = useForm<z.infer<T>>({
        resolver: zodResolver(schema),
    });

    return (
        <FormProvider {...methods}>
            <form {...formProps} onSubmit={methods.handleSubmit(onSubmit)}>
                {children}
            </form>
        </FormProvider>
    );
};

export default CustomForm;
