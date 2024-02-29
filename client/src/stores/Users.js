// Imports
import { defineStore } from 'pinia'
import Logger from 'js-logger'

// Services
import api from '@/services/api'

export const useUsersStore = defineStore('users', {
  state: () => {
    return {
      users: [],
    }
  },
  getters: {
    getUser: (state) => {
      return (id) => state.users.find((user) => user.id === id)
    },
  },
  actions: {
    async hydrate() {
      Logger.info('users:hydrate')
      await api.get('/api/v1/users').then((response) => {
        this.users = response.data
      })
    },
    async update(user) {
      await api
        .post('/api/v1/users/' + user.id, {
          user: user,
        })
        .then(async () => {
          await this.hydrate()
        })
    },
    async delete(id) {
      await api.delete('/api/v1/users/' + id).then(async () => {
        await this.hydrate()
      })
    },
    async new(user) {
      await api.put('/api/v1/users/', { user:user }).then(async () => {
        await this.hydrate()
      })
    },
  },
})
