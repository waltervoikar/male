<template>
  <v-container fluid class="mt-4">
    <v-row class="mb-4">
      <v-col cols="12" sm="3">
        <v-text-field
          v-model="searchName"
          label="Otsi nime järgi"
          clearable
        />
      </v-col>

      <v-col cols="12" sm="1">
        <v-select
          v-model="resultsPerPage"
          :items="[10, 20, 50]"
          label="Tulemusi lehel"
          :menu-props="{ maxHeight: 200 }"
        />
      </v-col>

      <v-col cols="12" sm="4">
        <v-select
          v-model="displayTournaments"
          :items="['Käimas', 'Tulevased', 'Lõppenud']"
          label="Näita"
          multiple
        />
      </v-col>

      <v-col cols="12" sm="4" class="d-flex justify-end">
        <v-btn color="primary" @click="openAddTournamentDialog">Lisa uus turniir</v-btn>
      </v-col>
    </v-row>

    <TournamentDisplay v-for="(tournamentType) in displayTournaments"
                       :tournaments="getTournamentsForType(tournamentType)"
    />

    <AddTournamentDialog
      v-model:showDialog="showAddTournamentDialog"
      @update:showDialog="updateShowAddTournamentDialog"
      @tournament-updated="handleTournamentUpdate"
    />
  </v-container>
</template>

<script>
import {fetchAllTournaments} from "@/wrapper/tournamentsApiWrapper.js";
import AddTournamentDialog from "@/components/tournaments/AddTournamentDialog.vue";
import TournamentDisplay from "@/components/tournaments/TournamentDisplay.vue";

export default {
  name: 'TournamentsPage',
  components: {TournamentDisplay, AddTournamentDialog },
  data() {
    return {
      onGoingTournaments: {
        headerText: "Hetkel toimumas:",
        noTournamentsText: "Hetkel pole ühtegi turniiri toimumas",
        tournaments: [],
      },
      upcomingTournaments: {
        headerText: "Tulevased turniirid:",
        noTournamentsText: "Hetkel pole ühtei turniiri tulemas",
        tournaments: [],
      },
      finishedTournaments: {
        headerText: "Lõppenud turniirid:",
        noTournamentsText: "Lõppenud turniirid puuduvad",
        tournaments: [],
      },
      showAddTournamentDialog: false,
      searchName: "",
      resultsPerPage: 10,
      displayTournaments: ["Käimas"],
    }
  },

  methods: {
    async fetchTournaments() {
      let allTournaments = await fetchAllTournaments()
      let today = new Date()
      allTournaments.map(tournament => {
        let tournamentStartDate = Date.parse(tournament.startDate)
        let tournamentEndDate = Date.parse(tournament.endDate)

        if (tournamentStartDate < today && tournamentEndDate > today) {
          this.onGoingTournaments.tournaments.push(tournament)
        } else if (tournamentStartDate > today) {
          this.upcomingTournaments.tournaments.push(tournament)
        } else {
          this.finishedTournaments.tournaments.push(tournament)
        }
      })
    },

    getTournamentsForType(tournamentType) {
      switch (tournamentType) {
        case 'Käimas': return this.onGoingTournaments;
        case 'Tulevased': return this.upcomingTournaments;
        case 'Lõppenud': return this.finishedTournaments;
        default: return [];
      }
    },

    openAddTournamentDialog() {
      this.showAddTournamentDialog = true;
    },

    updateShowAddTournamentDialog(value) {
      this.showAddTournamentDialog = value;
    },

    handleTournamentUpdate() {
      this.showAddTournamentDialog = false;
      this.fetchTournaments();
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
