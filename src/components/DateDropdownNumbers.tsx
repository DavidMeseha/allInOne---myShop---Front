import Dropdown from "./DropDown";

const today = new Date();

const months = Array.from({ length: 12 }, (_, index) => ({
  name: (index + 1).toString(),
  value: (index + 1).toString()
}));

const years = Array.from({ length: 100 }, (_, index) => ({
  name: (today.getFullYear() - index).toString(),
  value: (today.getFullYear() - index).toString()
}));

export default function DateDropdownNumbers({
  day,
  month,
  year,
  changeDay,
  changeMonth,
  changeYear
}: {
  day: number;
  month: number;
  year: number;
  changeDay: (value: number) => void;
  changeMonth: (value: number) => void;
  changeYear: (value: number) => void;
}) {
  const days = Array.from(
    { length: month === 2 ? (year % 4 === 0 ? 29 : 28) : month % 2 === 0 ? 30 : 31 },
    (_, index) => ({ name: (index + 1).toString(), value: (index + 1).toString() })
  );
  return (
    <div className="flex w-full gap-4">
      <Dropdown
        className="w-1/4"
        dir="ltr"
        label="day"
        options={days}
        value={day}
        onChange={(e) => changeDay(parseInt(e.target.value))}
      />
      <Dropdown
        className="w-1/4"
        dir="ltr"
        label="month"
        options={months}
        value={month}
        onChange={(e) => changeMonth(parseInt(e.target.value))}
      />
      <Dropdown
        className="w-2/4"
        dir="ltr"
        label="year"
        options={years}
        value={year}
        onChange={(e) => changeYear(parseInt(e.target.value))}
      />
    </div>
  );
}
