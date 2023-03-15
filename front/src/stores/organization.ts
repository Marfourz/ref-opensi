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

    async fetchAllParteners(query: any,id:string) {
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
        const response = await Api.put(`organisations/${id}`,{status:'inactive'});
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async enable(id: PrimaryKey) {
       try {
        const response = await Api.put(`organisations/${id}`,{status:'active'});
        return response.data;
      } catch (error) {
        throw error;
      }
    },


    async statInfo() {
      try {
        const response = await Api.get(`organisations/snb/infos`);
        return response;
      } catch (error) {
        throw error;
      }
    },

    async statPartners(type: OrganisationType) {
      try {
        const response = await Api.get(
          `organisations/top-partners?type=${type}`
        );
        return response;
      } catch (error) {
        throw error;
      }
    },

  },
});
