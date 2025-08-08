import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    hasAccess: true,
  }),
  getters: {
    getUserAccess: (state) => state.hasAccess,
  },
  actions: {
    setUserAccess(value) {
      this.hasAccess = value
    },
  },
})
