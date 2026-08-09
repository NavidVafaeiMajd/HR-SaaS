// MyDatePicker.jsx
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { Input } from "../ui/input";
interface DatePickerProps {
   value: Date | null;
   onChange: (date: Date | null) => void;
   placeholder?: string;
   onlyMonthPicker ?: boolean
}
const CuDatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "تاریخ",
  onlyMonthPicker = false,
}) => {
  return (
    <DatePicker
      value={value ? new Date(value) : ""}
      onChange={(date: any) => {
        if (!date?.isValid) {
          onChange(null);
          return;
        }

        onChange(date.toDate());
      }}
      onlyMonthPicker={onlyMonthPicker}
      format={onlyMonthPicker ? "MMMM YYYY" : "YYYY/MM/DD"}
      calendar={persian}
      locale={persian_fa}
      calendarPosition="bottom-right"
      placeholder={placeholder}
      render={(value, openCalendar) => (
        <Input
          value={value}
          onClick={openCalendar}
          className="min-h-12 cursor-pointer"
          readOnly
        />
      )}
    />
  );
};
export default CuDatePicker;
