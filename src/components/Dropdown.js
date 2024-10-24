import { useState, useEffect, useRef } from "react";
import styles from "../styles/Dropdown.module.css";

function Dropdown({ name, options, onChange, selectedOption }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const checkboxChange = (option) => {
    onChange(option);
  };

  return (
    <div className={styles.customDropdown} ref={dropdownRef}>
      <button className={styles.dropdownButton} onClick={toggleDropdown}>
        {name}
      </button>
      <div
        className={`${styles.dropdownContent} ${
          isOpen ? styles.show : styles.hidden
        }`}
      >
        {options.map((option, index) => (
          <label key={index} className={styles.dropdownOption}>
            <input
              type="checkbox"
              className={styles["custom-checkbox"]}
              onChange={() => checkboxChange(option)}
              checked={
                name === "Type"
                  ? selectedOption === option.label
                  : selectedOption.includes(option.label)
              }
            />
            <span className={styles.optionText}>{option.label}</span>
            <span className={styles.optionNumber}>{option.number}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default Dropdown;
