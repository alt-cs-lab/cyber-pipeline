// Imports
import { defineStore } from 'pinia'
import Logger from 'js-logger'

// Services
import api from '@/services/api'

export const useDistrictsStore = defineStore('districts', {
  state: () => {
    return {
      districts: [],
    }
  },
  getters: {
    getDistrict: (state) => {
      return (id) => state.districts.find((district) => district.id === id)
    }
  },
  actions: {
    async hydrate() {
      Logger.info('districts:hydrate')
      await api.get('/api/v1/districts').then((response) => {
        this.districts = response.data
      })
    },
    async update(district) {
      await api
        .post('/api/v1/districts/' + district.id, {
          district: district,
        })
        .then(async () => {
          await this.hydrate()
        })
    },
    async new(district) {
      await api
        .post('/api/v1/districts', {
          district: district,
        })
        .then(async () => {
          await this.hydrate()
        })
    },
    async delete(id) {
      await api.delete('/api/v1/districts/' + id).then(async () => {
        await this.hydrate()
      })
    }
  },
})
