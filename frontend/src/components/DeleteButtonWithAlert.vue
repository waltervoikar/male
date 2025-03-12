<template>
  <v-btn variant="tonal" base-color="red" @click="startNukeSequence">{{ buttonText }}</v-btn>
  <v-dialog v-model="showNukeConfirmationAlert" max-width="500">
    <v-card>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <h1>Oled sa kindel?</h1>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="tonal" @click="abortNukeSequence">Tühista</v-btn>
        <v-btn
          variant="elevated"
          color="primary"
          @click="confirmNuke"
        >
          Jah
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: "DeleteButtonWithAlert",

  props: {
    buttonText: {
      type: String,
      required: true,
    }
  },

  data() {
    return {
      showNukeConfirmationAlert: false,
    }
  },

  methods: {

    startNukeSequence() {
      this.showNukeConfirmationAlert = true
    },

    abortNukeSequence() {
      this.showNukeConfirmationAlert = false
    },

    confirmNuke() {
      this.$emit("nuke-confirmed")
      this.showNukeConfirmationAlert = false
    },

  },

  created() {

  },

}
</script>

<style scoped>

</style>
