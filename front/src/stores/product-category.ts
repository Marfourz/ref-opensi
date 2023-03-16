import { defineStore } from "pinia";
import Api from "../api";
import { PrimaryKey } from "../types/interfaces";

export const useProductCategoryStore = defineStore("productCategoryStore", {
  actions: {
    async fetchOne(id: number) {
      try {
        const response = await Api.get(`product-category/${id}`);
        return response.data;
      } catch (error) {}
    },

    async fetchAll(query?: any) {
      try {
        const response = await Api.get("product-category", { params: query });
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async fetchProducts(query: any, id: PrimaryKey) {
      try {
        const response = await Api.get(`product-category/${id}/products`, {
          params: query,
        });
        console.log("fetchProducts", response.data);

        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async create(data: any) {
      try {
        const response = await Api.post("product-category", data);
        return response;
      } catch (error) {
        throw error;
      }
    },

    async update(id: number, data: any) {
      try {
        const response = await Api.put(`product-category/${id}`, data);
        return response;
      } catch (error) {
        throw error;
      }
    },

    async delete(id: number) {
      try {
        const response = await Api.delete(`product-category/${id}`);
        return response;
      } catch (error) {
        throw error;
      }
    },
  },
});
