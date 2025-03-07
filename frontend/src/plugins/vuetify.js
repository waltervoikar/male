/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          background: '#F8FAFC',
          primary: "#D9EAFD",
          secondary: "#BCCCDC",
          dark: "#9AA6B2",
          gold: "#C9B037",
          silver: "#B4B4B4",
          bronze: "#6A3805",
        }
      }
    }
  },
})
