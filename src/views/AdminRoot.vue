<template>
  <div class="admin-root">
    <TheNavbarAdmin />
    <h1>Administration</h1>
    <router-view></router-view>
  </div>
</template>

<script>
import TheNavbarAdmin from '@/components/TheNavbarAdmin'

export default {
  components: { TheNavbarAdmin }
}
</script>
