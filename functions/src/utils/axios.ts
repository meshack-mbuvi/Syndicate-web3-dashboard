import axios from "axios";

const circleAxios = axios.create({
  baseURL: process.env.BASE_CIRCLE_URL,
});
circleAxios.defaults.headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "Origin, X-Requested-With, Content-Type, Accept",
};
export default circleAxios;
