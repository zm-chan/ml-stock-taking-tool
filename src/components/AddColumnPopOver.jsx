import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { stockPurposes } from "@/data/stockData";
import { useState } from "react";

export default function AddColumnPopOver({ handleAddColumn }) {
  const [columnPurpose, setColumnPurpose] = useState(0);
  const [openPopover, setOpenPopover] = useState(false);

  function handleFormSubmit(event) {
    event.preventDefault();
    const isCancelButton =
      event.currentTarget.classList.contains("bg-background");

    if (isCancelButton) return setOpenPopover(false);

    const formData = new FormData(event.target);
    const newColumnDetails = {
      date: formData.get("date"),
      columnPurpose: columnPurpose,
      columnDetail: formData.has("customerDetail")
        ? formData.get("customerDetail")
        : stockPurposes[columnPurpose],
    };

    handleAddColumn(newColumnDetails);
    setOpenPopover(false);
  }

  return (
    <Popover open={openPopover} onOpenChange={setOpenPopover}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="lg:text-lg">
          Add New Column
        </Button>
      </PopoverTrigger>
      <PopoverContent className="sm:w-96 lg:w-[448px]" align="start">
        <div>
          <h4 className="font-medium leading-none lg:text-lg">
            Column Details
          </h4>
        </div>
        <form onSubmit={handleFormSubmit} className="mt-4 grid gap-4 sm:gap-6">
          <div className="grid grid-cols-3 items-center gap-4">
            <Label className="lg:text-lg">Purpose</Label>
            <Select
              onValueChange={(value) =>
                setColumnPurpose(Number.parseInt(value))
              }
              value={columnPurpose}
            >
              <SelectTrigger className="col-span-2 h-8 sm:h-10 lg:text-lg">
                <SelectValue placeholder="Select a purpose" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {stockPurposes.map((stockPurpose, i) => {
                    return (
                      <SelectItem key={stockPurpose} value={i}>
                        {stockPurpose}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="date" className="lg:text-lg">
              Date
            </Label>
            <Input
              id="date"
              name="date"
              className="col-span-2 h-8 sm:h-10 lg:text-lg"
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="customerDetail" className="lg:text-lg">
              Customer Detail
            </Label>
            <Input
              id="customerDetail"
              name="customerDetail"
              disabled={columnPurpose === 2 ? false : true}
              className={`col-span-2 h-8 sm:h-10 lg:text-lg ${columnPurpose === 2 ? "" : "bg-slate-300"}`}
            />
          </div>

          <div className="flex items-center justify-end gap-4 lg:gap-6">
            <Button
              variant="outline"
              onClick={handleFormSubmit}
              className="lg:text-lg"
            >
              Cancel
            </Button>
            <Button type="submit" className="lg:text-lg">
              Confirm
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
