<template>
  <v-container fluid class="mt-4">
    <v-row class="mb-4">
      <v-col cols="12" sm="4">
        <v-text-field
          v-model="searchName"
          label="Otsi nime järgi"
          clearable
        />
      </v-col>

      <v-col cols="12" sm="4">
        <v-select
          v-model="resultsPerPage"
          :items="[5, 10, 20, 50]"
          label="Tulemusi lehel"
          :menu-props="{ maxHeight: 200 }"
        />
      </v-col>

      <v-col cols="12" sm="4">
        <v-select
          v-model="sortBy"
          :items="['Reiting', 'Nimi']"
          label="Järjesta"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card
          v-for="player in filteredPlayers"
          :key="player.id"
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
      <v-col cols="6">
        <v-pagination
          v-model="page"
          :length="pageCount"
        />
      </v-col>

      <v-col cols="6" class="text-right">
        <span>
          Näitan tulemusi {{ startIndex }}–{{ endIndex }}
          (kokku {{ totalFiltered }})
        </span>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
import {fetchAllPlayers} from "@/wrapper/playersApiWrapper.js";

export default {
  data() {
    return {
      players: [],
      searchName: '',
      resultsPerPage: 5,
      sortBy: "Reiting",
      page: 1,
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
    startIndex() {
      return (this.page - 1) * this.resultsPerPage + 1
    },
    endIndex() {
      const end = this.page * this.resultsPerPage
      return end > this.totalFiltered ? this.totalFiltered : end
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
