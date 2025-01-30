<template>
  <div>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default {
  props: {
    chartTitle: {
      type: String,
      required: true,
    },
    totalGamesPlayed: {
      type: Number,
      required: true,
    },
    wins: {
      type: Number,
      required: true,
    },
    losses: {
      type: Number,
      required: true,
    },
  },
  mounted() {
    this.renderChart();
  },
  methods: {
    renderChart() {
      const ctx = this.$refs.chartCanvas.getContext("2d");
      new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["võidud", "kaotused"],
          datasets: [
            {
              data: [this.wins, this.losses],
              backgroundColor: ["#36A2EB", "#FF6384"],
              hoverOffset: 4,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: this.chartTitle,
            },
            subtitle: {
              display: true,
              text: "Mänge: " + this.totalGamesPlayed
            },
          },
        },
      });
    },
  },
};
</script>

<style scoped>
canvas {
  max-width: 400px;
  max-height: 400px;
}
</style>
