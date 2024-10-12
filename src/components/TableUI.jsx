import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRef, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

function TableUI({
  data,
  columns,
  stockColumnsData,
  handleDeleteColumn,
  handleEditColumn,
  handlePagination,
}) {
  const [columnFilters, setColumnFilters] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");
  const timeoutRef = useRef(null);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters: columnFilters,
    },
    meta: {
      updateData: (rowIndex, columnId, value) => {
        handleEditColumn(rowIndex, columnId, value);
      },
    },
  });

  function handleInputChange(event) {
    setSearchFilter(event.target.value);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const newTimeout = setTimeout(() => {
      table.getColumn("stockName")?.setFilterValue(event.target.value);
    }, 500);

    timeoutRef.current = newTimeout;
  }

  return (
    <>
      <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:gap-6 lg:gap-8">
        <Input
          placeholder="Filter stocks..."
          value={searchFilter}
          onChange={handleInputChange}
          className="max-w-sm sm:h-10 lg:text-lg"
        />

        <Button
          type="secondary"
          onClick={() => handlePagination(-1)}
          className="lg:text-lg"
        >
          Previous Page
        </Button>
        <Button
          type="secondary"
          onClick={() => handlePagination(1)}
          className="lg:text-lg"
        >
          Next Page
        </Button>
      </div>
      <Table className="my-8 lg:text-lg">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => {
            return (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, i) => {
                  let textColor = "text-red-600";

                  if (
                    i === 0 ||
                    stockColumnsData[i - 1]?.columnPurpose === 4 ||
                    stockColumnsData[i - 1]?.columnPurpose === 5
                  ) {
                    textColor = "text-slate-950";
                  } else if (stockColumnsData[i - 1]?.columnPurpose === 2) {
                    textColor = "text-blue-600";
                  }

                  // console.log(header.id);

                  return (
                    <TableHead
                      key={header.id}
                      className={`text-center ${textColor}`}
                      onClick={() => handleDeleteColumn(i)}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            );
          })}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => {
            return (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell, i) => {
                  let textColor = "text-red-600";
                  let textAlign = "text-left";

                  if (
                    i === 0 ||
                    stockColumnsData[i - 1]?.columnPurpose === 4 ||
                    stockColumnsData[i - 1]?.columnPurpose === 5
                  ) {
                    textColor = "text-slate-950";
                  } else if (stockColumnsData[i - 1]?.columnPurpose === 2) {
                    textColor = "text-blue-600";
                  }

                  if (
                    stockColumnsData[i - 1]?.columnPurpose === 0 ||
                    stockColumnsData[i - 1]?.columnPurpose === 3 ||
                    stockColumnsData[i - 1]?.columnPurpose === 5
                  ) {
                    textAlign = "text-center";
                  }

                  return (
                    <TableCell
                      key={cell.id}
                      className={textColor + " " + textAlign + " capitalize"}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          {table.getFooterGroups().map((footerGroup) => {
            return (
              <TableRow key={footerGroup.id}>
                {footerGroup.headers.map((header, i) => {
                  let textColor = "text-red-600";

                  if (
                    i === 0 ||
                    stockColumnsData[i - 1]?.columnPurpose === 4 ||
                    stockColumnsData[i - 1]?.columnPurpose === 5
                  ) {
                    textColor = "text-slate-950";
                  } else if (stockColumnsData[i - 1]?.columnPurpose === 2) {
                    textColor = "text-blue-600";
                  }
                  return (
                    <TableCell
                      key={header.id}
                      className={`text-center capitalize ${textColor}`}
                    >
                      {flexRender(
                        header.column.columnDef?.footer,
                        header.getContext(),
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableFooter>
      </Table>
    </>
  );
}

export default TableUI;
