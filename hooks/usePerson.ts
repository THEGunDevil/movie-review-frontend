import { Person } from "@/models/movie";
import { ErrorResponse } from "@/models/user";
import axios, { AxiosError } from "axios";
import { useCallback, useState } from "react";

export default function usePerson() {
  const [personData, setPersonData] = useState<{
    data: Person | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchPerson = useCallback(async (id: number) => {
    setPersonData((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));
    try {
      const response = await axios.get<Person>(
        `${process.env.NEXT_PUBLIC_API_URL}/movies/movie/person/${id}`,
      );
      setPersonData({
        data: response.data,
        loading: false,
        error: null,
      });
    } catch (err) {
      const axiosErr = err as AxiosError<ErrorResponse>;
      const message =
        axiosErr.response?.data?.message ??
        axiosErr.message ??
        "Something went wrong";

      setPersonData({
        data: null,
        loading: false,
        error: message,
      });
    }
  }, []);
  const refetchPerson = useCallback(
    (id: number) => {
      fetchPerson(id);
    },
    [fetchPerson],
  );
  return { personData, fetchPerson, refetchPerson };
}
