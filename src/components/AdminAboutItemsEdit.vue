<script setup>
import FormAboutItemEdit from '@/components/FormAboutItemEdit.vue'

import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="admin-about-items-edit">
    <h3>Edit About Item</h3>
    <FormAboutItemEdit :slug="route.params.slug" />
  </div>
</template>
