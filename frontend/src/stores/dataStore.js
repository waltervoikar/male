// src/stores/auth.js
import { defineStore } from 'pinia'


//TODO: delete store if not used
export const dataStore = defineStore('data', {
  state: () => ({
    clubs: [
      { id: 1, name: 'Klubi A', rating: 2200 },
      { id: 2, name: 'Klubi B', rating: 1900 },
      { id: 3, name: 'Klubi C', rating: 1700 },
      { id: 4, name: 'Klubi D', rating: 1600 },
      { id: 5, name: 'Klubi E', rating: 1400 },
      { id: 6, name: 'Klubi F', rating: 1800 },
    ],
    players: [
      { id: 1, name: "Mängija A", rating: 2100, club: "ässad", sugu: "M" },
      { id: 2, name: "Mängija B", rating: 1900, club: "kunnid", sugu: "M" },
      { id: 3, name: "Mängija C", rating: 2300, club: "klubi1", sugu: "F" },
      { id: 4, name: "Mängija D", rating: 1800, club: "testklubi", sugu: "F" },
      { id: 5, name: "Mängija E", rating: 2050, club: "klubivõileib", sugu: "M" },
      { id: 6, name: "Mängija F", rating: 2200, club: "mis on klubi", sugu: "M" },
    ]
  }),
  getters: {

  },
  actions: {

  },
})
