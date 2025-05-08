import React, { useState } from "react";
import { Employee, EmployeeFormData } from "@/store/slices/employeeSlice";
import styled from "./FormButton.module.css";
import clsx from "clsx";
import CustomButton from "../button/CustomButton";
import editIcon from "@/assets/images/images/edit-icon.svg";
import FormDialog from "./FormDialog";
import { CustomInputField } from "../form/CustomInputField";
import { employeeSchema } from "@/utils/validator/employee";

interface EmployeeFormDialogProps {
    isEdit: boolean;
    employee?: Employee;
    onSubmit: (data: EmployeeFormData) => void;
}

const EmployeeFormDialog: React.FC<EmployeeFormDialogProps> = ({
    isEdit,
    employee,
    onSubmit,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const defaultValues = {
        employee_code: isEdit && employee ? employee.employee_code : "",
        full_name: isEdit && employee ? employee.full_name : "",
        email: isEdit && employee ? employee.email : "",
    };

    const handleFormSubmit = (data: Record<string, unknown>) => {
        const employeeData: EmployeeFormData = {
            employee_code: data.employee_code as string,
            full_name: data.full_name as string,
            email: data.email as string,
        };

        if (isEdit && employee) {
            employeeData.id = employee.id;
        }

        onSubmit(employeeData);
        setIsOpen(false);
    };

    const openDialog = () => {
        setIsOpen(true);
    };

    const closeDialog = () => {
        setIsOpen(false);
    };

    const formFields = (
        <>
            <CustomInputField
                name="employee_code"
                label="Mã nhân viên"
                required
            />
            <CustomInputField name="full_name" label="Tên nhân viên" required />
            <CustomInputField name="email" label="Email" required />
        </>
    );

    return (
        <>
            {isEdit ? (
                <CustomButton
                    onClick={openDialog}
                    className={clsx(
                        styled.action_button,
                        styled.action_button_left
                    )}
                >
                    <img src={editIcon} alt="Edit" />
                </CustomButton>
            ) : (
                <CustomButton
                    onClick={openDialog}
                    bg={"var(--primary-color)"}
                    variant="solid"
                    px={4}
                    py={2}
                    borderRadius="md"
                    _hover={{ bg: "var(--primary-color-dark)" }}
                >
                    Thêm nhân viên
                </CustomButton>
            )}

            {isOpen && (
                <FormDialog
                    title={isEdit ? "Chỉnh sửa nhân viên" : "Thêm nhân viên"}
                    isOpen={isOpen}
                    onClose={closeDialog}
                    onSubmit={handleFormSubmit}
                    formFields={formFields}
                    defaultValues={defaultValues}
                    schema={employeeSchema}
                    hideDefaultTrigger={true}
                />
            )}
        </>
    );
};

export default EmployeeFormDialog;
