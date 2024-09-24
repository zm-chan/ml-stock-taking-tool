import { useState } from "react";
import AddColumnDialog from "./AddColumnDialog";

import {
  retailProducts,
  saloonProducts,
  mockRetailColumns,
  mockSaloonColumns,
} from "@/data/stockData";
import TableUI from "./TableUI";
import EditableCell from "./EditableCell";
import { Button } from "./ui/button";
import { stockPurposes } from "@/data/stockData";

const allowedColumns = 5;

function StocksTable({
  stocksMode,
  handleSaveData,
  stockColumnsData,
  setStockColumnsData,
}) {
  // const [stockColumnsData, setStockColumnsData] = useState(
  //   stocksMode === "retail" ? mockRetailColumns : mockSaloonColumns,
  // );

  // const [stockColumnsData, setStockColumnsData] = useState([]);

  // console.log(stockColumnsData);

  const [page, setPage] = useState(1);

  const products = stocksMode === "retail" ? retailProducts : saloonProducts;

  // console.log(stockColumnsData);

  if (stockColumnsData.length === 0) {
    const clonedStockColumnsData = stockColumnsData.slice();
    clonedStockColumnsData.push(
      handleAddColumn({
        date: "First C/F",
        columnPurpose: 0,
        columnDetail: stockPurposes[0],
      }),
    );
    clonedStockColumnsData.push(
      handleAddColumn({
        date: "Last Stock Balance",
        columnPurpose: 3,
        columnDetail: stockPurposes[3],
      }),
    );
    clonedStockColumnsData.push(
      handleAddColumn({
        date: "Stock Check",
        columnPurpose: 4,
        columnDetail: stockPurposes[4],
      }),
    );
    clonedStockColumnsData.push(
      handleAddColumn({
        date: "Stock Diff",
        columnPurpose: 5,
        columnDetail: stockPurposes[5],
      }),
    );
    // console.log(clonedStockColumnsData);

    stockColumnsData.push(...clonedStockColumnsData);
  }

  // console.log(stockColumnsData);

  const totalPages =
    stockColumnsData.length % allowedColumns === 0
      ? stockColumnsData.length / allowedColumns
      : Math.floor(stockColumnsData.length / allowedColumns) + 1;

  const paginatedStockColumnData = stockColumnsData.slice(
    allowedColumns * (page - 1),
    allowedColumns * page,
  );

  // console.log(paginatedStockColumnData);

  function handlePagination(value) {
    setPage((previousPage) => {
      let updatedPage = previousPage + value;

      if (updatedPage > totalPages) {
        updatedPage = previousPage;
      }

      if (updatedPage < 1) {
        updatedPage = 1;
      }

      return updatedPage;
    });
  }

  const stockColumnsDataAdjustment = products.map((product, i) => {
    if (paginatedStockColumnData.length === 0) {
      return { stockName: product };
    }

    const extractColumnDateAndStockCount = Object.fromEntries(
      paginatedStockColumnData.map((stockColumnData) => {
        return [
          stockColumnData.date.split(" ").join("-") +
            "-" +
            stockColumnData.columnDetail.split(" ").join("-"),
          stockColumnData.stockCount[i],
        ];
      }),
    );
    return {
      stockName: product,
      ...extractColumnDateAndStockCount,
    };
  });

  // console.log(stockColumnsDataAdjustment.slice(0, 5));

  // Setup Columns
  let columns = [
    {
      header: "Stocks",
      accessorKey: "stockName",
    },
  ];

  if (paginatedStockColumnData.length !== 0) {
    const mapStockColumnsForDef = paginatedStockColumnData.map(
      (stockColumnData, i) => {
        // console.log(
        //   stockColumnData.date.split(" ").join("-") +
        //     "-" +
        //     stockColumnData.columnDetail.split(" ").join("-"),
        // );

        const columnObject = {
          header: stockColumnData.date,
          accessorKey:
            stockColumnData.date.split(" ").join("-") +
            "-" +
            stockColumnData.columnDetail.split(" ").join("-"),
          footer: stockColumnData.columnDetail,
        };

        // First C/F column, stock in, stock out, stock check must be input cell
        if (
          (stockColumnData.columnPurpose === 0 && i === 0) ||
          stockColumnData.columnPurpose === 1 ||
          stockColumnData.columnPurpose === 2 ||
          stockColumnData.columnPurpose === 4
        ) {
          return {
            ...columnObject,
            cell: EditableCell,
          };
        } else {
          return columnObject;
        }
      },
    );

    columns = columns.concat(mapStockColumnsForDef);
  }

  // console.log(columns);

  function updateColumnsAfterAddingOrDeleting(
    stockColumnsDataBeforeCalculatingLast3Columns,
  ) {
    const filteredStockBalanceIndex =
      stockColumnsDataBeforeCalculatingLast3Columns.reduce(
        (previous, current, index) => {
          // Skip the last cash balance
          if (
            index ===
            stockColumnsDataBeforeCalculatingLast3Columns.length - 3
          ) {
            return previous;
          }

          if (current.columnPurpose === 3) {
            return [...previous, index];
          }

          return previous;
        },
        [],
      );

    const filteredStockCFIndex =
      stockColumnsDataBeforeCalculatingLast3Columns.reduce(
        (previous, current, index) => {
          if (current.columnPurpose === 0) {
            return [...previous, index];
          }

          return previous;
        },
        [],
      );

    // console.log(filteredStockBalanceIndex, filteredStockCFIndex);

    const orderedIndexes = filteredStockBalanceIndex
      .concat(filteredStockCFIndex)
      .sort((a, b) => a - b);

    // console.log(orderedIndexes);

    const lastCashBalanceColumn =
      stockColumnsDataBeforeCalculatingLast3Columns.at(-3);
    const stockCheckColumn =
      stockColumnsDataBeforeCalculatingLast3Columns.at(-2);
    const stockDiffColumn =
      stockColumnsDataBeforeCalculatingLast3Columns.at(-1);

    lastCashBalanceColumn.stockCount =
      stockColumnsDataBeforeCalculatingLast3Columns
        .slice(
          orderedIndexes.at(-1),
          stockColumnsDataBeforeCalculatingLast3Columns.length - 3,
        )
        .reduce((previous, current) => {
          if (previous.length === 0) {
            return [...current.stockCount];
          }

          return previous.map((count, index) => {
            if (current.columnPurpose === 2) {
              return count - current.stockCount[index];
            }
            return count + current.stockCount[index];
          });
        }, []);

    stockDiffColumn.stockCount = stockCheckColumn.stockCount.map(
      (count, index) => {
        return count - lastCashBalanceColumn.stockCount[index];
      },
    );

    const newStockColumnsData = stockColumnsDataBeforeCalculatingLast3Columns;

    [
      ...stockColumnsDataBeforeCalculatingLast3Columns.slice(
        0,
        stockColumnsDataBeforeCalculatingLast3Columns.length - 3,
      ),
      lastCashBalanceColumn,
      stockCheckColumn,
      stockDiffColumn,
    ];

    return newStockColumnsData;
  }

  function handleAddColumn(newColumnDetails) {
    const filteredStockBalanceIndex = stockColumnsData.reduce(
      (previous, current, index) => {
        // Skip the last cash balance
        if (index === stockColumnsData.length - 3) {
          return previous;
        }

        if (current.columnPurpose === 3) {
          return [...previous, index];
        }

        return previous;
      },
      [],
    );

    const filteredStockCFIndex = stockColumnsData.reduce(
      (previous, current, index) => {
        if (current.columnPurpose === 0) {
          return [...previous, index];
        }

        return previous;
      },
      [],
    );

    // console.log(filteredStockBalanceIndex, filteredStockCFIndex);

    const orderedIndexes = filteredStockBalanceIndex
      .concat(filteredStockCFIndex)
      .sort((a, b) => a - b);

    // console.log(orderedIndexes);

    // Column Purpose 3 & 4 & 5 (stock balance, stock check & stock diff) is only true for adding first time.
    if (
      (stockColumnsData.length === 0 && newColumnDetails.columnPurpose === 0) ||
      newColumnDetails.columnPurpose === 1 ||
      newColumnDetails.columnPurpose === 2 ||
      (stockColumnsData.length === 0 && newColumnDetails.columnPurpose === 3) ||
      newColumnDetails.columnPurpose === 4 ||
      newColumnDetails.columnPurpose === 5
    ) {
      newColumnDetails.stockCount = Array.from(
        { length: products.length },
        () => 0,
      );

      // If there's empty data in that month, then we just return column details for setting up the 4 initial columns
      if (stockColumnsData.length === 0) {
        return newColumnDetails;
      }

      // else we add the in stock and out stock column without any further calculation because their value will be 0 initially
      setStockColumnsData((prevStockColumnsData) => {
        return [
          ...prevStockColumnsData.slice(0, prevStockColumnsData.length - 3),
          newColumnDetails,
          ...prevStockColumnsData.slice(prevStockColumnsData.length - 3),
        ];
      });
    } else if (newColumnDetails.columnPurpose === 0) {
      // Only last stock balance
      // if (filteredStockBalanceIndex.length === 0) {
      //   return;
      // }

      // Alternative to code above: Make sure there's always enough cash balance before adding c/f
      if (filteredStockCFIndex.length > filteredStockBalanceIndex.length) {
        return;
      }

      const latestStockBalanceIndex = filteredStockBalanceIndex.at(-1);

      newColumnDetails.stockCount = [
        ...stockColumnsData[latestStockBalanceIndex].stockCount,
      ];

      // We only need to re-calculate the last 3 columns because only these 3 columns are affected when adding or deleting
      setStockColumnsData((prevStockColumnsData) => {
        const stockColumnsDataBeforeCalculatingLast3Columns = [
          ...prevStockColumnsData.slice(0, prevStockColumnsData.length - 3),
          newColumnDetails,
          ...prevStockColumnsData.slice(prevStockColumnsData.length - 3),
        ];

        return updateColumnsAfterAddingOrDeleting(
          stockColumnsDataBeforeCalculatingLast3Columns,
        );
      });
    } else if (newColumnDetails.columnPurpose === 3) {
      newColumnDetails.stockCount = stockColumnsData
        .slice(orderedIndexes.at(-1), stockColumnsData.length - 3)
        .reduce((previous, current) => {
          if (previous.length === 0) {
            return [...current.stockCount];
          }

          return previous.map((count, index) => {
            if (current.columnPurpose === 2) {
              return count - current.stockCount[index];
            }
            return count + current.stockCount[index];
          });
        }, []);

      setStockColumnsData((prevStockColumnsData) => {
        const stockColumnsDataBeforeCalculatingLast3Columns = [
          ...prevStockColumnsData.slice(0, prevStockColumnsData.length - 3),
          newColumnDetails,
          ...prevStockColumnsData.slice(prevStockColumnsData.length - 3),
        ];

        return updateColumnsAfterAddingOrDeleting(
          stockColumnsDataBeforeCalculatingLast3Columns,
        );
      });
    }
  }

  function handleDeleteColumn(columnIndex) {
    // last 3 items's condition we add 1 because stockColumnData doesn't include product column
    if (
      columnIndex === 0 ||
      (page === 1 && columnIndex === 1) ||
      columnIndex >= stockColumnsData.length + 1 - 3
    ) {
      // console.log(columnIndex, stockColumnsData.length);
      return;
    }

    const adjustedColumnIndex = (page - 1) * allowedColumns + columnIndex;

    // console.log(adjustedColumnIndex);

    const columnIndexInStockColumnsData = adjustedColumnIndex - 1;

    // console.log(columnIndexInStockColumnsData);

    setStockColumnsData((prevStockColumnsData) => {
      const stockColumnsDataBeforeCalculatingLast3Columns = [
        ...prevStockColumnsData.slice(0, columnIndexInStockColumnsData),
        ...prevStockColumnsData.slice(prevStockColumnsData.length - 3),
      ];

      return updateColumnsAfterAddingOrDeleting(
        stockColumnsDataBeforeCalculatingLast3Columns,
      );
    });
  }

  function handleEditColumn(rowIndex, columnId, value) {
    setStockColumnsData((prevStockColumnsData) => {
      const editIndex = prevStockColumnsData.findIndex(
        (prevStockColumnData) => {
          return (
            prevStockColumnData.date.split(" ").join("-") +
              "-" +
              prevStockColumnData.columnDetail.split(" ").join("-") ===
            columnId
          );
        },
      );

      const newStockColumnsData = prevStockColumnsData.map(
        (prevStockColumnData, i) => {
          if (i === editIndex) {
            prevStockColumnData.stockCount[rowIndex] = Number.parseInt(value);
          }

          return prevStockColumnData;
        },
      );

      // For that current row, update all the values of stock balance, stock c/f, stock diff
      const filteredStockBalanceIndex = newStockColumnsData
        .reduce((previous, current, index) => {
          if (current.columnPurpose === 3) {
            return [...previous, index];
          }

          return previous;
        }, [])
        .map((index) => {
          return {
            index,
            columnPurpose: stockColumnsData[index].columnPurpose,
          };
        });

      const filteredStockCFIndex = newStockColumnsData
        .reduce((previous, current, index) => {
          if (current.columnPurpose === 0) {
            return [...previous, index];
          }

          return previous;
        }, [])
        .map((index) => {
          return {
            index,
            columnPurpose: stockColumnsData[index].columnPurpose,
          };
        });

      // console.log(filteredStockBalanceIndex, filteredStockCFIndex);

      const orderedIndexes = filteredStockBalanceIndex
        .concat(filteredStockCFIndex)
        .sort((a, b) => {
          return a.index - b.index;
        });

      // console.log(orderedIndexes);

      const indexesAfterEditIndex = [
        orderedIndexes
          .filter((index) => {
            return index.index <= editIndex;
          })
          .at(-1),
        ...orderedIndexes.filter((index) => {
          return index.index > editIndex;
        }),
      ];

      // console.log(editIndex);
      // console.log(indexesAfterEditIndex);

      indexesAfterEditIndex.forEach((index, i) => {
        // first column is always stock c/f, so ignore
        // And also because the 1st column index is the last column index of the column indexes that are before the editing column index, and it is used as the starting column index for calculation of 2nd column index. We don't need to do calculation for the 1st column index
        if (i === 0) {
          return;
        }

        if (index.columnPurpose === 0) {
          newStockColumnsData[index.index].stockCount[rowIndex] =
            newStockColumnsData[indexesAfterEditIndex[i - 1].index].stockCount[
              rowIndex
            ];
        }

        if (index.columnPurpose === 3) {
          newStockColumnsData[index.index].stockCount[rowIndex] =
            newStockColumnsData
              .slice(indexesAfterEditIndex[i - 1].index, index.index)
              .reduce((previous, current) => {
                if (current.columnPurpose === 2) {
                  return previous - current.stockCount[rowIndex];
                }

                return previous + current.stockCount[rowIndex];
              }, 0);
        }
      });

      const filteredStockCheckIndex = stockColumnsData.findIndex(
        (stockColumnData) => {
          return stockColumnData.columnPurpose === 4;
        },
      );
      const filteredStockDiffIndex = stockColumnsData.findIndex(
        (stockColumnData) => {
          return stockColumnData.columnPurpose === 5;
        },
      );

      // console.log(filteredStockCheckIndex, filteredStockDiffIndex);

      let startingColumnIndex = 0;

      startingColumnIndex =
        filteredStockBalanceIndex[filteredStockBalanceIndex.length - 1];

      // startingColumnIndex, stockCheckIndex, stockDiffIndex
      newStockColumnsData[filteredStockDiffIndex].stockCount[rowIndex] =
        newStockColumnsData[filteredStockCheckIndex].stockCount[rowIndex] -
        newStockColumnsData[startingColumnIndex.index].stockCount[rowIndex];

      return newStockColumnsData;
    });
  }

  function handleSaveColumn() {
    // const stockColumnsDataForDatabase = stockColumnsData.filter(
    //   (stockColumnData) => {
    //     return (
    //       stockColumnData.columnPurpose !== 4 &&
    //       stockColumnData.columnPurpose !== 5
    //     );
    //   },
    // );

    // handleSaveData(stockColumnsDataForDatabase);
    handleSaveData(stockColumnsData);
  }

  // console.log(stockColumnsDataAdjustment);
  // console.log(columns);
  // console.log(paginatedStockColumnData);

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-3 text-center sm:flex-row sm:items-center sm:gap-6 lg:gap-8 lg:text-lg">
        <h3 className="font-semibold uppercase">{stocksMode}</h3>
        <AddColumnDialog handleAddColumn={handleAddColumn} />
        <Button onClick={handleSaveColumn} className="lg:text-lg">
          Save Data
        </Button>
      </div>

      <TableUI
        key={Math.random().toString(36).substring(2, 8)}
        data={stockColumnsDataAdjustment}
        columns={columns}
        stockColumnsData={paginatedStockColumnData}
        handleDeleteColumn={handleDeleteColumn}
        handleEditColumn={handleEditColumn}
        handlePagination={handlePagination}
      />
    </div>
  );
}

export default StocksTable;
