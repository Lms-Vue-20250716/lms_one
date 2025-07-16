import { defineStore } from 'pinia';

export const useModalState = defineStore('modalState', {
  state: () => {
    return {
      isOpen: false,
      type: null,
      payload: null,
    };
  },
});
