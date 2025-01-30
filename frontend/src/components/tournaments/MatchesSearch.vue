<template>
  <v-container fluid class="mt-4">
    <v-data-table
      :headers="headers"
      :items="matches"
      :search="searchName"
      no-data-text="Partiisid ei leitud"
      item-key="id"
      class="elevation-1"
    >
      <!-- Search bar integrated into the data table toolbar -->
      <template v-slot:top>
        <v-toolbar flat dense color="secondary">
          <v-toolbar-title>Partiid</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="searchName"
            label="Otsi mängija nime järgi"
            clearable
            dense
            outlined
            hide-details
            style="max-width: 300px;"
          />
        </v-toolbar>
      </template>

      <template v-slot:item.action="{ item }">
        <v-row align="center" justify="end">
          <v-btn
            color="secondary"
            @click.stop="openMatchDialog(item)"
          >
            Detailid
          </v-btn>
        </v-row>
      </template>
    </v-data-table>

    <!-- Partii detailide dialoog -->
    <v-dialog
      v-model="showDialog"
      max-width="600"
    >
      <v-card v-if="selectedMatch">
        <v-card-title>
          <strong>{{ selectedMatch.white.fullName }}</strong> vs <strong>{{ selectedMatch.black.fullName }}</strong>
        </v-card-title>

        <v-card-subtitle>
          {{ selectedMatch.white.club }} | {{ selectedMatch.black.club }}
        </v-card-subtitle>

        <v-card-text>
          {{ selectedMatch.description }}
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="dark" text @click="closeMatchDialog">
            Sulge
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { fetchMatchesByTournamentId } from "@/wrapper/matchesApiWrapper.js";

export default {
  data() {
    return {
      headers: [
        {title: 'Valge', value: 'white.fullName', sortable: true},
        {title: 'Must', value: 'black.fullName', sortable: true},
        {title: 'Algus', value: 'startTime', sortable: true},
        {title: 'Lõpp', value: 'endTime', sortable: true},
        {title: 'Lõppenud', value: 'isEnded', sortable: true},
        {value: 'action', sortable: false},
      ],
      matches: [],
      searchName: '',
      showDialog: false,
      selectedMatch: null,
    }
  },

  props: {
    tournamentId: {
      type: String,
      required: true,
    }
  },

  created() {
    this.$watch(
      () => this.$route.params.id,
      this.fetchAllMatchesData,
      {immediate: true}
    )
  },

  methods: {
    async fetchAllMatchesData() {
      this.matches = await fetchMatchesByTournamentId(this.tournamentId)
    },

    openMatchDialog(match) {
      this.selectedMatch = match
      this.showDialog = true
    },

    closeMatchDialog() {
      this.showDialog = false
      this.selectedMatch = null
    },
  }
}
</script>

<style scoped>

</style>
