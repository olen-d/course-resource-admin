<script setup>
import { NDataTable } from 'naive-ui'

const props = defineProps({
  statisticColumnTitles: {
    type: Array,
    default: null
  },
  statisticValue: {
    type: Array,
    default: null
  },
  tableTitle: {
    type: String,
    default: 'Statistics by Category'
  }
})

const createColumns = () => {
  return props.statisticColumnTitles
}

const columns = createColumns()
</script>

<template>
  <div class="display-statistic-table">
    <div class="table-caption">
      {{ tableTitle }}
    </div>
    <n-data-table
      :columns="columns"
      :data="statisticValue"
    />
  </div>
</template>

<style scoped>
.table-caption {
  color: #888;
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 1rem;
}
</style>
