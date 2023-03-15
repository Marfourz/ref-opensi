<template>
  <div class="relative" @click="show = !show">
    <div
      class="flex items-center justify-between w-full text-grey-70 font-semibold text-sm border border-gray-400 rounded-lg py-2 px-3"
    >
      <div class="flex space-x-2">
        <BaseIcon icon="calendar"></BaseIcon>

        <div v-if="!selectedDate.value">
          Du {{ formatDate(dateChoice.start) }} au
          {{ formatDate(dateChoice.end) }}
        </div>
        <div v-else>
          {{ selectedDate.label }}
        </div>
      </div>

      <div><BaseIcon icon="chevron-down"></BaseIcon></div>
    </div>

    <div
      v-if="show"
      @click.stop=""
      class="flex bg-white shadow-4xl absolute rounded top-14 -left-72"
      style="z-index: 200"
    >
      <div class="py-8 border-r-2" style="width: 220px">
        <div
          @click="
            selectedDate = date;
            setDate();
          "
          v-for="date in dates"
          :key="date.value"
          :class="{ 'bg-blue-100': selectedDate == date }"
          class="px-8 text-lg py-2 hover:bg-blue-100"
        >
          {{ date.label }}
        </div>
      </div>
      <div class="p-8">
        <div class="flex justify-center">
          <div @click="selectedDate = {}">
            <v-date-picker is-range v-model="dateChoice" :key="dateChoice" />
          </div>
        </div>
        <div class="w-full flex space-x-4 mt-4">
          <BaseButton type="outline" class="rounded-full" @click="reset()"
            >Annuler</BaseButton
          >
          <BaseButton type="primary" @click="apply()" class="rounded-full"
            >Appliquer</BaseButton
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      reload: false,
      show: false,
      dates: [
        {
          label: "Aujourd'hui",
          value: "today",
        },
        {
          label: "Semaine passée",
          value: "lastWeek",
        },
        {
          label: "Mois passé",
          value: "lastMonth",
        },
        {
          label: "Année passée",
          value: "lastYear",
        },
        {
          label: "Depuis le début",
          value: "all",
        },
      ],
      selectedDate: {},
      dateChoice: {
        start: new Date(),
        end: new Date(),
      },
    };
  },

  methods: {
    setDate() {
      this.reload = false;
      const start = new Date();
      const end = new Date();
      if (this.selectedDate.value == "today") {
        start.setHours(0, 0, 0);
        end.setHours(23, 59, 59);
        this.dateChoice = {
          start: start,
          end: end,
        };
      } else if (this.selectedDate.value == "lastWeek") {
        start.setDate(start.getDate() - start.getDay() - 7);
        end.setDate(end.getDate() - end.getDay());
        this.dateChoice = {
          start: start,
          end: end,
        };
      } else if (this.selectedDate.value == "lastMonth") {
        start.setMonth(start.getMonth() - 1);
        start.setDate(1);
        end.setMonth(end.getMonth());
        end.setDate(0);

        this.dateChoice = {
          start: start,
          end: end,
        };
      } else if (this.selectedDate.value == "lastYear") {
        const start = new Date();
        start.setFullYear(start.getFullYear() - 1);
        start.setDate(1);
        start.setMonth(0);

        const end = new Date();
        end.setFullYear(end.getFullYear() - 1);
        end.setMonth(11);
        end.setDate(31);

        this.dateChoice = {
          start: start,
          end: end,
        };

        this.reload = true;
      } else if (this.selectedDate.value == "all") {
        this.dateChoice = {};
      }
    },

    reset() {
      this.selectedDate = this.dates[0];

      const start = new Date();
      const end = new Date();

      start.setHours(0, 0, 0);
      end.setHours(23, 59, 59);
      this.dateChoice = {
        start: start,
        end: end,
      };
      this.show = false;
    },

    apply() {
      this.$emit("input", this.dateChoice);
      this.show = false;
    },

    formatDate(date) {
      return `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
    },
  },

  mounted() {
    this.selectedDate = this.dates[0];
  },
};
</script>

<style lang="scss" scoped></style>
