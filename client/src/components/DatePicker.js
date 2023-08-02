import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import useUsersContext from "../hooks/use-users-context";

function BasicDateRangePicker() {
  const { dateRange, setDateRange, setDate } = useUsersContext();
  const [startDate, endDate] = dateRange;

  if (!startDate && !endDate) {
    setDate("");
  }

  return (
    <div className="flex items-center">
      <label className="mb-0 mr-3">Fecha: </label>
      <DatePicker
        selectsRange={true}
        startDate={startDate}
        endDate={endDate}
        onChange={(update) => {
          setDateRange(update);
        }}
        placeholderText="07/18/2023 - 07/23/2023"
        isClearable={true}
        className="py-1 px-7 border border-gray-400 rounded-md"
      />
    </div>
  );
}

export default BasicDateRangePicker;
