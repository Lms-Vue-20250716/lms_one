import { defineStore } from 'pinia';

export const useUserInfo = defineStore('userInfo', {
  state: () => ({
    user: null,
  }),
  actions: {
    setUserData(data) {
      this.user = data;
    },
    initializeFromSession() {
      const storedUserInfo = sessionStorage.getItem('userInfo');
      if (storedUserInfo) {
        try {
          this.user = JSON.parse(storedUserInfo);
        } catch (error) {
          console.error('Error loading user info:', error);
        }
      }
    },
  },
});
