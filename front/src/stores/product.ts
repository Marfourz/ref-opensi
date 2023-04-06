import { defineStore } from "pinia";
import { IUser, PrimaryKey } from "@/types/interfaces";
import Api from "../api";
import product from "../data/product";
import { PackagingType, StockState } from "../types/enumerations";
import { useUsersStore } from "./users";

interface ICreateStock {
  organisationId: PrimaryKey;
  productId: PrimaryKey;
  currentQuantity: number;
}

export const useProductStore = defineStore("productStore", {
  actions: {
    async fetchOne(id: number) {
      try {
        const response = await Api.get(`products/${id}`);
        return response.data;
      } catch (error) {}
    },

    async fetchAll(query?: any) {
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
        const response = await Api.put(`products/${id}`, data);
        return response;
      } catch (error) {
        throw error;
      }
    },

    async delete(id: number) {
      try {
        const response = await Api.delete(`products/${id}`);
        return response;
      } catch (error) {
        throw error;
      }
    },

    async updateStock(id: PrimaryKey, quantity: number) {
      try {
        const response = await Api.put(`stocks/${id}`, {
          currentQuantity: quantity,
        });
        return response;
      } catch (error) {
        throw error;
      }
    },

    async fetchAllProductsStock(query: any, orgId: PrimaryKey) {
      try {
        const response = await Api.get(`stocks/${orgId}/search`, {
          params: query,
        });

        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async downloadProductsStock(query: any, orgId: PrimaryKey) {
      try {
        const response = await Api.get(`documents/download-stocks/${orgId}`, {
          params: query,
        });

        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async createStock(data: ICreateStock) {
      try {
        const response = await Api.post(`stocks`, data);
        return response;
      } catch (error) {
        throw error;
      }
    },

    async stockGeneralInfo() {
      const userStore = useUsersStore();
      const orgId = userStore.getCurrentUser?.organisationId;
      try {
        const response = await Api.get(`stocks/${orgId}/generalInfos`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    getPackageTypeLabel(type: PackagingType): string | undefined {
      const labels = [
        {
          code: PackagingType.PACK,
          label: "Casier",
        },
        {
          code: PackagingType.RACK,
          label: "Pack",
        },
      ];

      return labels.find((value: any) => value.code == type)?.label;
    },

    async historyStock(id: PrimaryKey, type: StockState) {
      try {
        const params = {} as {
          filterType?: string;
        };
        if (type) params.filterType  = type;
        const response = await Api.get(`stocks/${id}/stock-evolution`, {
          params,
        });
        console.log(response);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
