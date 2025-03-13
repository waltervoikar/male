<template>
  <h2 v-if="!frontPage" class="mb-2">{{ tournaments.headerText }}</h2>
  <v-row v-if="tournaments.tournaments.length">
    <v-col
      v-for="(t, index) in tournaments.tournaments"
      :key="index"
      cols="12"
      md="4"
    >
      <v-card
        outlined
        class="mb-2"
        hover
        @click="goToTournamentDetails(t.id)"
      >
        <v-card-title>{{ t.name }}</v-card-title>
        <v-card-subtitle>
          Algus: {{ t.startDate }} <br />
          Lõpp: {{ t.endDate }}
        </v-card-subtitle>
        <v-card-text>
          Toimumiskoht: {{ t.location }}
          {{ t.description }}
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
  <v-row v-else>
    <v-col cols="12" class="mb-4">
      {{ tournaments.noTournamentsText }}
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "TournamentDisplay",

  data() {
    return {
    }
  },
  props: {
    tournaments: {
      type: Object,
      required: true,
    },
    frontPage: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    goToTournamentDetails(tournamentId) {
      this.$router.push(`/turniirid/${tournamentId}`)
    },

  },

  created() {

  },

}
</script>

<style scoped>

</style>
