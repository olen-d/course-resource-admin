<script setup>
import FormLinkEdit from '@/components/FormLinkEdit.vue'

import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="admin-about-items-edit">
    <h3>Edit About Item</h3>
    <FormLinkEdit :id="route.params.id" />
  </div>
</template>
