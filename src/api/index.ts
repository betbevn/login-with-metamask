import axios, { AxiosRequestHeaders } from "axios";
import { API_END_POINT } from "../utils/const";

const http = axios.create();

export const get = (
  requestPath: string,
  params?: any,
  headers?: AxiosRequestHeaders
) => {
  return http.get(API_END_POINT + requestPath, {
    params,
    headers,
  });
};
export const post = (requestPath: string, body?: any) => {
  return http.post(API_END_POINT + requestPath, body);
};
