import { Button, Flex, Text } from "@chakra-ui/react";
import * as Dialog from "../../ui/dialog";
import { ReactNode } from "react";

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    children?: ReactNode;
    isLoading?: boolean;
}

const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Xác nhận",
    cancelText = "Hủy",
    children,
    isLoading = false,
}: ConfirmDialogProps) => {
    return (
        <Dialog.DialogRoot
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
        >
            <Dialog.DialogContent>
                <Dialog.DialogHeader>
                    <Dialog.DialogTitle>{title}</Dialog.DialogTitle>
                </Dialog.DialogHeader>

                <Dialog.DialogBody>
                    <Text mb={4}>{description}</Text>
                    {children}
                </Dialog.DialogBody>

                <Dialog.DialogFooter>
                    <Flex gap={2} justify="flex-end">
                        <Button variant="outline" onClick={onClose}>
                            {cancelText}
                        </Button>
                        <Button
                            colorScheme="red"
                            onClick={onConfirm}
                            loading={isLoading}
                        >
                            {confirmText}
                        </Button>
                    </Flex>
                </Dialog.DialogFooter>
            </Dialog.DialogContent>
        </Dialog.DialogRoot>
    );
};

export default ConfirmDialog;
