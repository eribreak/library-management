import { Box, Flex, Field, Image, Text, SimpleGrid } from "@chakra-ui/react";
import { FaImage as AttachmentIcon, FaTrash } from "react-icons/fa6";
import CustomButton from "../button/CustomButton";
import { useFormContext } from "react-hook-form";

interface MultiImageUploadProps {
    name: string;
    label?: string;
    maxFiles?: number;
    required?: boolean;
}

const MultiImageUpload = ({
    name,
    label,
    maxFiles = 4,
    required,
}: MultiImageUploadProps) => {
    const {
        register,
        setValue,
        watch,
        formState: { errors },
    } = useFormContext();

    const rawValues = watch(name);
    const values = Array.isArray(rawValues) ? rawValues : [];
    const error = errors[name]?.message as string | undefined;

    const handleAdd = (files: FileList) => {
        const currentFiles = Array.isArray(rawValues) ? rawValues : [];
        const newFiles = Array.from(files).slice(
            0,
            maxFiles - currentFiles.length
        );
        setValue(name, [...currentFiles, ...newFiles]);
    };

    const handleRemove = (index: number) => {
        const currentFiles = Array.isArray(rawValues) ? rawValues : [];
        const newFiles = currentFiles.filter(
            (_: unknown, i: number) => i !== index
        );
        setValue(name, newFiles);
    };

    const getImageUrl = (file: unknown) => {
        if (typeof file === "string") return file;
        if (file instanceof File) return URL.createObjectURL(file);
        return "";
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
                type="file"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                id={`${name}-input`}
                {...register(name)}
                onChange={(e) => {
                    if (e.target.files) handleAdd(e.target.files);
                    e.currentTarget.value = "";
                }}
            />
            <Box
                w="100%"
                h="100%"
                minH="120px"
                borderWidth={2}
                borderRadius="md"
                borderColor={error ? "red.500" : "gray.200"}
                borderStyle="dashed"
                position="relative"
                overflow="hidden"
                p={4}
            >
                <SimpleGrid columns={4} gap={3} h="100%">
                    {values.length < maxFiles && (
                        <Box
                            h="100%"
                            w="100%"
                            minH="280px"
                            borderWidth={2}
                            borderStyle="dashed"
                            borderColor="gray.200"
                            borderRadius="md"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            cursor="pointer"
                            onClick={() =>
                                document
                                    .getElementById(`${name}-input`)
                                    ?.click()
                            }
                            _hover={{ bg: "gray.50", borderColor: "blue.500" }}
                        >
                            <Flex
                                direction="column"
                                align="center"
                                justify="center"
                            >
                                <AttachmentIcon size={15} color="gray.500" />
                                <Text fontSize="xs" fontWeight="medium">
                                    Thêm ảnh
                                </Text>
                            </Flex>
                        </Box>
                    )}
                    {values.map((file: unknown, index: number) => (
                        <Box
                            key={index}
                            position="relative"
                            w="100%"
                            aspectRatio={2 / 2.7}
                            border="1.5px solid #e2e8f0"
                            borderRadius="md"
                            boxShadow="sm"
                            bg="white"
                        >
                            <Image
                                src={getImageUrl(file)}
                                alt={`Image preview ${index + 1}`}
                                borderRadius="md"
                                objectFit="contain"
                                w="100%"
                                h="100%"
                                p={2}
                                display="block"
                                mx="auto"
                            />
                            <CustomButton
                                aria-label="Remove image"
                                color="#e53e3e"
                                fontSize="12px"
                                colorScheme="white"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemove(index);
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
                                <FaTrash size={12} />
                            </CustomButton>
                        </Box>
                    ))}
                </SimpleGrid>
            </Box>
            {error && <Field.ErrorText>{error}</Field.ErrorText>}
        </Field.Root>
    );
};

export default MultiImageUpload;
