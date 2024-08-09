import axios from 'axios'

const api = axios.create({ baseURL: process.env.API_BASE })

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Get the token from localStorage or wherever you store it
    const token = localStorage.getItem('token')
    
    // If token exists, add it to the headers
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error);
  }
)


export default ({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
}

export { axios, api }
