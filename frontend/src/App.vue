<template>
  <v-app>
    <v-main>
      <MainLayout>
        <router-view />
      </MainLayout>
    </v-main>
  </v-app>
</template>

<script setup>
//
import MainLayout from "@/layouts/MainLayout.vue";
</script>
