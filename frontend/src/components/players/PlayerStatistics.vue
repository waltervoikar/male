<template>
  <h2>Mängija statistika</h2>
  <v-container>

    <v-row justify="center" align="center" v-if="loading">
      <v-col cols="12" class="text-center">
        <v-progress-circular
            indeterminate
            color="primary"
            size="64"
        ></v-progress-circular>
        <div class="mt-4">Laen statistikat...</div>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="12">
        <v-row>
          <v-col cols="12" sm="6" md="3">
            <v-card class="pa-4" outlined>
              <v-card-title class="headline">Pikim partii</v-card-title>
              <v-card-text>
                {{ longestMatch }}
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-card class="pa-4" outlined>
              <v-card-title class="headline">Võiduprotsent</v-card-title>
              <v-card-text>
                {{ winPercent }}
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-card class="pa-4" outlined>
              <v-card-title class="headline">Võiduprotsent hommikul</v-card-title>
              <v-card-text>
                {{ winPercentMorning }}
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-card class="pa-4" outlined>
              <v-card-title class="headline">Võiduprotsent õhtul</v-card-title>
              <v-card-text>
                {{ winPercentEvening }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" md="4">
        <PlayerGamesPieChart
            chart-title="Üldine"
            :total-games-played="playerStatistics.match_count"
            :wins="playerStatistics.win_count"
            :losses="playerStatistics.match_count - playerStatistics.win_count"
        />
      </v-col>

      <v-col cols="12" md="4">
        <PlayerGamesPieChart
            chart-title="Valgega"
            :total-games-played="playerStatistics.white_match_count"
            :wins="playerStatistics.white_win_count"
            :losses="playerStatistics.white_match_count - playerStatistics.white_win_count"
        />
      </v-col>

      <v-col cols="12" md="4">
        <PlayerGamesPieChart
            chart-title="Mustaga"
            :total-games-played="playerStatistics.black_match_count"
            :wins="playerStatistics.black_win_count"
            :losses="playerStatistics.black_match_count - playerStatistics.black_win_count"
        />
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import PlayerGamesPieChart from "@/components/players/PlayerGamesChart.vue";
import {fetchPlayerStatistics} from "@/wrapper/playersApiWrapper.js";

export default {
  components: {
    PlayerGamesPieChart
  },

  props: {
    playerId: {
      type: Number,
      default: null,
      required: true,
    },
  },

  computed: {
    winPercent() {
      const wins = Number(this.playerStatistics.win_count);
      const matches = Number(this.playerStatistics.match_count);
      if (matches === 0) {
        return "-"
      }
      const winPercent = (wins / matches) * 100
      return winPercent.toFixed(2) + '%'
    },

    winPercentMorning() {
      return "-"
    },

    winPercentEvening() {
      return "-"
    },

    longestMatch() {
      const longestMatch = this.playerStatistics.longest_match
      if (longestMatch === null) {
        return "-"
      }
      return longestMatch
    }
  },

  data() {
    return {
      loading: true,
      playerStatistics: null,
    }
  },

  methods: {
    async fetchStatistics() {
      this.loading = true;
      this.error = null;
      try {
        this.playerStatistics = await fetchPlayerStatistics(this.playerId)
      } catch (error) {
        this.error = "Viga mängija statistika laadimisel";
        console.error("Viga mängija statistika laadimisel:", error);
      } finally {
        this.loading = false;
      }
    },
  },

  created() {
    this.$watch(
        () => this.$route.params.id,
        this.fetchStatistics,
        { immediate: true }
    );
  },
}

</script>

<style scoped>
</style>
