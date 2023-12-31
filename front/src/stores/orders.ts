import { AxiosError, AxiosResponse } from "axios";
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

    async fetchAllByOrganization(query: any, id: PrimaryKey) {
      try {
        const response = await Api.get(`orders/${id}/search`, {
          params: query,
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async fetchAllByOrganizationType(query: any, id: PrimaryKey) {
      try {
        const response = await Api.get(`orders/getOrders/${id}`, {
          params: query,
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async create(data: {
      organisationId: PrimaryKey | undefined;
      transactionId?: string;
      items: Array<{ productId: PrimaryKey; quantity: number }>;
    }) {
      try {
        const response = await Api.post("orders", data);
        return response;
      } catch (error) {
        throw error;
      }
      // const response = await Api.post("orders", data)
      // .then((response: AxiosResponse) => {
        // do something
      //   return response;
      // })
      // .catch((error: AxiosError) => {
      //  return error?.response;
      // });
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

    async historyOrder(id: PrimaryKey) {
      try {
        const response = await Api.get(
          `orders/${id}/history`
        );
        console.log(response);
        return response.data;
      } catch (error) {
        throw error;
      }
    },


    async generateInvoice(id: PrimaryKey) {
      try {
        const response = await Api.get(
          `documents/generate-invoice/${id}`
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },



    async downloadOrder(query: any,id: PrimaryKey) {
      try {
        const response = await Api.get(
          `documents/download-orders/${id}`
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },


    async downloadReceivedOrder(query: any,id: PrimaryKey) {
      try {
        const response = await Api.get(
          `documents/download-received-orders/${id}`
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },



  



  
});
