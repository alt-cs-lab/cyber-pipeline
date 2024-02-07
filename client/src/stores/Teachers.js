// Imports
import { defineStore } from 'pinia'
import Logger from 'js-logger'

// Services
import api from '@/services/api'

export const useTeachersStore = defineStore('teachers', {
  state: () => {
    return {
      teachers: [],
    }
  },
  getters: {
    getTeacher: (state) => {
      return (id) => state.teachers.find((teacher) => teacher.id === id)
    }
  },
  actions: {
    async hydrate() {
      Logger.info('teachers:hydrate')
      await api.get('/api/v1/teachers').then((response) => {
        this.teachers = response.data
      })
    },
    async update(teacher) {
      await api
        .post('/api/v1/teachers/' + teacher.id, {
          teacher: teacher,
        })
        .then(async () => {
          await this.hydrate()
        })
    },
    async new(teacher) {
      await api
        .post('/api/v1/teachers', {
          teacher: teacher,
        })
        .then(async () => {
          await this.hydrate()
        })
    },
    async delete(id) {
      await api.delete('/api/v1/teachers/' + id).then(async () => {
        await this.hydrate()
      })
    }
  },
})
