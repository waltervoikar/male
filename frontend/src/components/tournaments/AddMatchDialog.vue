<template>
  <v-dialog v-model="showAddMatchDialog" max-width="500">
    <v-card>
      <v-card-title>
        <span class="headline">Lisa partii</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-autocomplete
                v-model="newMatch.white"
                :items="playersCache"
                :custom-filter="filterPlayers"
                label="Valge*"
                item-title="name"
                item-value="id"
                variant="outlined"
                hide-no-data
                clearable
                :error="isSamePlayer"
                :error-messages="isSamePlayer ? ['Valge ja must mängija ei tohi olla samad'] : []"
              />
            </v-col>
            <v-col cols="12">
              <v-autocomplete
                v-model="newMatch.black"
                :items="playersCache"
                :custom-filter="filterPlayers"
                label="Must*"
                item-title="name"
                item-value="id"
                variant="outlined"
                hide-no-data
                clearable
                :error="isSamePlayer"
                :error-messages="isSamePlayer ? ['Valge ja must mängija ei tohi olla samad'] : []"
              />
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="newMatch.winner"
                label="Võitja*"
                :items="['Valge', 'Must', 'Viik']"
                variant="outlined"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="newMatch.startTime"
                label="Algus*"
                type="datetime-local"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="newMatch.endTime"
                label="Lõpp"
                type="datetime-local"
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
          :disabled="!isFormValid || isSamePlayer"
        >
          Salvesta
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { fetchAllPlayers } from "@/wrapper/playersApiWrapper.js";
import { addMatchToTournament } from "@/wrapper/matchesApiWrapper.js";

export default {
  name: "AddMatchDialog",
  props: {
    tournamentId: {
      type: String,
      required: true,
    },
    showDialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showAddMatchDialog: this.showDialog,
      newMatch: {
        white: null,
        black: null,
        startTime: null,
        endTime: null,
        winner: null,
      },
      playersCache: [],
      endTimeValid: null,
    };
  },
  computed: {
    isFormValid() {
      return (
        this.newMatch.white &&
        this.newMatch.black &&
        this.newMatch.startTime &&
        this.newMatch.winner &&
        this.endTimeValid
      );
    },
    isSamePlayer() {
      return (
        this.newMatch.white &&
        this.newMatch.black &&
        this.newMatch.white === this.newMatch.black
      );
    },
  },
  watch: {
    showDialog(val) {
      this.showAddMatchDialog = val;
    },
    showAddMatchDialog(val) {
      this.$emit("update:showDialog", val);
    },
  },
  created() {
    this.loadPlayersCache();
  },
  methods: {
    async loadPlayersCache() {
      this.playersCache = await fetchAllPlayers();
    },
    closeDialog() {
      this.showAddMatchDialog = false;
      this.resetForm();
    },
    resetForm() {
      this.newMatch = {
        white: null,
        black: null,
        startTime: null,
        endTime: null,
        winner: null,
      };
    },
    async submitNewMatch() {
      const match = {
        white: this.newMatch.white,
        black: this.newMatch.black,
        startTime: this.newMatch.startTime,
        endTime: this.newMatch.endTime,
        winner: this.newMatch.winner,
        tournamentId: this.tournamentId,
      };
      await addMatchToTournament(match);
      this.closeDialog();
      this.$emit("match-added", match);
    },
    isEndTimeValid(value) {
      if (!value) {
        this.endTimeValid = true;
        return true;
      }
      const now = new Date();
      const inputDate = new Date(value);
      const start = new Date(this.newMatch.startTime);
      if (inputDate > now) {
        this.endTimeValid = false;
        return "Partii lõppaeg ei saa olla tulevikus";
      }
      if (this.newMatch.startTime && start > inputDate) {
        this.endTimeValid = false;
        return "Partii lõppaeg ei saa olla enne algusaega";
      }
      this.endTimeValid = true;
      return true;
    },
    filterPlayers(itemTitle, queryText, item) {
      const name = item.raw.name.toLowerCase();
      const searchText = queryText.toLowerCase();
      return name.indexOf(searchText) > -1;
    },
  },
};
</script>

<style scoped>
</style>
