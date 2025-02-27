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
                v-model="newClub.name"
                label="Nimi*"
              />
            </v-col>
            <v-col cols="12">
              <v-autocomplete
                v-model="newClub.location"
                :items="locationCache"
                :custom-filter="filterLocations"
                label="Asukoht*"
                item-title="name"
                item-value="id"
                variant="outlined"
                hide-no-data
                clearable
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
          @click="submitNewClub"
          :disabled="!isFormValid"
        >
          Salvesta
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {fetchAllLocations} from "@/wrapper/locationsApiWrapper.js";
import {addClub} from "@/wrapper/clubsApiWrapper.js";

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
      newClub: {
        name: null,
        location: null,
      },
      locationCache: [],
    };
  },
  computed: {
    isFormValid() {
      return (
        this.newClub.name &&
        this.newClub.location
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
      this.locationCache = await fetchAllLocations();
    },
    closeDialog() {
      this.showAddClubDialog = false;
      this.resetForm();
    },
    resetForm() {
      this.newClub = {
        name: null,
        location: null,
      };
    },
    async submitNewClub() {
      const club = {
        name: this.newClub.name,
        location: this.newClub.location,
      };
      await addClub(club);
      this.closeDialog();
      this.$emit("club-added", club);
    },
    filterLocations(itemTitle, queryText, item) {
      const name = item.raw.name.toLowerCase();
      const searchText = queryText.toLowerCase();
      return name.indexOf(searchText) > -1;
    },
  },
};
</script>

<style scoped>
</style>
