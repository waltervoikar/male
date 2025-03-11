<template>
    <v-data-table
      :headers="headers"
      :items="players"
      :search="searchName"
      no-data-text="Mängijaid ei leitud"
      item-key="id"
      class="elevation-1"
    >
      <!-- Search bar integrated into the data table toolbar -->
      <template v-slot:top>
        <v-toolbar flat dense color="secondary">
          <v-spacer></v-spacer>
          <v-text-field
            v-model="searchName"
            label="Otsi mängijat nime järgi"
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
            @click.stop="openPlayerDialog(item)"
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
      <v-card v-if="selectedPlayer">
        <v-card-title>
          {{ selectedPlayer.name }}
        </v-card-title>

        <v-card-subtitle>
          {{ selectedPlayer.ranking }}
        </v-card-subtitle>

        <v-card-text>
          Sugu: {{ selectedPlayer.gender }}
          <br>
          Sünniaeg: {{ selectedPlayer.dateOfBirth }}
          <br>
          <v-btn color="primary"
                 class="player-page-button"
                 @click="this.$router.push(`/mangijad/${selectedPlayer.id}`)">
            Mängija lehele
          </v-btn>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="dark" @click="closePlayerDialog">
            Sulge
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import {fetchPlayersByClubId} from "@/wrapper/playersApiWrapper.js";

export default {
  data() {
    return {
      headers: [
        {title: 'Nimi', value: 'name', sortable: true},
        {title: 'Reiting', value: 'ranking', sortable: true},
        {value: 'action', sortable: false},
      ],
      players: [],
      searchName: '',
      showDialog: false,
      selectedPlayer: null,
    }
  },

  props: {
    clubId: {
      type: String,
      required: true,
    }
  },

  created() {
    this.$watch(
      () => this.$route.params.id,
      this.fetchPlayersData,
      {immediate: true}
    )
  },

  methods: {
    async fetchPlayersData() {
      this.players = await fetchPlayersByClubId(this.clubId)
    },

    openPlayerDialog(match) {
      this.selectedPlayer = match
      this.showDialog = true
    },

    closePlayerDialog() {
      this.showDialog = false
      this.selectedPlayer = null
    },
  }
}
</script>

<style scoped>
.player-page-button {
  margin-top: 3em;
}

</style>
