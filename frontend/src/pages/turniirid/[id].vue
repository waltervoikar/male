<template>
  <v-container>
    <v-row v-if="tournament" class="mb-4">
      <v-col>
        <h1 class="mb-2"><a href="/turniirid">Turniirid</a> / {{ tournament.name }}</h1>
      </v-col>
    </v-row>
    <v-row v-if="tournament">
      <v-col>
        <ModifyTournamentForm
          :tournament-id="tournamentId"
          @tournament-updated="fetchTournament"
        />
      </v-col>
    </v-row>
    <v-row cols="12">
      <v-col>
        <v-divider :thickness="3"></v-divider>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <MatchesSearch :tournamentId="tournamentId" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import MatchesSearch from "@/components/tournaments/MatchesSearch.vue";
import AddMatchDialog from "@/components/tournaments/AddMatchDialog.vue";
import { fetchTournamentById } from "@/wrapper/tournamentsApiWrapper.js";
import AddTournamentDialog from "@/components/tournaments/AddTournamentDialog.vue";
import ModifyTournamentForm from "@/components/tournaments/ModifyTournamentForm.vue";

export default {
  name: "Tournament",
  components: {ModifyTournamentForm, AddTournamentDialog, MatchesSearch, AddMatchDialog },
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
    updateShowModifyTournamentDialog(value) {
      this.showDialog = value
    }
  },
};
</script>

<style scoped>
</style>
