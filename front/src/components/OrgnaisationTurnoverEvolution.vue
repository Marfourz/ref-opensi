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
import { defineComponent, ref,onMounted, computed, watch } from 'vue'
import { useOrganizationStore } from '../stores/organization';
import { useUsersStore } from '../stores/users';

export default defineComponent({
    props:{
        organisationId:{
          
            type: String
        }
    },
    setup (props) {

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
          "0",
          "0",
          "0",
          "0",
          "0",
          "0",
          "0",
          "0",
          "0",
          "0",
          "0",
          "0",
        ],
      },
    ]);

    const userStore = useUsersStore()

   

    async function  loadData(){
        let response = await organisationStore.turnoverEvolution(props.organisationId as string) as any

        series.value[0].data = response.map((value:any)=>{
            return value.total._sum.totalAmount ? value.total._sum.totalAmount : 0
        })

    }

   watch(()=>props.organisationId, (newValue)=>{
    loadData()
   })

    onMounted(async () => {
       
        await loadData()
        
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