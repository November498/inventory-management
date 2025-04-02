import React, { useState, useEffect } from "react";

const Dropdown = ({
  buttonContent,
  options,
  onSelect,
  dropdownClass,
  optionClass,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle dropdown visibility
  const toggleDropdown = () => setIsOpen(!isOpen);

  // Close dropdown when clicking outside
  const handleOutsideClick = (event) => {
    if (!event.target.closest("#dropdown-container")) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }

    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isOpen]);

  return (
    <div id="dropdown-container" className="relative inline-block text-left">
      {/* Button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 rounded border bg-white p-1 px-4 text-sm text-gray-500"
      >
        {buttonContent}
        <svg
          className="ml-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${dropdownClass}`}
        >
          <ul className="py-1">
            {options.map((option, index) => (
              <li
                key={index}
                className={`cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${optionClass}`}
                onClick={() => {
                  onSelect(option);
                  setIsOpen(false);
                }}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
