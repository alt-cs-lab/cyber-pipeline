// Imports
import { defineStore } from 'pinia'
import Logger from 'js-logger'

// Services
import api from '@/services/api'

export const useDistrictsStore = defineStore('districts', {
  state: () => {
    return {
      districts: [] // list of districts
    }
  },
  getters: {
    /**
     * Getter for an individual item
     *
     * @param {State} state
     * @returns a function to find an item based on a given id
     */
    getDistrict: (state) => {
      return (id) => state.districts.find((district) => district.id === id)
    }
  },
  actions: {
    /**
     * Hydrate the store by querying the API for data
     */
    async hydrate() {
      Logger.info('districts:hydrate')
      await api.get('/api/v1/districts').then((response) => {
        this.districts = response.data
        this.districts.map((district) => {
          district.rural = district.rural === 1
          district.urban = district.urban === 1
          district.suburban = district.suburban === 1
          district.town = district.town === 1
        })
        this.districts.forEach((district) => {
          district.locales = [
            district.rural ? 0 : '',
            district.urban ? 1 : '',
            district.suburban ? 2 : '',
            district.town ? 3 : ''
          ].join(', ')
        })
      })
    },

    /**
     * Update an item via the API
     *
     * @param {District} district
     */
    async update(district) {
      district.rural = district.rural ? 1 : 0
      district.urban = district.urban ? 1 : 0
      district.suburban = district.suburban ? 1 : 0
      district.town = district.town ? 1 : 0
      await api
        .post('/api/v1/districts/' + district.id, {
          district: district
        })
        .then(async () => {
          await this.hydrate()
        })
    },

    /**
     * Create a new item via the API
     *
     * @param {District} district
     */
    async new(district) {
      district.rural = district.rural ? 1 : 0
      district.urban = district.urban ? 1 : 0
      district.suburban = district.suburban ? 1 : 0
      district.town = district.town ? 1 : 0
      await api
        .put('/api/v1/districts', {
          district: district
        })
        .then(async () => {
          await this.hydrate()
        })
    },
    /**
     * Delete an item with the given ID via the API
     *
     * @param {Integer} id
     */
    async delete(id) {
      await api.delete('/api/v1/districts/' + id).then(async () => {
        await this.hydrate()
      })
    }
  }
})
