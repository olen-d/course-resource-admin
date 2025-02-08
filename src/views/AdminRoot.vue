<script setup>
import TheNavbarAdmin from '@/components/TheNavbarAdmin.vue'

import { NLayout, NLayoutContent, NLayoutHeader } from 'naive-ui'
</script>

<template>
  <n-layout>
    <n-layout-header>
      <TheNavbarAdmin />
    </n-layout-header>
    <n-layout-content>
      <div class="wrapper-content">
        <h1 class="left">nocargravel.cc</h1>
        <router-view />
      </div>
    </n-layout-content>
  </n-layout>
</template>

<style scoped>
.wrapper-content {
  margin-right: 5%;
  margin-left: 5%;
}
</style>
