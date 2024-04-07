import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { stockPurposes } from "@/data/stockData";
import { useState } from "react";

export default function AddColumnDialog({ handleAddColumn }) {
  const [columnPurpose, setColumnPurpose] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);

  function handleFormSubmit(event) {
    event.preventDefault();
    const isCancelButton =
      event.currentTarget.classList.contains("bg-background");

    if (isCancelButton) return setOpenDialog(false);

    const formData = new FormData(event.target);
    const newColumnDetails = {
      date: formData.get("date"),
      columnPurpose: columnPurpose,
      columnDetail: formData.has("customerDetail")
        ? formData.get("customerDetail")
        : stockPurposes[columnPurpose],
    };

    handleAddColumn(newColumnDetails);
    setOpenDialog(false);
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant="outline" className="lg:text-lg">
          Add New Column
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] lg:max-w-lg">
        <DialogHeader>
          <DialogTitle className="lg:text-2xl">Column Details</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleFormSubmit} className="grid gap-4 lg:py-4">
          <div className="grid grid-cols-4 items-center gap-4 sm:grid-cols-3">
            <Label className="lg:text-lg">Purpose</Label>
            <Select
              onValueChange={(value) =>
                setColumnPurpose(Number.parseInt(value))
              }
              value={columnPurpose}
            >
              <SelectTrigger className="col-span-3 h-8 sm:col-span-2 sm:h-10 lg:text-lg">
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
          <div className="grid grid-cols-4 items-center gap-4 sm:grid-cols-3">
            <Label htmlFor="date" className="lg:text-lg">
              Date
            </Label>
            <Input
              id="date"
              name="date"
              className="col-span-3 h-8 sm:col-span-2 sm:h-10 lg:text-lg"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4 sm:grid-cols-3">
            <Label htmlFor="customerDetail" className="lg:text-lg">
              Customer Detail
            </Label>
            <Input
              id="customerDetail"
              name="customerDetail"
              disabled={columnPurpose === 2 ? false : true}
              className={`col-span-3 h-8 sm:col-span-2 sm:h-10 lg:text-lg ${
                columnPurpose === 2 ? "" : "bg-slate-300"
              }`}
            />
          </div>
          <DialogFooter className="mt-2 gap-3">
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
