<template>
  <div class="relative" @click="show = !show" @click.stop="">
    <div
      class="flex items-center justify-between w-full text-grey-70 font-semibold text-sm border border-gray-400 rounded-lg py-2 px-3"
    >
      <div class="flex space-x-2">
        <!-- <BaseIcon name="calendar"></BaseIcon> -->

        <div v-if="!selectedDate.value">
          Du {{ formatDate(dateChoice.start) }} au
          {{ formatDate(dateChoice.end) }}
        </div>
        <div v-else>
          {{ selectedDate.label }}
        </div>
      </div>

      <div><BaseIcon name="chevronDown"></BaseIcon></div>
    </div>

    <div
      v-if="show"
      @click.stop=""
      class="flex bg-white shadow-xl absolute rounded top-14 right-4"
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
          <BaseButton
            outline="true"
            size="medium"
            class="w-full"
            @click="reset()"
            >Annuler</BaseButton
          >
          <BaseButton
            type="primary"
            size="medium"
            @click="apply()"
            class="w-full"
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
          label: "Ce mois",
          value: "month",
        },
        {
          label: "Cette année",
          value: "year",
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
      } else if (this.selectedDate.value == "month") {
        start.setMonth(start.getMonth());
        start.setDate(1);
        end.setMonth(end.getMonth() + 1);
        end.setDate(0);

        this.dateChoice = {
          start: start,
          end: end,
        };
      } else if (this.selectedDate.value == "year") {
        const start = new Date();
        start.setFullYear(start.getFullYear());
        start.setDate(1);
        start.setMonth(0);

        const end = new Date();
        end.setFullYear(end.getFullYear());
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
      console.log("value", this.dateChoice.start);
      this.$emit("input", {
        startDate: this.dateChoice.start,
        endDate: this.dateChoice.end,
      });
      this.show = false;
    },

    formatDate(date) {
      return `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
    },
  },

  mounted() {
    this.selectedDate = this.dates[2];
    this.setDate();
    document.addEventListener("click", (event) => {
      this.show = false;
    });
    this.$emit("input", {
      startDate: this.dateChoice.start,
      endDate: this.dateChoice.end,
    });
  },
};
</script>

<style lang="scss" scoped></style>
