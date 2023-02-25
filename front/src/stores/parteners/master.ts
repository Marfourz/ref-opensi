import { defineStore } from "pinia";
import { IMaster, PrimaryKey } from "@/types/interfaces";
import Api from "../../api";
// import { UserRole } from "../../types/enumerations";
import master from "../../data/master";

export const useMasterStore = defineStore("masterStore", {
  state: () => {
    return {
      current_user: {} as IMaster,
    };
  },

  actions: {
    // getRoleLabel(role: UserRole): string | undefined {
    //   const labels = [
    //     {
    //       code: UserRole.ADMIN,
    //       label: "Administrateur",
    //     },
    //     {
    //       code: UserRole.DELIVERY_MAN,
    //       label: "Livreur",
    //     },
    //     {
    //       code: UserRole.COMMERCIAL,
    //       label: "Commercial",
    //     },
    //     {
    //       code: UserRole.SUPER_USER,
    //       label: "Super administrateur",
    //     },
    //   ];

    //   return labels.find((value: any) => value.code == role)?.label;
    // },

    async me() {
      try {
        const response = await Api.get(`auth/me`);
        useMasterStore().saveCurrentMaster(response.data);
        return response.data;
      } catch (error) {}
    },

    saveCurrentMaster(master: IMaster) {
      this.current_master = master;
      localStorage.setItem("current_user", JSON.stringify(master));
    },

    async findOne(id: number) {
      try {
        const response = await Api.get(`master/${id}`);
        return response.data;
      } catch (error) {}
    },

    async fetchAll(query: any) {
      try {
        const response = await Api.get("master", { params: query });
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async fetchByOrganization(id: PrimaryKey, query: any) {
      try {
        const response = await Api.get(`master/${id}/search`, {
          params: query,
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async findByEmail(email: string) {
      try {
        const response = await Api.get(`master/search/email/${email}`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    // async sendResetPasswordCode(email: string) {
    //   try {
    //     const response = await Api.post(`auth/password/forgot`, {
    //       email: email,
    //     });
    //     return response.data;
    //   } catch (error) {
    //     throw error;
    //   }
    // },

    // async verifyResetPasswordCode(email: string, code: number) {
    //   try {
    //     const response = await Api.post(`auth/password/verify-code`, {
    //       email,
    //       code,
    //     });
    //     return response.data;
    //   } catch (error) {
    //     throw error;
    //   }
    // },

    // async resetPassword(data: {
    //   email: string;
    //   code: number;
    //   password: string;
    // }) {
    //   console.log("ssss", data);

    //   try {
    //     const response = await Api.post(`auth/password/reset`, data);
    //   } catch (error) {
    //     throw error;
    //   }
    // },

    // async definePassword(data: {
    //   username: string;
    //   password: string;
    //   token: string;
    // }) {
    //   console.log("ssss", data);

    //   try {
    //     const response = await Api.put(`auth/resetPassword`, data);
    //     return response;
    //   } catch (error) {
    //     throw error;
    //   }
    // },

    async create(data: any) {
      try {
        const response = await Api.post("master", { ...data });
        return response;
      } catch (error) {
        throw error;
      }
    },

    async update(id: PrimaryKey, data: any) {
      try {
        const response = await Api.put(`master/${id}`, data);
        return response;
      } catch (error) {
        throw error;
      }
    },

    async delete(id: PrimaryKey) {
      try {
        const response = await Api.delete(`master/${id}`);
        return response;
      } catch (error) {
        throw error;
      }
    },
  },

 getters: {
   getCurrentMaster(): IMaster | null {
     if (this.current_master) return this.current_master;
     const master = localStorage.getItem("current_master");
     if (master) return JSON.parse(master);
     return null;
   },
 },
});
