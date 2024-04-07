import { useState } from "react";

export default function useSetDoc({ mutationFn, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  async function mutate({
    stocksMode: collection,
    formattedDateForDatabase: id,
    data,
  }) {
    try {
      setIsLoading(true);
      setError(false);
      await mutationFn({ collection, id, data });
      setError(false);
      onSuccess();
    } catch (error) {
      console.log(error);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    isLoading,
    error,
    mutate,
  };
}
