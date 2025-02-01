import axios from "axios";
import { Article } from "@patorikkuuu/eraiyomi-types";

import { baseURL } from "../config";
import httpResLog from "@/loggers/httpResLog";

const getArticles = async (
  queryParams: {
    sort: "newest" | "oldest" | "popular" | "unpopular";
    status?: "unpublished" | "published";
    search?: string;
  },
  reqCache: "default" | "no-store" | "reload" | "no-cache" | "force-cache" | "only-if-cached" = "default"
) => {
  let dataRes = null;
  let status = "";

  const params = new URLSearchParams();

  // Add 'sort' parameter.
  if (queryParams.sort) {
    params.append("sort", queryParams.sort);
  }

  // Add 'status' parameter only if it's defined.
  if (queryParams.status !== undefined) {
    params.append("status", queryParams.status);
  }

  // Add 'search' parameter if it's defined.
  if (queryParams.search !== undefined) {
    params.append("search", queryParams.search);
  }

  try {
    const res = await axios.get(`${baseURL}/articles`, {
      params, // Automatically appends query parameters
      headers: {
        'Cache-Control': reqCache // Equivalent to request cache
      }
    });

    // Axios automatically parses JSON, so no need to check content-type
    dataRes = res.data;
    status = `${res.status} ${res.statusText}`;

    httpResLog.ok(res.config.method, res.config.url,status)

  } catch (err) {
    // If error response is available (non-2xx), it will be caught here
    if (axios.isAxiosError(err) && err.response) {
      status = `${err.response.status} ${err.response.statusText}`;
      httpResLog.err(err.response.config.method,err.response.config.url,status)

      console.error(err.message)

      return {
        status,
        msg: err.response.data?.message || 'An error occurred',
        data: err.response.data
      };
    }

    // Handle other errors (network, etc.)
    console.error(err);
    return {
      status,
      msg: err,
      data: dataRes
    };
  }

  return {
    status,
    msg: "",
    data: dataRes as Article[]
  };
};

export default getArticles;
