// Imports
import { defineStore } from 'pinia'
import Logger from 'js-logger'

// Services
import api from '@/services/api'

export const useProfileStore = defineStore('profile', {
  state: () => {
    return {
      user: {},
    }
  },
  actions: {
    async hydrate() {
      Logger.info('profile:hydrate')
      await api.get('/api/v1/profile').then((response) => {
        this.user = response.data
      })
    },
    async update(user) {
      await api
        .post('/api/v1/profile/', {
          user: user,
        })
        .then(async () => {
          await this.hydrate()
        })
    },
  },
})
