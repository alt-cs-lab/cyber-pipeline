/* https://www.bezkoder.com/vue-refresh-token/ */
// Imports
import axios from 'axios'

const instance = axios.create({
  // baseURL: 'import.meta.env.DEV ? 'http://localhost:3000' : '/','
  baseURL: '/',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export default instance
