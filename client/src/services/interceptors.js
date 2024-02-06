/* https://www.bezkoder.com/vue-refresh-token/ */
// Imports
import axios from './api'

// Stores
import { useTokenStore } from '@/stores/Token'

const setupInterceptors = () => {
  axios.interceptors.request.use(
    (config) => {
      if (config.url !== '/auth/token') {
        const tokenStore = useTokenStore()
        if (tokenStore.token) {
          config.headers['Authorization'] = 'Bearer ' + tokenStore.token
        }
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )
  axios.interceptors.response.use(
    (res) => {
      return res
    },
    async (err) => {
      const original_config = err.config
      if (original_config.url !== '/auth/token' && err.response) {
        if (err.response.status === 401) {
          // Expired Access Token
          if (!original_config._retry) {
            // Prevent infinite loops
            original_config._retry = true
            try {
              const tokenStore = useTokenStore()
              await tokenStore.refreshToken()
              return axios(original_config)
            } catch (_error) {
              return Promise.reject(_error)
            }
          } else {
            //console.log('This is a retry - aborting')
          }
        }
      }
      return Promise.reject(err)
    }
  )
}

export default setupInterceptors
