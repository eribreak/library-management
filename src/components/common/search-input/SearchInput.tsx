import React, { useState, useEffect } from "react";
import styles from "./SearchInput.module.css";
import searchIcon from "../../../assets/images/images/svg/search-icon.svg";

interface SearchInputProps {
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    onSearch?: (value: string) => void;
    delay?: number;
}

const SearchInput: React.FC<SearchInputProps> = ({
    placeholder,
    value,
    onChange,
    onSearch,
}) => {
    const [inputValue, setInputValue] = useState(value || "");
    useEffect(() => {
        if (value !== undefined && value !== inputValue) {
            setInputValue(value);
        }
    }, [value, inputValue]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        onChange(newValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            if (onSearch) {
                onSearch(inputValue);
            }
        }
    };

    const handleClearSearch = () => {
        setInputValue("");
        onChange("");
        if (onSearch) {
            onSearch("");
        }
    };

    const handleSearchClick = () => {
        if (onSearch) {
            onSearch(inputValue);
        }
    };

    return (
        <div className={styles["search-input-container"]}>
            <div className={styles["search-input-wrapper"]}>
                <span
                    className={styles["search-icon"]}
                    onClick={handleSearchClick}
                    style={{ cursor: "pointer" }}
                >
                    <img src={searchIcon} alt="Search" />
                </span>
                <input
                    type="text"
                    className={styles["search-input"]}
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                />
                {inputValue && (
                    <button
                        className={styles["search-clear-button"]}
                        onClick={handleClearSearch}
                        aria-label="Clear search"
                    >
                        X
                    </button>
                )}
            </div>
        </div>
    );
};

export default SearchInput;
