import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Data } from "pages/api/todos";
import { REDUCER_NAME } from "store/todo_board/utils";
import { HYDRATE } from "next-redux-wrapper";

const isBrowser = process.browser;
const isProduction = process.env.NODE_ENV === "production";
const vercelURL = process.env.VERCEL_URL;

const getBaseUrl = () => {
  if (isProduction) {
    if (vercelURL) {
      return `https://${vercelURL}/api`;
    }
  }

  if (isBrowser) {
    return "/api";
  }

  return `http://localhost:3000/api`;
};

export const todoBoardApi = createApi({
  reducerPath: `${REDUCER_NAME}Api`,
  baseQuery: fetchBaseQuery({ baseUrl: getBaseUrl() }),
  tagTypes: [],
  endpoints: (builder) => ({
    getTodos: builder.query<Data["todos"][], { page: number; limit: number }>({
      query: ({ page, limit }) => `todos?skip=${page * limit}&limit=${limit}`,
    }),
  }),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
});

export const {
  useGetTodosQuery,
  util: { getRunningOperationPromises, prefetch },
} = todoBoardApi;

export const { getTodos } = todoBoardApi.endpoints;
