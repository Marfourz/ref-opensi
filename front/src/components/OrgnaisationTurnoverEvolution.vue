<template>
    <div>
        <apexchart
        height="400px"
        type="line"
        :options="chartOptions"
        :series="series"
      ></apexchart>     
    </div>
</template>

<script lang="ts">
import { defineComponent, ref,onMounted, computed } from 'vue'
import { useOrganizationStore } from '../stores/organization';
import { useUsersStore } from '../stores/users';

export default defineComponent({
    props:{
        organisationId:{
           
            type: String
        }
    },
    setup () {

    const organisationStore = useOrganizationStore()


        const chartOptions = ref({
      tooltip:{
        marker: {
          show: false,
      },
        },
      chart: {
        toolbar: {
          show: false,
        },
        
        id: "vuechart-example",
      },
      colors: ["#259475"],
      xaxis: {
        categories: [
          "Jan",
          "Fev",
          "Mar",
          "Avr",
          "Mai",
          "Jun",
          "Jui",
          "Aou",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
      },
    });

    const series = ref([
      {
        name: "Chiffre d’affaires",
        data: [
          "100k",
          "300k",
          "400k",
          "100k",
          "100k",
          "300k",
          "250k",
          "300k",
          "400k",
          "200k",
          "100k",
          "100k",
        ],
      },
    ]);

    const userStore = useUsersStore()

    const organisationId = computed(()=>{
        return userStore.getCurrentUser?.organisationId
    })

    onMounted(() => {
        const response = organisationStore.turnoverEvolution(organisationId.value as string)

        console.log("response", response);
        
    })

        return {
            chartOptions,
            series

        }
    }
})
</script>

<style scoped>

</style>