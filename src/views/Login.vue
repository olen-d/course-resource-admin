<template>
  <div class="login">
    <n-grid :x-gap="0" :cols="12">
      <n-grid-item :span="4" :offset="4">
        <LoginForm />
      </n-grid-item>
    </n-grid>
  </div>
</template>

<script>
import LoginForm from '@/components/LoginForm'
import { NGrid, NGridItem } from 'naive-ui'

export default {
  components: { LoginForm, NGrid, NGridItem }
}
</script>
