<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>Mängijad</h1>
      </v-col>
    </v-row>
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

      <v-col cols="12" sm="2">
        <v-select
          v-model="sortBy"
          :items="['Reiting', 'Nimi']"
          label="Järjesta"
        />
      </v-col>

      <v-col cols="12" sm="6" class="d-flex justify-end">
        <v-btn color="primary" @click="openAddPlayerDialog">Lisa uus mängija</v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        cols="12"
        v-for="player in filteredPlayers"
        :key="player.id"
        sm="6"
        md="4">
        <v-card
          class="mb-4"
          outlined
          hover
          @click="goToPlayerDetails(player.id)"
        >
          <v-card-title>{{ player.name }}</v-card-title>
          <v-card-subtitle>
            {{ player.club }}
          </v-card-subtitle>
          <v-card-text>
            <strong>Reiting:</strong> {{ player.ranking }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-pagination
          v-model="page"
          :length="pageCount"
        />
      </v-col>
    </v-row>
    <AddPlayerDialog
      :showDialog="showAddPlayerDialog"
      @player-added="fetchAllPlayersData"
      @update:showDialog="handleShowAddDialog"
    />
  </v-container>
</template>

<script>
import {fetchAllPlayers} from "@/wrapper/playersApiWrapper.js";
import AddPlayerDialog from "@/components/players/AddPlayerDialog.vue";

export default {
  components: {AddPlayerDialog},
  data() {
    return {
      players: [],
      searchName: '',
      resultsPerPage: 10,
      sortBy: "Reiting",
      page: 1,
      showAddPlayerDialog: false,
    }
  },

  created() {
    this.$watch(
      () => this.$route.params.id,
      this.fetchAllPlayersData,
      {immediate: true}
    )
  },

  methods: {
    async fetchAllPlayersData() {
      this.players = await fetchAllPlayers()
    },

    goToPlayerDetails(playerId) {
      this.$router.push(`/mangijad/${playerId}`)
    },

    openAddPlayerDialog() {
      this.showAddPlayerDialog = true;
    },

    handleShowAddDialog(value) {
      this.showAddPlayerDialog = value
    },
  },

  computed: {
    filteredPlayers() {
      let filtered = this.players.filter(player =>
        player.name.toLowerCase().includes(this.searchName.toLowerCase())
      )

      switch (this.sortBy) {
        case "Nimi":
          filtered.sort((a, b) => a.name.localeCompare(b.name))
          break
        case "Reiting":
          filtered.sort((a, b) => b.ranking - a.ranking)
          break
      }

      const startIndex = (this.page - 1) * this.resultsPerPage
      const endIndex = startIndex + this.resultsPerPage
      return filtered.slice(startIndex, endIndex)
    },
    totalFiltered() {
      return this.players.filter(player =>
        player.name.toLowerCase().includes(this.searchName.toLowerCase())
      ).length
    },
    pageCount() {
      return Math.ceil(this.totalFiltered / this.resultsPerPage)
    },
  },

  watch: {
    sortBy() {
      this.page = 1
    },
    resultsPerPage() {
      this.page = 1
    },
  },
}
</script>

<style scoped>

</style>
