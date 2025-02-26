import { computed, onMounted, ref } from 'vue'
const difficultyLevels = ref([])
const isLoading = ref(true)

export function useDifficulty () {
  onMounted(async () => {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/v1/difficulty`
    )
    isLoading.value = false
    const result = await response.json()
    const { status } = response

    if (status === 200) {
      const { data } = result
      // const filtered = data.map(element => {
      //   return (({ _id: key, rating, eng }) => ({ key, rating, eng }))(element)
      // })
      // difficulty.value.push(...filtered)
      difficultyLevels.value = [...data]
    }
  })

  const isLoadingStatus = computed(() => {
    return isLoading.value
  })

  return { difficultyLevels, isLoadingStatus }
}
