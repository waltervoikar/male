<template>
  <v-card>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" v-for="(mangija, index) in klubiParimad" :key="mangija.nimi">
            <v-card>
              <v-card-title>
                <v-row align="center">
                  <v-col cols="8">
                    <v-chip :color="getChipColor(index)" class="ma-2" label>{{ index + 1 }}</v-chip>
                    {{ mangija.nimi }}
                  </v-col>
                  <v-col cols="4" class="text-right points">
                    {{ Math.round(mangija.punktid * 10) / 10 }}
                  </v-col>
                </v-row>
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import {fetchKlubiParimad} from "@/wrapper/playersApiWrapper.js";

export default {
  name: "ModifyClubForm",
  props: {
    isUpdate: {
      type: Boolean,
      default: false,
    },
    clubName: {
      type: String,
      default: null,
    }
  },
  data() {
    return {
      klubiParimad: [],
    };
  },

  created() {
    if (this.isUpdate && this.clubName) {
      this.loadClubDataForUpdate()
    }
  },

  methods: {

    async loadClubDataForUpdate() {
      this.klubiParimad = await fetchKlubiParimad(this.clubName)
    },
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
  },
};
</script>

<style scoped>
</style>
