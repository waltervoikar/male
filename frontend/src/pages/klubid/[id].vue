<template>
  <v-container>
    <div v-if="club">
      <h1 class="club-title">{{ club.name }}</h1>
      <v-row dense>
        <v-col cols="12" md="6" lg="4">
          <v-card outlined>
            <v-card-title>{{ club.location }}</v-card-title>
            <v-card-text>
              ASUKOHT
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6" lg="4">
          <v-card outlined>
            <v-card-title>{{ club.membersCount }}</v-card-title>
            <v-card-text>
              MÄNGIJAID
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6" lg="4">
          <v-card outlined>
            <v-card-title>{{ club.averageRating }}</v-card-title>
            <v-card-text>
              KESKMINE REITING
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row cols="12">
        <v-col>
          <v-divider :thickness="3"></v-divider>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <PlayersSearchTable :club-id="clubId" />
        </v-col>
      </v-row>

    </div>
    <div v-else>
      <h2>Klubi ei leitud</h2>
      <p>Vabandame, antud klubi ei eksisteeri või on andmed puudulikud.</p>
      <v-btn color="primary"
             @click="this.$router.push('/klubid')">
        Tagasi klubide lehele
      </v-btn>
    </div>
  </v-container>
</template>

<script>
import {fetchClubById} from "@/wrapper/clubsApiWrapper.js";
import PlayersSearchTable from "@/components/clubs/PlayersSearchTable.vue";

export default {
  name: 'ClubDetailsPage',
  components: {
    PlayersSearchTable
  },
  data() {
    return {
      club: null,
      clubId: null,
    }
  },
  created() {
    this.clubId = this.$route.params.id;
    this.$watch(
      () => this.$route.params.id,
      this.fetchClubData,
      {immediate: true}
    )
  },
  methods: {
    async fetchClubData() {
      this.club = await fetchClubById(this.clubId)
    },
  }

}
</script>

<style scoped>
.club-title {
  margin-bottom: 1.5rem;
  font-size: 2rem;
  font-weight: bold;
}

</style>
