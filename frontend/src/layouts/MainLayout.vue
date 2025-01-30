<template>
  <v-app>
    <!-- navbar -->
    <AppNavbar />

    <!-- main content -->
    <v-main>
      <v-container fluid class="mt-4">
        <v-row>
          <!-- Left side column -->
          <v-col cols="3">
            <!-- Side column content (e.g., navigation links, info, etc.) -->
            <h2>Left Side Column</h2>
            <p>Additional content or links can go here.</p>
          </v-col>

          <!-- Main content column -->
          <v-col cols="9">
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
