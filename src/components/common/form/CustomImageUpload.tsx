import { useRef, useState } from "react";
import {
    Box,
    Flex,
    Field,
    Image,
    Text,
    IconButton,
    SimpleGrid,
} from "@chakra-ui/react";
import {
    FaFolderClosed as CloseIcon,
    FaImage as AttachmentIcon,
} from "react-icons/fa6";

export interface CustomImageUploadProps {
    label?: string;
    onChange: (file: File | null) => void;
    preview?: string | null;
    required?: boolean;
    multiple?: boolean;
    previews?: string[];
    maxFiles?: number;
    acceptedFileTypes?: string;
}

export const CustomImageUpload = ({
    label,
    onChange,
    preview,
    required = false,
    multiple = false,
    previews = [],
    maxFiles = 4,
    acceptedFileTypes = "image/*",
}: CustomImageUploadProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (multiple) {
            onChange(event.target.files);
        } else {
            const file = event.target.files && event.target.files[0];
            onChange(file || null);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleDrag = (event: React.DragEvent) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.type === "dragenter" || event.type === "dragover") {
            setDragActive(true);
        } else if (event.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        event.stopPropagation();
        setDragActive(false);

        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
            if (multiple) {
                onChange(event.dataTransfer.files);
            } else {
                onChange(event.dataTransfer.files[0]);
            }
        }
    };

    const handleRemoveImage = () => {
        onChange(null);
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <Field.Root>
            {label && (
            <Field.Label>
                {label}{" "}
                {required && <span style={{ color: "red" }}>*</span>}
            </Field.Label>
            )}

            <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            accept={acceptedFileTypes}
            multiple={multiple}
            style={{ display: "none" }}
            />

            {(() => {
            if (multiple) {
                return (
                <>
                    <Box
                    borderWidth={2}
                    borderRadius="md"
                    borderColor={dragActive ? "blue.500" : "gray.200"}
                    borderStyle="dashed"
                    p={4}
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    bg={dragActive ? "blue.50" : "transparent"}
                    textAlign="center"
                    cursor="pointer"
                    onClick={handleButtonClick}
                    mb={4}
                    >
                    <Flex
                        direction="column"
                        align="center"
                        justify="center"
                    >
                        <AttachmentIcon
                        boxSize={6}
                        color="gray.500"
                        mb={2}
                        />
                        <Text fontWeight="medium">
                        Kéo thả ảnh vào đây hoặc bấm để chọn
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                        Tối đa {maxFiles} ảnh
                        </Text>
                    </Flex>
                    </Box>

                    {previews.length > 0 && (
                    <SimpleGrid columns={[1, 2, 4]} gap={3} mt={4}>
                        {previews.map((previewUrl, index) => (
                        <Box key={index} position="relative">
                            <Image
                            src={previewUrl}
                            alt={`Image preview ${index + 1}`}
                            borderRadius="md"
                            objectFit="cover"
                            w="100%"
                            h="100px"
                            />
                        </Box>
                        ))}
                    </SimpleGrid>
                    )}
                </>
                );
            } else {
                return (
                <Box>
                    {(() => {
                    if (preview) {
                        return (
                        <Box position="relative" width="fit-content">
                            <Image
                            src={preview}
                            alt="Image preview"
                            borderRadius="md"
                            maxH="150px"
                            objectFit="cover"
                            />
                            <IconButton
                            aria-label="Remove image"
                            icon={<CloseIcon />}
                            size="xs"
                            position="absolute"
                            top={0}
                            right={0}
                            colorScheme="red"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveImage();
                            }}
                            />
                        </Box>
                        );
                    } else {
                        return (
                        <Box
                            borderWidth={2}
                            borderRadius="md"
                            borderColor={dragActive ? "blue.500" : "gray.200"}
                            borderStyle="dashed"
                            p={4}
                            onDragEnter={handleDrag}
                            onDragOver={handleDrag}
                            onDragLeave={handleDrag}
                            onDrop={handleDrop}
                            bg={dragActive ? "blue.50" : "transparent"}
                            textAlign="center"
                            cursor="pointer"
                            onClick={handleButtonClick}
                        >
                            <Flex
                            direction="column"
                            align="center"
                            justify="center"
                            >
                            <AttachmentIcon
                                boxSize={6}
                                color="gray.500"
                                mb={2}
                            />
                            <Text fontWeight="medium">
                                Kéo thả ảnh vào đây hoặc bấm để chọn
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                                PNG, JPG hoặc GIF
                            </Text>
                            </Flex>
                        </Box>
                        );
                    }
                    })()}
                </Box>
                );
            }
            })()}
        </Field.Root>
    );
};
