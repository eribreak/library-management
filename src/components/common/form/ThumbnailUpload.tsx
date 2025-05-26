import { useRef } from "react";
import { Box, Flex, Field, Image, Text } from "@chakra-ui/react";
import { FaImage as AttachmentIcon, FaTrash } from "react-icons/fa6";
import CustomButton from "../button/CustomButton";
import { useFormContext } from "react-hook-form";

interface ThumbnailUploadProps {
    name: string;
    label?: string;
    required?: boolean;
}

const ThumbnailUpload = ({ name, label, required }: ThumbnailUploadProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {
        register,
        setValue,
        watch,
        formState: { errors },
    } = useFormContext();

    const value = watch(name);
    const error = errors[name]?.message as string | undefined;

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            setValue(name, file);
        }
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleRemove = () => setValue(name, null);

    const getImageUrl = (value: unknown) => {
        if (typeof value === "string") return value;
        if (value instanceof File) return URL.createObjectURL(value);
        return "";
    };

    const handleClick = () => {
        const input = document.getElementById(
            `${name}-input`
        ) as HTMLInputElement;
        if (input) input.click();
    };

    return (
        <Field.Root invalid={!!error}>
            {label && (
                <Field.Label>
                    {label}{" "}
                    {required && <span style={{ color: "red" }}>*</span>}
                </Field.Label>
            )}
            <input
                id={`${name}-input`}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                {...register(name, {
                    onChange: handleFileChange,
                })}
            />
            <Box
                w="100%"
                h="350px"
                borderWidth={2}
                borderRadius="md"
                borderColor={error ? "red.500" : "gray.200"}
                borderStyle="dashed"
                position="relative"
                overflow="hidden"
                onClick={handleClick}
                cursor="pointer"
            >
                {!value ? (
                    <Flex
                        direction="column"
                        align="center"
                        justify="center"
                        h="100%"
                    >
                        <AttachmentIcon size={20} color="gray.500" />
                        <Text fontWeight="medium">
                            Kéo thả ảnh hoặc bấm để chọn
                        </Text>
                    </Flex>
                ) : (
                    <Box position="relative" w="100%" h="100%">
                        <Image
                            src={getImageUrl(value)}
                            alt="Image preview"
                            borderRadius="md"
                            objectFit="contain"
                            w="100%"
                            h="100%"
                            p={2}
                        />
                        <CustomButton
                            aria-label="Remove image"
                            colorScheme="white"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemove();
                            }}
                            size="xs"
                            position="absolute"
                            top={1}
                            right={1}
                            bg="white"
                            border="1px solid #e2e8f0"
                            boxShadow="0 1px 4px rgba(0,0,0,0.10)"
                            borderRadius="full"
                            p={0.5}
                            _hover={{ bg: "gray.100" }}
                            zIndex={2}
                        >
                            <FaTrash color="#e53e3e" size={12} />
                        </CustomButton>
                    </Box>
                )}
            </Box>
            {error && <Field.ErrorText>{error}</Field.ErrorText>}
        </Field.Root>
    );
};

export default ThumbnailUpload;
