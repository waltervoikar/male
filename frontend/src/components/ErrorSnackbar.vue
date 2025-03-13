<template>
  <v-snackbar
    v-model="showSnackbar"
    vertical
  >
    <div class="text-subtitle-1 pb-2">Midagi läks valesti</div>

    <p>{{ snackbarText }}</p>

    <template v-slot:actions>
      <v-btn
        color="indigo"
        variant="text"
        @click="showSnackbar = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: "ErrorSnackbar",

  props: {
    showSnackbar: {
      type: Boolean,
      default: false,
    },
    snackbarText: {
      type: String,
      default: "",
    }
  },

}
</script>

<style scoped>

</style>
