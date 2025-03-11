<template>
  <v-container fluid>
    <v-row class="mb-4">
      <v-col>
        <h1 v-if="tournament" class="mb-2">{{ tournament.name }}</h1>
      </v-col>
    </v-row>
    <v-row dense v-if="tournament">
      <v-col cols="12" md="6" lg="4">
        <v-card outlined>
          <v-card-title>{{ tournament.location }}</v-card-title>
          <v-card-text>
            ASUKOHT
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" lg="4">
        <v-card outlined>
          <v-card-title>{{ tournament.startDate }}</v-card-title>
          <v-card-text>
            ALGUS
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" lg="4">
        <v-card outlined>
          <v-card-title>{{ tournament.endDate }}</v-card-title>
          <v-card-text>
            LÕPP
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn color="primary" @click="openModifyTournamentDialog">Muuda turniiri</v-btn>
      </v-col>
    </v-row>
    <v-row cols="12">
      <v-col>
        <v-divider :thickness="3"></v-divider>
      </v-col>
    </v-row>
    <v-row>
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
    <AddTournamentDialog v-if="showModifyTournamentDialog"
                         v-model:showDialog="showModifyTournamentDialog"
                         :is-update="true"
                         :tournament-id="tournamentId"
                         @dialog-closed="closeModifyTournamentDialog"
    />
  </v-container>
</template>

<script>
import MatchesSearch from "@/components/tournaments/MatchesSearch.vue";
import AddMatchDialog from "@/components/tournaments/AddMatchDialog.vue";
import { fetchTournamentById } from "@/wrapper/tournamentsApiWrapper.js";
import AddTournamentDialog from "@/components/tournaments/AddTournamentDialog.vue";

export default {
  name: "Tournament",
  components: {AddTournamentDialog, MatchesSearch, AddMatchDialog },
  data() {
    return {
      tournamentId: null,
      tournament: null,
      showAddMatchDialog: false,
      showModifyTournamentDialog: false,
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
    openModifyTournamentDialog() {
      this.showModifyTournamentDialog = true;
    },
    closeModifyTournamentDialog() {
      this.showDialog = false
    }
  },
};
</script>

<style scoped>
</style>
