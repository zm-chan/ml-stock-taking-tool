import { add, format } from "date-fns";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import StocksTable from "@/components/StocksTable";
import { ArrowUpFromLine } from "lucide-react";

import useSetDoc from "@/hooks/useSetDoc";
import useFetchDoc from "@/hooks/useFetchDoc";
import { getProducts, setProducts } from "@/services/apiFirebase";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase";

function Home() {
  const [currentDateState, setCurrentDateState] = useState(new Date());
  const dateString = currentDateState.toDateString();
  const formattedDate = format(currentDateState, "MMMM yyyy");
  const formattedDateForDatabase = formattedDate
    .toLowerCase()
    .split(" ")
    .join("-");

  const [stocksMode, setStocksMode] = useState("retail");
  const {
    data,
    isLoading: isFetchingLoading,
    error: isFetchingError,
    setData,
    setRefetch,
  } = useFetchDoc({ getProducts, stocksMode, dateString });
  const {
    mutate,
    isLoading: isSettingLoading,
    error: isSettingError,
  } = useSetDoc({
    mutationFn: setProducts,
    onSuccess: () => setRefetch((prev) => !prev),
  });

  useEffect(() => {
    function handleBeforeUnload(event) {
      event.preventDefault();
      if (event) {
        event.returnValue = "";
      }
      return "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  function calculateMonth(date, monthOperationValue) {
    return add(date, { months: monthOperationValue });
  }

  function updateMonth(updateMonthValue) {
    if (window.confirm("Have you saved the data before changing month?")) {
      setCurrentDateState((previousDateState) => {
        return calculateMonth(previousDateState, updateMonthValue);
      });
    }
  }

  function updateStocksMode() {
    if (window.confirm("Have you saved the data before changing stock mode?")) {
      setStocksMode((previousStocksMode) => {
        if (previousStocksMode === "retail") {
          return "saloon";
        } else {
          return "retail";
        }
      });
    }
  }

  async function handleSaveData(data) {
    // console.log(stocksMode, data, formattedDateForDatabase);
    // console.log(currentDateState.toDateString());

    mutate({ stocksMode, currentDateState, data });
  }

  function handleLogout() {
    signOut(auth);
  }

  let tableContent;

  if (isFetchingLoading) {
    tableContent = <p>Loading...</p>;
  }

  if (isFetchingError) {
    tableContent = <p className="text-red-600">Error fetching data</p>;
  }

  if (data.length === 0 || data.length > 0) {
    tableContent = (
      <StocksTable
        key={`${stocksMode}-${formattedDateForDatabase}`}
        stocksMode={stocksMode}
        handleSaveData={handleSaveData}
        stockColumnsData={data}
        setStockColumnsData={setData}
      />
    );
  }

  return (
    <>
      <div className="mt-3 flex flex-col gap-y-3 sm:mt-5 sm:flex-row sm:items-center sm:gap-x-8 sm:gap-y-0 lg:gap-x-12 lg:text-lg xl:mt-8">
        <h2>
          LIST OF CLOSING STOCK FOR THE MONTH ENDED -{" "}
          <span className="uppercase underline">{formattedDate}</span>
        </h2>
        <Button
          variant="destructive"
          onClick={handleLogout}
          className="px-6 py-4 lg:text-lg"
        >
          Logout
        </Button>
      </div>
      <div className="mt-8 flex flex-col items-center gap-2 sm:flex-row sm:gap-8">
        <div className="flex gap-4 lg:gap-8">
          <Button onClick={updateStocksMode} className="uppercase lg:text-lg">
            {stocksMode === "retail" ? "saloon" : "retail"}
          </Button>
          <Button
            variant="secondary"
            onClick={() => updateMonth(-1)}
            className="uppercase lg:text-lg"
          >
            {format(calculateMonth(currentDateState, -1), "MMMM")}
          </Button>
          <Button
            variant="secondary"
            onClick={() => updateMonth(+1)}
            className="uppercase lg:text-lg"
          >
            {format(calculateMonth(currentDateState, +1), "MMMM")}
          </Button>
        </div>
        {isSettingLoading && (
          <p className=" lg:text-lg">Updating the data to database...</p>
        )}
        {isSettingError && (
          <p className="text-red-600 lg:text-lg">
            Fail to save data to database
          </p>
        )}
      </div>
      <button
        className="fixed bottom-4 right-4 z-10 border-2 border-slate-800 p-1 md:bottom-6 md:right-6 md:p-2"
        onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}
      >
        <ArrowUpFromLine />
      </button>
      {tableContent}
    </>
  );
}

export default Home;
