<template>
  <v-container fluid class="mt-4">
    <h2 class="mb-2">Hetkel toimumas:</h2>
    <v-row class="mb-6">
      <v-col
        v-for="(t, index) in onGoingTournaments"
        :key="index"
        cols="12"
        md="12"
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

    <h2 class="mb-2">Tulemas:</h2>
    <v-row class="mb-6">
      <v-col
        v-for="(t, index) in upcomingTournaments"
        :key="index"
        cols="12"
        md="12"
      >
        <v-card
          outlined
          class="mb-3"
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

    <h2 class="mb-2">Lõppenud:</h2>
    <v-row>
      <v-col
        v-for="(t, index) in finishedTournaments"
        :key="index"
        cols="12"
        md="12"
      >
        <v-card
          outlined
          class="mb-3"
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

  </v-container>
</template>

<script>
import {fetchAllTournaments} from "@/wrapper/tournamentsApiWrapper.js";

export default {
  name: 'TournamentsPage',
  data() {
    return {
      onGoingTournaments: [],
      upcomingTournaments: [],
      finishedTournaments: [],
    }
  },

  methods: {
    goToTournamentDetails(tournamentId) {
      this.$router.push(`/turniirid/${tournamentId}`)
    },

    async fetchTournaments() {
      let allTournaments = await fetchAllTournaments()
      let today = new Date()
      allTournaments.map(tournament => {
        let tournamentStartDate = Date.parse(tournament.startDate)
        let tournamentEndDate = Date.parse(tournament.endDate)

        if (tournamentStartDate < today && tournamentEndDate > today) {
          this.onGoingTournaments.push(tournament)
        } else if (tournamentStartDate > today) {
          this.upcomingTournaments.push(tournament)
        } else {
          this.finishedTournaments.push(tournament)
        }
      })
    },
  },

  created() {
    this.$watch(
      () => this.$route.params.id,
      this.fetchTournaments,
      {immediate: true}
    )
  },
}

</script>

<style scoped>
</style>
