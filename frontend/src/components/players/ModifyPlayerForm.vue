<template>
  <v-card>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="newPlayer.firstName"
              label="Eesnimi"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="newPlayer.lastName"
              label="Perenimi"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="newPlayer.idCode"
              label="Isikukood"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <v-select
              v-model="newPlayer.gender"
              label="Sugu"
              :items="['Mees', 'Naine', 'Muu']"
              variant="outlined"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="newPlayer.dateOfBirth"
              label="Sünniaeg"
              type="date"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <v-autocomplete
              v-model="newPlayer.club"
              :items="clubCache"
              :custom-filter="filterClubs"
              label="Klubi"
              item-title="name"
              item-value="name"
              variant="outlined"
              hide-no-data
              clearable
            />
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="newPlayer.ranking"
              label="Reiting"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <DeleteButtonWithAlert
        button-text="Kustuta mängija"
        @nuke-confirmed="nukePlayer"
      />
      <v-btn
        variant="elevated"
        color="primary"
        @click="submitNewPlayer"
        :disabled="!isFormValid"
      >
        Salvesta
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import {fetchAllClubs} from "@/wrapper/clubsApiWrapper.js";
import {addPlayer, fetchPlayerById, removePlayer} from "@/wrapper/playersApiWrapper.js";
import DeleteButtonWithAlert from "@/components/DeleteButtonWithAlert.vue";

export default {
  name: "ModifyPlayerForm",
  components: {DeleteButtonWithAlert},
  props: {
    isUpdate: {
      type: Boolean,
      default: false,
    },
    playerId: {
      type: Number,
      default: null,
    }
  },
  data() {
    return {
      newPlayer: {
        firstName: null,
        lastName: null,
        idCode: null,
        club: null,
        dateOfBirth: null,
        gender: null,
        ranking: null,
      },
      clubCache: [],
    };
  },
  computed: {
    isFormValid() {
      return (
        this.newPlayer.firstName &&
        this.newPlayer.lastName &&
        this.newPlayer.idCode &&
        this.newPlayer.gender &&
        this.newPlayer.dateOfBirth
      );
    },
  },
  created() {
    this.loadLocationsCache();
    if (this.isUpdate && this.playerId) {
      this.loadPlayerDataForUpdate()
    }
  },
  methods: {
    async loadLocationsCache() {
      this.clubCache = await fetchAllClubs();
    },

    async loadPlayerDataForUpdate() {
      this.newPlayer = await fetchPlayerById(this.playerId)
      this.newPlayer.gender = this.resolveGenderForUpdate(this.newPlayer.gender)
    },

    async nukePlayer() {
      await removePlayer(this.playerId)
      this.$router.push("/mangijad")
    },

    async submitNewPlayer() {
      const player = {
        firstName: this.newPlayer.firstName,
        lastName: this.newPlayer.lastName,
        idCode: this.newPlayer.idCode,
        club: this.newPlayer.club,
        dateOfBirth: this.newPlayer.dateOfBirth,
        gender: this.resolveGender(),
        ranking: this.newPlayer.ranking,
        isUpdate: this.isUpdate,
        playerId: this.playerId,
      };
      await addPlayer(player);
      this.$emit("player-updated");
    },

    filterClubs(itemTitle, queryText, item) {
      const name = item.raw.name.toLowerCase();
      const searchText = queryText.toLowerCase();
      return name.indexOf(searchText) > -1;
    },

    resolveGender() {
      switch (this.newPlayer.gender) {
        case 'Mees':
          return 'm';
        case 'Naine':
          return 'n';
        default:
          return 'o';
      }
    },
    resolveGenderForUpdate() {
      switch (this.newPlayer.gender) {
        case 'M':
          return 'Mees';
        case 'N':
          return 'Naine';
        default:
          return 'Muu';
      }
    },
  },
};
</script>

<style scoped>
</style>
