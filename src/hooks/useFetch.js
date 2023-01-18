import { useState, useEffect } from "react";
import Axios from "axios";

const useFetch = (url, options) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  async function fetchData() {
    try {
      setIsLoading(true);
      const response = await Axios(url, { ...options, withCredentials: true });
      setIsLoading(false);
      setData(response.data);
    } catch (err) {
      setIsLoading(false);
      setError(err);
    }
  }

  useEffect(() => { fetchData(); }, [url]);
  return { isLoading, data, error };
};

export default useFetch;
