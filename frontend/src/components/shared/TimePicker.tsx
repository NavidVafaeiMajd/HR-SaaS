import React, { useState } from "react";
import TimeKeeper from "react-timekeeper";

interface TimePickerProps {
  value?: string;
  onChange: (time: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const TimePicker: React.FC<TimePickerProps> = ({
  value = "",
  onChange,
  placeholder = "انتخاب زمان",
  disabled = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempTime, setTempTime] = useState(value || "12:00");

  const handleInputClick = () => {
    if (disabled) return;
    setTempTime(value || "12:00");
    setIsOpen(true);
  };

  const handleTimeSelect = () => {
    onChange(tempTime);
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const clearTime = () => {
    onChange("");
  };

  return (
    <div className="relative">
      <input
        type="text"
        readOnly
        value={value}
        onClick={handleInputClick}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full p-3 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"
        } ${className}`}
      />
      
      {value && (
        <button
          type="button"
          onClick={clearTime}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 text-red-500 text-xs bg-red-100 px-2 py-1 rounded hover:bg-red-200"
        >
          حذف
        </button>
      )}

      {isOpen && (
        <div className="absolute z-50 bg-white border border-gray-300 rounded-lg shadow-xl">
          <TimeKeeper
            time={tempTime}
            onChange={(data) => setTempTime(data.formatted24)}
            switchToMinuteOnHourSelect
          />
          <div className="flex justify-end p-3 gap-2 border-t">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={handleTimeSelect}
              type="button"
            >
              تأیید
            </button>
            <button
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              onClick={handleClose}
              type="button"
            >
              بستن
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimePicker;
