// Imports
import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'
import { useStorage } from '@vueuse/core'
import Logger from 'js-logger'

// Services
import api from '@/services/api'

export const useTokenStore = defineStore('token', {
  state: () => {
    return {
      // HACK this may be unsafe - consider refactor?
      token: useStorage('token', '')
    }
  },
  getters: {
    refresh_token() {
      if (this.token) {
        return jwtDecode(this.token)['refresh_token']
      } else {
        return ''
      }
    },
    eid() {
      if (this.token) {
        return jwtDecode(this.token)['eid']
      } else {
        return ''
      }
    },
    id() {
      if (this.token) {
        return jwtDecode(this.token)['user_id']
      } else {
        return ''
      }
    },
    is_admin() {
      if (this.token) {
        return jwtDecode(this.token)['is_admin']
      } else {
        return false
      }
    }
  },
  actions: {
    async getToken() {
      Logger.info('token:get')
      await api
        .get('/auth/token', { withCredentials: true })
        .then((response) => {
          this.token = response.data.token
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            this.token = ''
            Logger.info('token:get login failed - redirecting to CAS')
            window.location.href = import.meta.env.DEV
              ? 'http://localhost:3000/auth/login'
              : '/auth/login'
          } else {
            Logger.error('token:get error' + err)
            this.token = ''
          }
        })
    },

    async tryToken() {
      Logger.info('token:try')
      await api
        .get('/auth/token', { withCredentials: true })
        .then((response) => {
          this.token = response.data.token
        })
        .catch(async (err) => {
          if (err.response && err.response.status === 401) {
            Logger.info('token:try login failed - trying refresh token')
            await this.tryRefreshToken()
          } else {
            this.token = ''
            Logger.error('token:try error' + err)
          }
        })
    },

    async refreshToken() {
      Logger.info('token:refresh')
      await api
        .post('/auth/token', {
          refresh_token: this.refresh_token
        })
        .then((response) => {
          this.token = response.data.token
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            this.token = ''
            Logger.info('token:refresh login failed - redirecting to CAS')
            window.location.href = import.meta.env.DEV
              ? 'http://localhost:3000/auth/login'
              : '/auth/login'
          } else {
            Logger.error('token:refresh error' + err)
            this.token = ''
          }
        })
    },

    async tryRefreshToken() {
      Logger.info('token:tryrefresh')
      await api
        .post('/auth/token', {
          refresh_token: this.refresh_token
        })
        .then((response) => {
          this.token = response.data.token
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            this.token = ''
            Logger.info('token:tryrefresh login failed')
          } else {
            this.token = ''
            Logger.error('token:tryrefresh error' + err)
          }
        })
    },

    async logout() {
      this.token = ''
      window.location.href = import.meta.env.DEV
        ? 'http://localhost:3000/auth/logout'
        : '/auth/logout'
    }
  }
})
