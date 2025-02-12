<script setup>
import FormAboutItemEdit from '@/components/FormAboutItemEdit.vue'

import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="admin-about-items-edit">
    <FormAboutItemEdit :id="route.query.id" />
  </div>
</template>
