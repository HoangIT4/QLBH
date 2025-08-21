import axiosClient from "./axiosClient.js";

export const getProducts = () => axiosClient.get('/products');
