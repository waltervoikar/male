<template>
  <v-dialog v-model="showAddMatchDialog" max-width="500">
    <v-card>
      <v-card-title>
        <span class="headline">{{ isUpdate ? 'Muuda partiid' : 'Lisa partii' }}</span>
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
                label="Võitja"
                :items="['Valge', 'Must', 'Viik']"
                variant="outlined"
                :error="!isWinnerAndEndTimeValid"
                :error-messages="!isWinnerAndEndTimeValid ? ['Võitja ja lõppaeg peavad mõlemad olema määratud või mõlemad määramata'] : []"
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
          @click="submitMatch"
          :disabled="!isFormValid || isSamePlayer || !isWinnerAndEndTimeValid"
        >
          {{ isUpdate ? 'Uuenda' : 'Salvesta' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { fetchAllPlayers } from "@/wrapper/playersApiWrapper.js";
import { addMatchToTournament, fetchMatchById } from "@/wrapper/matchesApiWrapper.js";

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
    matchId: {
      type: Number,
      default: null,
    },
    isUpdate: {
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
      formValid: null,
      endTimeErrorMessage: null,
    };
  },
  computed: {
    isFormValid() {
      return (
        this.newMatch.white &&
        this.newMatch.black &&
        this.newMatch.startTime &&
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
    isWinnerAndEndTimeValid() {
      const { winner, endTime } = this.newMatch;
      return (winner && endTime) || (!winner && !endTime);
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
    if (this.isUpdate && this.matchId) {
      this.loadMatchData();
    }
  },
  methods: {
    async loadPlayersCache() {
      this.playersCache = await fetchAllPlayers();
    },
    async loadMatchData() {
      const match = await fetchMatchById(this.matchId);
      this.newMatch = {
        white: match.white.id,
        black: match.black.id,
        startTime: match.startTime,
        endTime: match.endTime,
        winner: match.winner,
      };
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
      this.selectedMatch = null;
      this.$emit("dialog-closed");
    },
    async submitMatch() {
      const match = {
        white: this.newMatch.white,
        black: this.newMatch.black,
        startTime: this.newMatch.startTime,
        endTime: this.newMatch.endTime,
        winner: this.newMatch.winner,
        tournamentId: this.tournamentId,
        isUpdate: this.isUpdate,
        matchId: this.matchId,
      };

      await addMatchToTournament(match, this.isUpdate);
      this.closeDialog();
      this.$emit("match-updated", match);
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
