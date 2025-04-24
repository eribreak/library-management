import { Box, Card, CardTitleProps, Flex, Image, Text } from "@chakra-ui/react";
import CustomRating from "../rating/CustomRating";
import CustomButton from "../button/CustomButton";
import { FaRegEye, FaRegHeart } from "react-icons/fa6";

interface CustomCardProps {
    imageUrl?: string;
    title: string;
    stars: number;
    reviews: number;
    readOnly?: boolean;
    cardTitleProps?: CardTitleProps;
}

const CustomCard = ({
    imageUrl,
    title,
    stars,
    reviews,
    readOnly = false,
    cardTitleProps,
}: CustomCardProps) => {
    return (
        <Card.Root
            width={"100%"}
            height={"350px"}
            overflow="hidden"
            border={"none"}
            position={"relative"}
            gap={"16px"}
            paddingRight={"15px"}
        >
            <Flex
                position={"absolute"}
                direction={"column"}
                alignItems={"center"}
                justifyContent={"center"}
                top={"12px"}
                right={"27px"}
                gap={"8px"}
                zIndex={1}
            >
                <CustomButton
                    width={"40px"}
                    height={"40px"}
                    borderRadius={"50%"}
                    backgroundColor={"var(--white)"}
                    color={"var(--black)"}
                    _hover={{
                        backgroundColor: "var(--primary-color)",
                        color: "var(--white)",
                    }}
                >
                    <FaRegHeart />
                </CustomButton>
                <CustomButton
                    width={"40px"}
                    height={"40px"}
                    borderRadius={"100%"}
                    backgroundColor={"var(--white)"}
                    color={"var(--black)"}
                    _hover={{
                        backgroundColor: "var(--primary-color)",
                        color: "var(--white)",
                    }}
                >
                    <FaRegEye />
                </CustomButton>
            </Flex>

            <Box
                position="relative"
                width={"100%"}
                height={"250px"}
                _hover={{
                    "& .add-to-cart": {
                        opacity: 1,
                        transform: "translateY(0)",
                    },
                }}
                backgroundColor={"#f5f5f5"}
                borderRadius={"var(--border-radius)"}
            >
                <Image
                    width={"100%"}
                    height={"100%"}
                    padding={"10%"}
                    fit={"contain"}
                    src={imageUrl}
                    alt="Product Image"
                />
                <CustomButton
                    className="add-to-cart"
                    width="100%"
                    height="41px"
                    borderTopLeftRadius={0}
                    borderTopRightRadius={0}
                    position="absolute"
                    bottom="0"
                    left="0"
                    backgroundColor="var(--primary-color)"
                    _hover={{ backgroundColor: "var(--primary-color-dark)" }}
                    color="white"
                    opacity={0}
                    transition="all 0.2s ease"
                >
                    <span>Thêm vào giỏ hàng</span>
                </CustomButton>
            </Box>
            <Card.Body padding={0} gap={"8px"}>
                <Card.Title
                    overflow={"hidden"}
                    textOverflow={"ellipsis"}
                    whiteSpace={"nowrap"}
                    title={title}
                    paddingRight={"30px"}
                    {...cardTitleProps}
                >
                    {title}
                </Card.Title>
                <Flex gap={"8px"}>
                    <CustomRating value={stars} readOnly={readOnly} />
                    <Text fontWeight={600} opacity={0.5}>
                        ({reviews})
                    </Text>
                </Flex>
            </Card.Body>
        </Card.Root>
    );
};

export default CustomCard;
