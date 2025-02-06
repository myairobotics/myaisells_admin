/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";

export function Select({ onValueChange, defaultValue, children }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    onValueChange(value);
    setIsOpen(false);
  };

  return (
    <div className='relative'>
      <button
        onClick={toggleDropdown}
        className='w-full py-2 px-4 bg-white text-black text-start border rounded-lg shadow-sm focus:outline-none'
      >
        {selectedValue}
      </button>

      {isOpen && (
        <div className='absolute left-0 z-20 mt-1 w-full bg-white text-black border rounded-lg shadow-lg'>
          <ul>
            {React.Children.map(children, (child: any) => {
              return React.cloneElement(child, {
                onClick: () => handleSelect(child.props.value),
              });
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export function SelectItem({ children, onClick }: any) {
  return (
    <li
      onClick={onClick}
      className='py-2 px-4 cursor-pointer hover:bg-gray-200'
    >
      {children}
    </li>
  );
}
