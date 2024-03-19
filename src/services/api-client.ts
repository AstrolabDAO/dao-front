import { TokenBearing } from "../models/enums";
import { IHttpMessage, IHttpRequest } from "../models/types";
import { session } from "../store";
import { HttpClient } from "./http-client";

// Determines the method of token bearing for the request
const autoTokenBearing = (): TokenBearing =>
  session.api.token.value && session.api.token.expiry * 1000 > Date.now()
    ? TokenBearing.HEADER
    : TokenBearing.NONE;

// Renews the API token if it is found in the response
const renewTokenIfRequired = (res: IHttpMessage): void => {
  const token = res.headers?.["authorization"] ?? res.body.data?.token;
  if (token) {
    session.api.token.set(token);
    console.log("API token renewed");
  }
};

// A generic function to make HTTP requests
async function req(
  method: "get" | "post" | "del",
  url: string,
  body: any = null,
  tokenBearing: TokenBearing = autoTokenBearing()
): Promise<any> {
  try {
    const options: IHttpRequest = { url, ...(body && { body }), tokenBearing };
    const res = await HttpClient[method](options);
    renewTokenIfRequired(res);
    return res.body.data;
  } catch (e: any) {
    console.warn(e);
  }
}

// API client object with methods for get, post, and delete requests
export const ApiClient = {
  get: (url: string, tokenBearing?: TokenBearing) =>
    req("get", url, null, tokenBearing),
  post: (url: string, body: any, tokenBearing?: TokenBearing) =>
    req("post", url, body, tokenBearing),
  del: (url: string, body: any, tokenBearing?: TokenBearing) =>
    req("del", url, body, tokenBearing),
  // Other HTTP methods like patch, update, etc., can be similarly added if needed
};
