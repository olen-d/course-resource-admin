<script setup>
import { ref } from 'vue'

import DisplayStatisticNumber from '@/components/DisplayStatisticNumber.vue'
import DisplayStatisticTable from '@/components/DisplayStatisticTable.vue'

import { useAnalytics } from '@/composables/useAnalytics.js'

import { NGrid, NGridItem } from 'naive-ui'

const statisticColumnTitles = ref([])
const statisticsSingle = ref([])
const statisticsSingleIsLoading = ref([])
const statisticsRoutes = ref([])

statisticColumnTitles.value.push({ title: 'Route', key: 'route' })
statisticColumnTitles.value.push({ title: 'Total Time', key: 'total_time' });

const formatTotalTime = totalTimeMS => {
  const totalSeconds = Math.round(totalTimeMS / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor(totalSeconds % 3600 / 60)
  const seconds = totalSeconds % 60
  return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

(async () => {
  const { data: { totalVisits }, isLoading: l1 } = await useAnalytics('sessions')
  statisticsSingle.value.push({ id: 'totalVisits', name: 'Total Visits', count: totalVisits })
  statisticsSingleIsLoading.value.push(l1)
  const { data: { uniqueVisits }, isLoading: l2 } = await useAnalytics('sessions/unique')
  statisticsSingleIsLoading.value.push(l2)
  statisticsSingle.value.push({ id: 'uniqueVisits', name: 'Unique Visits', count: uniqueVisits })
  const { data: { totalSinglePageSessions }, isLoading: l3 } = await useAnalytics('sessions/single-page')
  statisticsSingleIsLoading.value.push(l3)
  statisticsSingle.value.push({ id: 'totalSinglePageSessions', name: 'Single Page Sessions', count: totalSinglePageSessions })
  const { data: { bounceRate }, isLoading: l4 } = await useAnalytics('sessions/bounce-rate')
  statisticsSingleIsLoading.value.push(l4)
  statisticsSingle.value.push({ id: 'bounceRate', name: 'Bounce Rate', count: bounceRate, format: 'percent' })
  const { data: routesByTotalTime, isLoading: l5 } = await useAnalytics('pages/routes/total-time')
  const routesByTotalTimeSeconds = routesByTotalTime.map(({ route, total_time: totalTime }) => ({ route, total_time: formatTotalTime(totalTime) }))
  statisticsRoutes.value = routesByTotalTimeSeconds
})()
</script>

<template>
  <div class="admin-dashboard">
    <h1>Dashboard</h1>
    <n-grid
      x-gap="24"
      y-gap="24"
      :cols="12"
      :item-responsive="true"
      responsive="screen"
    >
      <n-grid-item
        v-for="{ id, name, count, format } in statisticsSingle"
        :key="id"
        span="xs:6 s:4 m:3 l:2 xl:1"
        class="display-statistic-number"
      >
        <DisplayStatisticNumber
          :statistic-name="name"
          :statistic-value="count"
          :format="format"
        />
      </n-grid-item>
      <n-grid-item :span="12">
        <DisplayStatisticTable
          :statistic-column-titles="statisticColumnTitles"
          :statistic-value="statisticsRoutes"
          table-title="Routes by Total Time"
        />
      </n-grid-item>
    </n-grid>
  </div>
</template>
