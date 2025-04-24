import React, { createContext, useContext } from "react";
import { useRef, useState } from "react";
import Slider, { Settings } from "react-slick";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import clsx from "clsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./Pagination.module.scss";

interface PaginationContextProps {
    sliderRef: React.RefObject<Slider | null>;
    settings: Settings;
    currentSlide: number;
    pageNumber: number;
    isPrevDisabled: boolean;
    isNextDisabled: boolean;
    handleChangeSlide: (
        direction: "left" | "right",
        isDisabled: boolean
    ) => void;
}

const PaginationContext = createContext<PaginationContextProps | null>(null);

const usePaginationContext = () => {
    const context = useContext(PaginationContext);
    if (!context) {
        throw new Error(
            "usePaginationContext must be used within a Pagination component"
        );
    }
    return context;
};

interface PaginationProps extends Settings {
    totalSlides: number;
    children: React.ReactNode;
}

const Pagination = ({
    children,
    infinite = false,
    slidesToScroll = 1,
    rows = 1,
    slidesToShow = 4,
    responsive = [],
    ...SliderProps
}: PaginationProps) => {
    const sliderRef = useRef<Slider | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);

    const isPrevDisabled = !infinite && currentSlide === 0;
    const isNextDisabled = !infinite && currentSlide >= pageNumber - 1;
    const settings = {
        infinite,
        slidesToShow,
        slidesToScroll,
        rows,
        responsive,
        dots: true,
        arrows: false,
        appendDots: (dots: React.ReactNode) => {
            setPageNumber(React.Children.count(dots));
            return <ul style={{ display: "none" }}>{dots}</ul>;
        },
        afterChange: (index: number) => {
            setCurrentSlide(index);
        },
        ...SliderProps,
    };
    const handleChangeSlide = (
        direction: "left" | "right",
        isDisabled: boolean
    ) => {
        if (!sliderRef.current || isDisabled) return;

        if (direction === "left") {
            sliderRef.current.slickPrev();
        } else if (direction === "right") {
            sliderRef.current.slickNext();
        }
    };
    return (
        <PaginationContext.Provider
            value={{
                sliderRef,
                settings,
                currentSlide,
                pageNumber,
                isPrevDisabled,
                isNextDisabled,
                handleChangeSlide,
            }}
        >
            <div className={styles.slider__container}>{children}</div>
        </PaginationContext.Provider>
    );
};

const Title = ({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) => {
    return <div className={className}>{children}</div>;
};

const Arrows = () => {
    const { isPrevDisabled, isNextDisabled, handleChangeSlide } =
        usePaginationContext();

    return (
        <>
            <div
                className={clsx(styles.arrow, {
                    [styles.disabled]: isPrevDisabled,
                })}
                onClick={() => handleChangeSlide("left", isPrevDisabled)}
            >
                <FaArrowLeft />
            </div>
            <div
                className={clsx(styles.arrow, {
                    [styles.disabled]: isNextDisabled,
                })}
                onClick={() => handleChangeSlide("right", isNextDisabled)}
            >
                <FaArrowRight />
            </div>
        </>
    );
};

const CustomSlider = ({ children }: { children: React.ReactNode }) => {
    const { sliderRef } = usePaginationContext();
    const { settings } = usePaginationContext();

    return (
        <Slider ref={sliderRef} {...settings}>
            {children}
        </Slider>
    );
};

Pagination.Title = Title;
Pagination.Arrows = Arrows;
Pagination.Slider = CustomSlider;

export default Pagination;
