import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  //  server :{
  //    host: 'linserv1.cims.nyu.edu',
  //    port: 12170,
  // },
})
