/**
 * Vuetify autogenereeritud
 */

/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter } from 'vue-router/auto'
import { routes } from 'vue-router/auto-routes'
import {createWebHistory} from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err.message.includes('Failed to fetch dynamically imported module') || err.message.includes("Importing a module script failed")) {
    window.location = to.fullPath
  }
})

export default router
