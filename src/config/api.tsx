import axios from "axios";
import { environments } from "./environments";

export default axios.create({
  baseURL: environments.api_url,
});
