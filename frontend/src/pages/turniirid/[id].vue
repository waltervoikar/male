<template>
  <v-container fluid>
    <v-row class="mb-4">
      <v-col>
        <h1 v-if="tournament" class="mb-2">{{ tournament.name }}</h1>
        <h3 v-if="tournament">{{ tournament.location }}</h3>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h2 class="mb-4">Turniiri Partiid</h2>
        <MatchesSearch :tournamentId="tournamentId" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import MatchesSearch from "@/components/tournaments/MatchesSearch.vue";
import {fetchTournamentById} from "@/wrapper/tournamentsApiWrapper.js";

export default {
  components: {MatchesSearch},
  data() {
    return {
      tournamentId: null,
      tournament: null,
    }
  },

  created() {
    this.tournamentId = this.$route.params.id
    this.$watch(
      () => this.$route.params.id,
      this.fetchTournament,
      {immediate: true}
    )
  },

  methods: {
    async fetchTournament() {
      this.tournament = await fetchTournamentById(this.tournamentId)
    },
  }
}
</script>

<style scoped>

</style>
