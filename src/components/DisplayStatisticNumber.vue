<script setup>
import { computed } from 'vue'

const props = defineProps({
  format: {
    type: String,
    default: 'none'
  },
  round: {
    type: Number,
    default: 0
  },
  statisticName: {
    type: String,
    default: 'Name'
  },
  statisticValue: {
    type: Number,
    default: 0
  }
})

const converted = computed(() => {
  switch (props.format) {
    case 'percent':
      return props.statisticValue * 100
    default:
      return props.statisticValue
  }
})

const rounded = computed(() => {
  switch (props.round) {
    case 0:
      return Math.round(converted.value)
    default:
      return converted.value
  }
})

const formatted = computed(() => {
  switch (props.format) {
    case 'percent':
      return `${rounded.value}%`
    case 'none':
    default:
      return rounded.value
  }
})

</script>

<template>
  <div class="display-statistic-number">
    <div class="display-statistic-number-value">
      {{ formatted }}
    </div>
    <div class="display-statistic-number-name">
      {{ statisticName }}
    </div>
  </div>
</template>

<style scoped>
.display-statistic-number {
  background-color: #f8f8f8;
}
.display-statistic-number-name {
  font-size: 1rem;
  color: #777;
}
.display-statistic-number-value {
  font-weight: 700;
  font-size: 2rem;
  color: #888;
}
</style>
