import { defineStore } from "pinia";
import Api from "../api";
import { PrimaryKey } from "../types/interfaces";

export const useOrganizationStore = defineStore("organizationStore", {
  actions: {
    async fetchOne(id: PrimaryKey) {
      try {
        const response = await Api.get(`organization/${id}`);
        return response.data;
      } catch (error) {}
    },

    async fetchAll(query: any) {
      try {
        const response = await Api.get("organization", { params: query });
        return response.data;
      } catch (error) {
        throw error;
      }
    },


    async fetchAllDeliveryMen(id: PrimaryKey, query: any) {
        try {
          const response = await Api.get(`organization/${id}/deliveryMen`, { params: query });
          return response.data;
        } catch (error) {
          throw error;
        }
      },

  
    async create(data: any) {
      try {
        const response = await Api.post("organization", data);
        return response;
      } catch (error) {
        throw error;
      }
    },

    async update(id: PrimaryKey, data: any) {
      try {
        const response = await Api.put(`organization/${id}`, data);
        return response;
      } catch (error) {
        throw error;
      }
    },

    async delete(id: PrimaryKey) {
      try {
        const response = await Api.delete(`organization/${id}`);
        return response;
      } catch (error) {
        throw error;
      }
    },
  },
});
