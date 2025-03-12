<template>
  <v-card>
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
              item-value="name"
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
      <DeleteButtonWithAlert
        button-text="Kustuta klubi"
        @nuke-confirmed="nukeClub"
      />
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
</template>

<script>
import {fetchAllLocations} from "@/wrapper/locationsApiWrapper.js";
import {addClub, fetchClubById, removeClub} from "@/wrapper/clubsApiWrapper.js";
import DeleteButtonWithAlert from "@/components/DeleteButtonWithAlert.vue";

export default {
  name: "ModifyClubForm",
  components: {DeleteButtonWithAlert},
  props: {
    isUpdate: {
      type: Boolean,
      default: false,
    },
    clubId: {
      type: String,
      default: null,
    }
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
  created() {
    this.loadLocationsCache();
    if (this.isUpdate && this.clubId) {
      this.loadClubDataForUpdate()
    }
  },
  methods: {
    async loadLocationsCache() {
      this.locationCache = await fetchAllLocations();
    },
    async loadClubDataForUpdate() {
      this.newClub = await fetchClubById(this.clubId)
      console.log(this.newClub)
    },

    async nukeClub() {
      await removeClub(this.clubId)
      this.$router.push("/klubid")
    },

    async submitNewClub() {
      const club = {
        name: this.newClub.name,
        location: this.newClub.location,
        isUpdate: this.isUpdate,
        clubId: this.clubId,
      };
      await addClub(club);
      this.$emit("club-updated", club);
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
