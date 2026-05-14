import axios from "axios";
import type { Product } from "../types/product";

const api = axios.create({
  baseURL: "https://dummyjson.com",
  timeout: 5000, // إضافة وقت انتظار لمنع التعليق
});

export const getProducts = async (): Promise<Product[]> => {
  try {
    const res = await api.get("/products?limit=10");
    // نضمن دائماً إعادة مصفوفة حتى لو كانت فارغة لتجنب خطأ .map()
    return res.data.products || [];
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return []; // إعادة مصفوفة فارغة في حالة الخطأ
  }
};

export const getProductById = async (
  id: number | string,
): Promise<Product | null> => {
  try {
    const res = await api.get(`/products/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Failed to fetch product with id ${id}:`, error);
    return null;
  }
};
