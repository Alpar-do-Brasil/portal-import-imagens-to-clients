import axios from "axios";
import * as https from "https";

const agent = new https.Agent({
  rejectUnauthorized: false,
});

export const api = axios.create({
  baseURL: "http://localhost:3333",
  httpsAgent: agent,
});
