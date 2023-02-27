import { defineStore } from "pinia";
import Api from "../api";
import { PrimaryKey } from "../types/interfaces";

export const useEnginesStore = defineStore("enginesStore", {
  actions: {
    async fetchOne(id: PrimaryKey) {
      try {
        const response = await Api.get(`engines/${id}`);
        return response.data;
      } catch (error) {}
    },

    async fetchAll(query?: any) {
      try {
        const response = await Api.get("engines", { params: query });
        return response.data;
      } catch (error) {
        throw error;
      }
    },


  
    async create(data: any) {
      try {
        const response = await Api.post("engines", data);
        return response;
      } catch (error) {
        throw error;
      }
    },

    async update(id: PrimaryKey, data: any) {
      try {
        const response = await Api.put(`engines/${id}`, data);
        return response;
      } catch (error) {
        throw error;
      }
    },

    async delete(id: PrimaryKey) {
      try {
        const response = await Api.delete(`engines/${id}`);
        return response;
      } catch (error) {
        throw error;
      }
    },
  },
});
