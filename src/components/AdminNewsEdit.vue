<script setup>
import FormNews from '@/components/FormNews.vue'

import { useRoute } from 'vue-router'

const route = useRoute()

</script>

<template>
  <div class="admin-news-edit">
    <FormNews 
    form-action="edit"
    form-name="Edit Story"
    submit-action-label="Update Story"
    success-action="updated"
    :storyId="route.query.id" />
  </div>
</template>
