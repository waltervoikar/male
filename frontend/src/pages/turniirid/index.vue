<template>
  <v-container fluid class="mt-4">
    <v-row class="mb-4">
      <v-col>
        <v-btn color="primary" @click="openAddTournamentDialog">Lisa turniir</v-btn>
      </v-col>
    </v-row>
    <h2 class="mb-2">Hetkel toimumas:</h2>
    <TournamentDisplay
      :tournaments="onGoingTournaments"
      no-tournaments-text="Hetkel pole ühtegi turniiri toimumas"
    />

    <h2 class="mb-2">Tulemas:</h2>
    <TournamentDisplay
      :tournaments="upcomingTournaments"
      no-tournaments-text="Hetkel pole ühtegi turniiri tulemas"
    />

    <h2 class="mb-2">Lõppenud:</h2>
    <TournamentDisplay
      :tournaments="finishedTournaments"
      no-tournaments-text="Hetkel pole ühtegi turniiri lõppenud"
    />

    <AddTournamentDialog
      v-model:showDialog="showAddTournamentDialog"
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
      onGoingTournaments: [],
      upcomingTournaments: [],
      finishedTournaments: [],
      showAddTournamentDialog: false,
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

    openAddTournamentDialog() {
      this.showAddTournamentDialog = true;
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
