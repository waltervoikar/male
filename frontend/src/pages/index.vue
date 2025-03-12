<template>
  <v-container>
    <v-row class="mb-4">
      <v-col cols="12">
        <h1>Hetkel toimumas:</h1>
        <TournamentDisplay
          :tournaments="ongoingTournaments"
          no-tournaments-text="Hetkel pole ühtegi turniiri toimumas"
        />
      </v-col>
    </v-row>


    <v-row class="mb-4">
      <v-col cols="12">
        <h1>Hetkel käimasolevad partiid:</h1>
        <v-row v-if="ongoingMatches.length">
          <v-col cols="12" md="6" lg="4" v-for="match in ongoingMatches" :key="match.id">
            <v-card class="mb-2">
              <v-card-title class="tournament-title">{{ match.tournament }}</v-card-title>
              <v-card-text class="player-names d-flex align-end">
                <img :src="whitePawn" alt="Black Pawn" class="pawn-icon mr-2" />{{ match.black.fullName }} -
                {{ match.white.fullName }}<img :src="blackPawn" alt="White Pawn" class="pawn-icon ml-2" />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row v-else class="mb-4">
          <v-col cols="12">
            Hetkel ei ole ühtegi partiid käimas
          </v-col>
        </v-row>
      </v-col>
    </v-row>


    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <h2>TOP mängijad</h2>
        <v-row>
          <v-col cols="10" v-for="(player, index) in topPlayers" :key="player.id">
            <v-card>
              <v-card-title>
                <v-row align="center">
                  <v-col cols="8">
                    <v-chip :color="getChipColor(index)" class="ma-2" label>{{ index + 1 }}</v-chip>
                    {{ player.name }}
                  </v-col>
                  <v-col cols="4" class="text-right points">
                    {{ player.ranking }}
                  </v-col>
                </v-row>
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" md="6">
        <h2>TOP Klubid</h2>
        <v-row>
          <v-col cols="10" v-for="(club, index) in topClubs" :key="club.id">
            <v-card>
              <v-card-title>
                <v-row align="center">
                  <v-col cols="8">
                    <v-chip :color="getChipColor(index)" class="ma-2" label>{{ index + 1 }}</v-chip>
                    {{ club.name }}
                  </v-col>
                  <v-col cols="4" class="text-right points">
                    {{ club.averageRating }}
                  </v-col>
                </v-row>
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import blackPawn from '@/assets/black-pawn.svg';
import whitePawn from '@/assets/white-pawn.svg';
import TournamentDisplay from "@/components/tournaments/TournamentDisplay.vue";
import {fetchOngoingTournaments} from "@/wrapper/tournamentsApiWrapper.js";
import {fetchTopPlayers} from "@/wrapper/playersApiWrapper.js";
import {fetchTopClubs} from "@/wrapper/clubsApiWrapper.js";
import {fetchOngoingMatches} from "@/wrapper/matchesApiWrapper.js";

export default {
  name: 'FrontPage',
  components: {TournamentDisplay},
  data() {
    return {
      ongoingTournaments: [],
      ongoingMatches: [],
      topPlayers: [],
      topClubs: [],
      blackPawn,
      whitePawn,
    };
  },
  methods: {
    getChipColor(index) {
      switch (index) {
        case 0:
          return 'gold';
        case 1:
          return 'silver';
        case 2:
          return 'bronze';
        default:
          return 'primary';
      }
    },

    loadData() {
      this.loadOngoingTournaments()
      this.loadOngoingMatches()
      this.loadTopPlayers()
      this.loadTopClubs()
    },

    async loadOngoingTournaments() {
      this.ongoingTournaments = await fetchOngoingTournaments()
    },

    async loadOngoingMatches() {
      this.ongoingMatches = await fetchOngoingMatches()
    },

    async loadTopPlayers() {
      this.topPlayers = await fetchTopPlayers(3)
    },

    async loadTopClubs() {
      this.topClubs = await fetchTopClubs(3)
    },
  },

  created() {
    this.$watch(
      () => this.$route.params.id,
      this.loadData,
      {immediate: true}
    )
  },
};
</script>

<style scoped>
h1, h2 {
  margin-bottom: 20px;
}

.mb-4 {
  margin-bottom: 32px;
}

.points {
  font-size: 1.1rem;
  color: #9AA6B2;
}

.tournament-title {
  font-size: 0.9rem;
  color: #9AA6B2;
}

.player-names {
  font-size: 1.2rem;
  font-weight: bold;
  padding-bottom: 8px;
}

.pawn-icon {
  width: 24px;
  height: 24px;
}
</style>
