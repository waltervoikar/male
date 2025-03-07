<template>
  <v-app>
    <!-- navbar -->
    <AppNavbar />

    <!-- main content -->
    <v-main>
      <v-container fluid class="mt-4">
        <v-row>
          <!-- Main content column -->
          <v-col cols="12">
            <router-view />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import AppNavbar from "@/components/AppNavbar.vue";

export default {
  name: 'MainLayout',
  components: {AppNavbar},
  data() {
    return {
      drawer: true,
    }
  },
}
</script>
