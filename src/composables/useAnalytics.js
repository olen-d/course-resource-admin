let data = null
let isLoading = true

export async function useAnalytics (endpoint) {
  const fetchData = async () => {
    data = null
    isLoading = true

    const response = await fetch(
      `${import.meta.env.VITE_ANALYTICS_API_BASE_URL}/v1/${endpoint}`, {
        method: 'GET',
        headers: {
          'api-key': import.meta.env.VITE_ANALYTICS_API_KEY_READ
        }
      }
    )

    const { status } = response

    if (status === 200) {
      const result = await response.json();
      ({ data } = result)
    }
    isLoading = false
  }

  await fetchData()
  return { data, isLoading }
}
