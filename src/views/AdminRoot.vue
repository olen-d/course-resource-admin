<script setup>
import TheNavbarAdmin from '@/components/TheNavbarAdmin.vue'
</script>

<template>
  <div class="admin-root">
    <TheNavbarAdmin />
    <h1>Administration</h1>
    <router-view />
  </div>
</template>
