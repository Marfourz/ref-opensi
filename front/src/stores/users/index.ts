import { defineStore } from "pinia";
import { IUser, PrimaryKey } from "@/types/interfaces";
import Api from "../../api";
import { UserRole } from "../../types/enumerations";
import users from "../../data/users";

export const useUsersStore = defineStore("usersStore", {
  state: () => {
    return {
      current_user: {} as IUser | null,
    };
  },

  actions: {
    getRoleLabel(role: UserRole): string | undefined {
      const labels = [
        {
          code: UserRole.ADMIN,
          label: "Administrateur",
        },
        {
          code: UserRole.DELIVERY_MAN,
          label: "Livreur",
        },
        {
          code: UserRole.COMMERCIAL,
          label: "Commercial",
        },
        {
          code: UserRole.SUPER_USER,
          label: "Super administrateur",
        },
      ];

      return labels.find((value: any) => value.code == role)?.label;
    },

    async me() {
      try {
        const response = await Api.get(`auth/me`);
        useUsersStore().saveCurrentUser(response.data);
        return response.data;
      } catch (error) {}
    },

    saveCurrentUser(user: IUser | null) {
      console.log("saveCurrentUser", user);

      this.current_user = user;
      localStorage.setItem("current_user", JSON.stringify(user));
    },

    async findOne(id: string) {
      try {
        const response = await Api.get(`users/${id}`);
        return response.data;
      } catch (error) {}
    },

    async fetchAll(query: any) {
      try {
        const response = await Api.get("users", { params: query });
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async fetchByOrganization(query: any, id: PrimaryKey) {
      console.log("fetchByOrganization", id);

      try {
        const response = await Api.get(`users/${id}/search`, { params: query });
        return response.data;
      } catch (error) {
        throw error;
      }
    },


    async downloadUsers(query: any, id: PrimaryKey) {
      

      try {
        const response = await Api.get(`documents/download-users/${id}`, { params: query });
        return response.data;
      } catch (error) {
        throw error;
      }
    },



    

    async findByEmail(email: string) {
      try {
        const response = await Api.get(`users/search/email/${email}`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async sendResetPasswordCode(email: string) {
      try {
        const response = await Api.post(`auth/getResetPasswordCode`, {
          username: email,
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async verifyResetPasswordCode(username: string, otp: string) {
      try {
        const response = await Api.post(`auth/verifyOtpCode`, {
          username,
          otp,
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async resetPassword(data: {
      username: string;
      otp: string;
      password: string;
    }) {
      console.log("ssss", data);

      try {
        const response = await Api.put(`auth/resetPasswordWithOtp`, data);
      } catch (error) {
        throw error;
      }
    },

    async definePassword(data: {
      username: string;
      password: string;
      token: string;
    }) {
      console.log("ssss", data);

      try {
        const response = await Api.put(`auth/resetPassword`, data);
        return response;
      } catch (error) {
        throw error;
      }
    },

    async create(data: any) {
      try {
        const response = await Api.post("users", { ...data });
        return response;
      } catch (error) {
        throw error;
      }
    },

    async update(id: PrimaryKey, data: any) {
      try {
        const response = await Api.put(`users/${id}`, data);
        return response;
      } catch (error) {
        throw error;
      }
    },

    async delete(id: PrimaryKey) {
      try {
        const response = await Api.delete(`users/${id}`);
        return response;
      } catch (error) {
        throw error;
      }
    },
  },

  getters: {
    getCurrentUser(): IUser | null {
      console.log("current user", this.current_user);

      if (this.current_user) return this.current_user;
      const user = localStorage.getItem("current_user");
      if (user) return JSON.parse(user);
      return null;
    },
  },
});
