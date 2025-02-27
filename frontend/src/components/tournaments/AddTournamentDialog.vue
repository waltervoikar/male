<template>
  <v-dialog v-model="showAddTournamentDialog" max-width="500">
    <v-card>
      <v-card-title>
        <span class="headline">Lisa turniir</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="newTournament.name"
                label="Nimi*"
              />
            </v-col>
            <v-col cols="12">
              <v-autocomplete
                v-model="newTournament.location"
                :items="locationCache"
                :custom-filter="filterLocations"
                label="Toimumiskoht*"
                item-title="name"
                item-value="id"
                variant="outlined"
                hide-no-data
                clearable
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="newTournament.startDate"
                label="Algus*"
                type="date"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="newTournament.endDate"
                label="Lõpp"
                type="date"
                :rules="[isEndTimeValid]"
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
          @click="submitNewMatch"
          :disabled="!isFormValid"
        >
          Salvesta
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {addTournament} from "@/wrapper/tournamentsApiWrapper.js";
import {fetchAllLocations} from "@/wrapper/locationsApiWrapper.js";

export default {
  name: "AddTournamentDialog",
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showAddTournamentDialog: this.showDialog,
      newTournament: {
        name: null,
        location: null,
        startTime: null,
        endTime: null,
      },
      locationCache: [],
      endDateValid: null,
    };
  },
  computed: {
    isFormValid() {
      return (
        this.newTournament.name &&
        this.newTournament.location &&
        this.newTournament.startDate &&
        this.newTournament.endDate &&
        this.endDateValid
      );
    },
  },
  watch: {
    showDialog(val) {
      this.showAddTournamentDialog = val;
    },
    showAddTournamentDialog(val) {
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
      this.showAddTournamentDialog = false;
      this.resetForm();
    },
    resetForm() {
      this.newTournament = {
        name: null,
        location: null,
        startDate: null,
        endDate: null,
      };
    },
    async submitNewMatch() {
      const tournament = {
        name: this.newTournament.name,
        location: this.newTournament.location,
        startDate: this.newTournament.startDate,
        endDate: this.newTournament.endDate,
      };
      await addTournament(tournament);
      this.closeDialog();
      this.$emit("tournament-added", tournament);
    },
    isEndTimeValid(value) {
      if (!value) {
        this.endDateValid = true;
        return true;
      }
      const inputDate = new Date(value);
      const start = new Date(this.newTournament.startDate);
      if (this.newTournament.startDate && start > inputDate) {
        this.endDateValid = false;
        return "Turniiri lõpp ei saa olla enne algust";
      }
      this.endDateValid = true;
      return true;
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
