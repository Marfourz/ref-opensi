import { OrganisationType } from "@/types/enumerations";
import { defineStore } from "pinia";
import Api from "../api";
import { PrimaryKey } from "../types/interfaces";

export const useOrganizationStore = defineStore("organizationStore", {
  actions: {
    async fetchOne(id: PrimaryKey) {
      try {
        const response = await Api.get(`organisation/${id}`);
        return response.data;
      } catch (error) {}
    },

    async fetchAll(query: any) {
      try {
        const response = await Api.get("organisations", { params: query });
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async fetchAllParteners(query: any, id: string) {
      try {
        const response = await Api.get(`organisations/partners/search/${id}`, {
          params: query,
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async fetchAllDeliveryMen(query: any, id: PrimaryKey) {
      try {
        const response = await Api.get(`organisations/${id}/deliveryMen`, {
          params: query,
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async downloadDeliveryMen(query: any, id: PrimaryKey) {
      try {
        const response = await Api.get(`documents/download-deliveryMen/${id}`, {
          params: query,
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async create(data: any) {
      try {
        const response = await Api.post("organisations", data);
        return response;
      } catch (error) {
        throw error;
      }
    },

    async onView(id: PrimaryKey) {
      try {
        const response = await Api.get(`organisations/snb/infos/${id}`);
        return response.data;
      } catch (error) {}
    },

    async update(id: PrimaryKey, data: any) {
      try {
        const response = await Api.put(`organisations/${id}`, data);
        return response;
      } catch (error) {
        throw error;
      }
    },

    async delete(id: PrimaryKey) {
      try {
        const response = await Api.delete(`organisations/${id}`);
        return response;
      } catch (error) {
        throw error;
      }
    },

    async disable(id: PrimaryKey) {
      try {
        const response = await Api.put(`organisations/${id}`, {
          status: "inactive",
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async enable(id: PrimaryKey) {
      try {
        const response = await Api.put(`organisations/${id}`, {
          status: "active",
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async statInfo(
      organisationId: string,
      params: { startDate?: Date; endDate?: Date }
    ) {
      try {
        const response = await Api.get(
          `organisations/snb/infos/${organisationId}`,
          { params }
        );
        return response;
      } catch (error) {
        throw error;
      }
    },

    async turnoverEvolution(organisationId: string) {
      try {
        const response = await Api.get(
          `organisations/turnover-chart/${organisationId}`
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async statPartners(params: {
      type: OrganisationType;
      startDate?: Date;
      endDate?: Date;
    }) {
      try {
        const response = await Api.get(`organisations/top-partners?`, {
          params,
        });
        return response;
      } catch (error) {
        throw error;
      }
    },

    async downloadPartners(query: any, id: PrimaryKey) {
      try {
        const response = await Api.get(
          `documents/download-partners/${id}`
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
