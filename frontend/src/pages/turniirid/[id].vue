<template>
  <v-container fluid>
    <v-row class="mb-4">
      <v-col>
        <h1 v-if="tournament" class="mb-2">{{ tournament.name }}</h1>
        <h3 v-if="tournament">{{ tournament.location }}</h3>
      </v-col>
    </v-row>
    <v-row class="mb-4">
      <v-col>
        <v-btn color="primary" @click="openAddMatchDialog">Lisa partii</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <MatchesSearch :tournamentId="tournamentId" />
      </v-col>
    </v-row>
    <AddMatchDialog
      :tournamentId="tournamentId"
      v-model:showDialog="showAddMatchDialog"
      @match-updated:success="fetchTournament"
    />
  </v-container>
</template>

<script>
import MatchesSearch from "@/components/tournaments/MatchesSearch.vue";
import AddMatchDialog from "@/components/tournaments/AddMatchDialog.vue";
import { fetchTournamentById } from "@/wrapper/tournamentsApiWrapper.js";

export default {
  name: "Tournament",
  components: { MatchesSearch, AddMatchDialog },
  data() {
    return {
      tournamentId: null,
      tournament: null,
      showAddMatchDialog: false,
    };
  },
  created() {
    this.tournamentId = this.$route.params.id;
    this.$watch(
      () => this.$route.params.id,
      this.fetchTournament,
      { immediate: true }
    );
  },
  methods: {
    async fetchTournament() {
      this.tournament = await fetchTournamentById(this.tournamentId);
    },
    openAddMatchDialog() {
      this.showAddMatchDialog = true;
    },
  },
};
</script>

<style scoped>
</style>
