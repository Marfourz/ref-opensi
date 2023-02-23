import { defineStore } from "pinia";
import { IUser } from "@/types/interfaces";
import Api from "../api";
import product from "../data/product";

export const useProductStore = defineStore("productStore", {
  actions: {
    async fetchOne(id: number) {
      try {
        const response = await Api.get(`products/${id}`);
        return response.data;
      } catch (error) {}
    },

    async fetchAll(query: any) {
      try {
        const response = await Api.get("products", { params: query });
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async create(data: any) {
      try {
        const response = await Api.post("products", data);
        return response;
      } catch (error) {
        throw error;
      }
    },

    async update(id: number, data: any) {
      try {
        const response = await Api.patch(`products/${id}`, data);
        return response;
      } catch (error) {
        throw error;
      }
    },

    async delete(id: number) {
      try {
        const response = await Api.delete(`produts/${id}`);
        return response;
      } catch (error) {
        throw error;
      }
    },
  },
});
