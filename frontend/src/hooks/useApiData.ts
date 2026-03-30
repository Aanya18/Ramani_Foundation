import { useEffect, useState } from "react";
import { apiGet } from "../lib/api";

type ApiDataState<T> = {
  data: T;
  loading: boolean;
  error: string | null;
  reload: () => void;
};

export function useApiData<T>(path: string, initialData: T): ApiDataState<T> {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const result = await apiGet<T>(path);

        if (active) {
          setData(result);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load data.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [path, version]);

  return {
    data,
    loading,
    error,
    reload: () => setVersion((current) => current + 1),
  };
}
