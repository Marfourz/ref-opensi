import { defineStore } from "pinia";
import Api from "../api";
import { PrimaryKey } from "../types/interfaces";

export const useOrdersStore = defineStore("ordersStore", {
  actions: {
    async fetchOne(id: PrimaryKey) {
      try {
        const response = await Api.get(`orders/${id}`);
        return response.data;
      } catch (error) {}
    },

    async fetchAll(query: any) {
      try {
        const response = await Api.get("orders", { params: query });
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async fetchAllByOrganization(query: any, id : PrimaryKey) {
        try {
          const response = await Api.get(`orders/${id}/search`, { params: query });
          return response.data;
        } catch (error) {
          throw error;
        }
      },

      async fetchAllByOrganizationType(query: any, id : PrimaryKey) {
        try {
          const response = await Api.get(`orders/getOrders/${id}`, { params: query });
          return response.data;
        } catch (error) {
          throw error;
        }
      },


    async create(data: {organisationId : PrimaryKey | undefined ,items : Array<{productId : PrimaryKey,quantity : number}>}) {
      try {
        const response = await Api.post("orders", data);
        return response;
      } catch (error) {
        throw error;
      }
    },

    async update(id: PrimaryKey, data: any) {
      try {
        const response = await Api.put(`orders/${id}`, data);
        return response;
      } catch (error) {
        throw error;
      }
    },

    async delete(id: PrimaryKey) {
      try {
        const response = await Api.delete(`orders/${id}`);
        return response;
      } catch (error) {
        throw error;
      }
    },
  },
});
