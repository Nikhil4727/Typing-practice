// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       '/api': 'http://localhost:5000', // change if backend uses different port
//       exclude: ['mock-aws-s3', 'aws-sdk', 'nock', '@mapbox/node-pre-gyp']
//     }
//   }
// })


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // The proxy configuration will only be used during development
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
      exclude: ['mock-aws-s3', 'aws-sdk', 'nock', '@mapbox/node-pre-gyp']
    }
  }
})