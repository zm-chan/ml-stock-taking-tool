import { useState } from "react";
import { Input } from "./ui/input";

function EditableCell({ getValue, row, column, table }) {
  const [value, setValue] = useState(getValue());

  function handleOnBlur() {
    // console.log(row, column);
    table.options.meta?.updateData(row.index, column.id, value);
  }

  return (
    <Input
      type="number"
      value={value}
      className="w-9 lg:w-14 lg:text-lg"
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleOnBlur}
    />
  );
}

export default EditableCell;
