<template>
  <v-dialog v-model="showAddClubDialog" max-width="500">
    <v-card>
      <v-card-title>
        <span class="headline">Lisa uus klubi</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="newPlayer.firstName"
                label="Eesnimi*"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="newPlayer.lastName"
                label="Perenimi*"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="newPlayer.idCode"
                label="Isikukood*"
              />
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="newPlayer.gender"
                label="Sugu*"
                :items="['Mees', 'Naine', 'Muu']"
                variant="outlined"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="newPlayer.dateOfBirth"
                label="Sünniaeg*"
                type="date"
                :rules="[isDateOfBirthValid]"
              />
            </v-col>
            <v-col cols="12">
              <v-autocomplete
                v-model="newPlayer.club"
                :items="clubCache"
                :custom-filter="filterClubs"
                label="Klubi"
                item-title="name"
                item-value="id"
                variant="outlined"
                hide-no-data
                clearable
              />
            </v-col>
            <v-col cols="12">
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
        <v-btn variant="tonal" @click="closeDialog">Tühista</v-btn>
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
  </v-dialog>
</template>

<script>
import {fetchAllClubs} from "@/wrapper/clubsApiWrapper.js";
import {addPlayer} from "@/wrapper/playersApiWrapper.js";

export default {
  name: "AddClubDialog",
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showAddClubDialog: this.showDialog,
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
  watch: {
    showDialog(val) {
      this.showAddClubDialog = val;
    },
    showAddClubDialog(val) {
      this.$emit("update:showDialog", val);
    },
  },
  created() {
    this.loadLocationsCache();
  },
  methods: {
    async loadLocationsCache() {
      this.clubCache = await fetchAllClubs();
    },

    closeDialog() {
      this.showAddClubDialog = false;
      this.resetForm();
    },

    resetForm() {
      this.newPlayer = {
        name: null,
        location: null,
      };
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
      };
      await addPlayer(player);
      this.closeDialog();
      this.$emit("player-added", player);
    },

    filterClubs(itemTitle, queryText, item) {
      const name = item.raw.name.toLowerCase();
      const searchText = queryText.toLowerCase();
      return name.indexOf(searchText) > -1;
    },

    resolveGender() {
      switch (this.newPlayer.gender) {
        case 'Mees': return 'm';
        case 'Naine': return 'n';
        default: return 'o'
      }
    },

    isDateOfBirthValid() {

    },
  },
};
</script>

<style scoped>
</style>
