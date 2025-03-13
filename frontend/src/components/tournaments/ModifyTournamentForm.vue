<template>
  <v-card>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="newTournament.name"
              label="Nimi*"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-autocomplete
              v-model="newTournament.location"
              :items="locationCache"
              :custom-filter="filterLocations"
              label="Toimumiskoht*"
              item-title="name"
              item-value="name"
              variant="outlined"
              hide-no-data
              clearable
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="newTournament.startDate"
              label="Algus*"
              type="date"
            />
          </v-col>
          <v-col cols="12" sm="6">
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
      <DeleteButtonWithAlert
        button-text="Kustuta turniir"
        @nuke-confirmed="nukeTournament"
      />
      <v-btn
        variant="elevated"
        color="primary"
        @click="submitNewTournament"
        :disabled="!isFormValid"
      >
        Salvesta
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import {addTournament, fetchTournamentById, removeTournament} from "@/wrapper/tournamentsApiWrapper.js";
import {fetchAllLocations} from "@/wrapper/locationsApiWrapper.js";
import DeleteButtonWithAlert from "@/components/DeleteButtonWithAlert.vue";

export default {
  name: "ModifyTournamentForm",
  components: {DeleteButtonWithAlert},
  props: {
    tournamentId: {
      type: String,
      required: true,
    }
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
    this.loadTournamentData();
  },
  methods: {
    async loadLocationsCache() {
      this.locationCache = await fetchAllLocations();
    },
    async loadTournamentData() {
      const tournament = await fetchTournamentById(this.tournamentId)

      this.newTournament = {
        name: tournament.name,
        location: tournament.location,
        startDate: new Date(tournament.startDate).toISOString().split('T')[0],
        endDate: new Date(tournament.endDate).toISOString().split('T')[0],
      }
    },
    async submitNewTournament() {
      const tournament = {
        name: this.newTournament.name,
        location: this.newTournament.location,
        startDate: this.newTournament.startDate,
        endDate: this.newTournament.endDate,
        isUpdate: true,
        tournamentId: this.tournamentId,
      };
      await addTournament(tournament);
      this.$emit("tournament-updated", tournament);
    },
    async nukeTournament() {
      await removeTournament(this.tournamentId)
      this.$router.push("/turniirid")
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
