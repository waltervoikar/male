<template>
  <v-container>
    <v-row v-if="player">
      <v-row class="mb-4">
        <v-col>
          <h1 class="mb-2">{{ player.name }}</h1>
          <h3>Klubi: {{ player.club }}</h3>
        </v-col>
      </v-row>
    </v-row>
    <v-row v-if="player">
      <v-col>
        <v-btn color="primary" @click="openModifyPlayerDialog">Muuda mängijat</v-btn>
      </v-col>
    </v-row>
  </v-container>
  <PlayerStatistics v-if="player" :player-id="player.id"/>
  <v-container v-else>
    <h2>Mängijat ei leitud</h2>
    <p>Vabandame, antud mängijat ei eksisteeri või on andmed puudulikud.</p>
    <v-btn color="primary"
           @click="this.$router.push('/mangijad')"
    >
      Tagasi mängijate lehele
    </v-btn>
  </v-container>
  <AddPlayerDialog v-if="showModifyPlayerDialog"
                   :showDialog="showModifyPlayerDialog"
                   :is-update="true"
                   :player-id="player.id"
                   @update:showDialog="updateShowModifyPlayerDialog"
                   @player-updated="updatePlayer"
  />
</template>

<script>
import {fetchPlayerById} from "@/wrapper/playersApiWrapper.js";
import PlayerStatistics from "@/components/players/PlayerStatistics.vue";
import AddPlayerDialog from "@/components/players/AddPlayerDialog.vue";

export default {
  name: "PlayerInfo",
  components: {PlayerStatistics, AddPlayerDialog},
  data() {
    return {
      player: null,
      playerId: null,
      showModifyPlayerDialog: false,
    }
  },

  methods: {
    async fetchPlayerData() {
      this.loading = true;
      this.error = null;
      try {
        this.player = await fetchPlayerById(this.playerId)
      } catch (error) {
        this.error = "Viga mängija info laadimisel";
        console.error("Viga mängija info laadimisel:", error);
      } finally {
        this.loading = false;
      }
    },

    openModifyPlayerDialog() {
      this.showModifyPlayerDialog = true;
    },

    updateShowModifyPlayerDialog(value) {
      this.showModifyPlayerDialog = value;
    },

    updatePlayer() {
      this.player = this.fetchPlayerData()
    },
  },

  created() {
    this.playerId = this.$route.params.id
    this.$watch(
      () => this.$route.params.id,
      this.fetchPlayerData,
      {immediate: true}
    )
  },

}
</script>

<style scoped>

</style>
