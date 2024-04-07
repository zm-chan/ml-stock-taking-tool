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

  const products = stocksMode === "retail" ? retailProducts : saloonProducts;

  const stockColumnsDataAdjustment = products.map((product, i) => {
    if (paginatedStockColumnData.length === 0) {
      return { stockName: product };
    }

    const extractColumnDateAndStockCount = Object.fromEntries(
      paginatedStockColumnData.map((stockColumnData) => {
        return [
          stockColumnData.date.split(" ").join("-"),
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
        const columnObject = {
          header: stockColumnData.date,
          accessorKey: stockColumnData.date.split(" ").join("-"),
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

  function handleAddColumn(newColumnDetails) {
    // console.log(newColumnDetails);

    if (stockColumnsData.length === 0 && newColumnDetails.columnPurpose !== 0) {
      return;
    }

    const filteredStockBalanceIndex = stockColumnsData.reduce(
      (previous, current, index) => {
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

    const orderedIndexes = filteredStockBalanceIndex
      .concat(filteredStockCFIndex)
      .sort();

    if (
      (stockColumnsData.length === 0 && newColumnDetails.columnPurpose === 0) ||
      newColumnDetails.columnPurpose === 1 ||
      newColumnDetails.columnPurpose === 2 ||
      newColumnDetails.columnPurpose === 4
    ) {
      newColumnDetails.stockCount = Array.from(
        { length: products.length },
        () => 0,
      );
    } else if (newColumnDetails.columnPurpose === 0) {
      if (filteredStockBalanceIndex.length === 0) {
        return;
      }

      const latestStockBalanceIndex = filteredStockBalanceIndex.at(-1);

      newColumnDetails.stockCount = [
        ...stockColumnsData[latestStockBalanceIndex].stockCount,
      ];
    } else if (newColumnDetails.columnPurpose === 3) {
      newColumnDetails.stockCount = stockColumnsData
        .slice(orderedIndexes.at(-1), stockColumnsData.length)
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
    } else if (newColumnDetails.columnPurpose === 5) {
      const filteredStockCheckIndex = stockColumnsData.findIndex(
        (stockColumnData) => {
          return stockColumnData.columnPurpose === 4;
        },
      );

      if (
        filteredStockCheckIndex === -1 ||
        filteredStockBalanceIndex.length === 0
      ) {
        return;
      }

      newColumnDetails.stockCount = stockColumnsData
        .slice(filteredStockBalanceIndex.at(-1))
        .reduce((previous, current) => {
          if (previous.length === 0) {
            return [...current.stockCount];
          }

          return previous.map((count, index) => {
            return current.stockCount[index] - count;
          });
        }, []);
    }

    setStockColumnsData((prevStockColumnsData) => {
      return [...prevStockColumnsData, newColumnDetails];
    });
  }

  function handleDeleteColumn(columnIndex) {
    if (columnIndex === 0) {
      return;
    }

    const columnIndexInStockColumnsData = columnIndex - 1;

    setStockColumnsData((prevStockColumnsData) => {
      const newStockColumnsData = prevStockColumnsData.slice(
        0,
        columnIndexInStockColumnsData,
      );

      return newStockColumnsData;
    });
  }

  function handleEditColumn(rowIndex, columnId, value) {
    setStockColumnsData((prevStockColumnsData) => {
      const editIndex = prevStockColumnsData.findIndex(
        (prevStockColumnData) => {
          return prevStockColumnData.date.split(" ").join("-") === columnId;
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

      indexesAfterEditIndex.forEach((index, i) => {
        // first column is always stock c/f, so ignore
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

      // If there's a stock check column and a stock diff column and at least a stock balance column
      if (
        filteredStockCheckIndex !== -1 &&
        filteredStockDiffIndex !== -1 &&
        filteredStockBalanceIndex.length !== 0
      ) {
        let startingColumnIndex = 0;

        startingColumnIndex =
          filteredStockBalanceIndex[filteredStockBalanceIndex.length - 1];

        // startingColumnIndex, stockCheckIndex, stockDiffIndex
        newStockColumnsData[filteredStockDiffIndex].stockCount[rowIndex] =
          newStockColumnsData[filteredStockCheckIndex].stockCount[rowIndex] -
          newStockColumnsData[startingColumnIndex.index].stockCount[rowIndex];
      }

      return newStockColumnsData;
    });
  }

  function handleSaveColumn() {
    const stockColumnsDataForDatabase = stockColumnsData.filter(
      (stockColumnData) => {
        return (
          stockColumnData.columnPurpose !== 4 &&
          stockColumnData.columnPurpose !== 5
        );
      },
    );

    handleSaveData(stockColumnsDataForDatabase);
  }

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
