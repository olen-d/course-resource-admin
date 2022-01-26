<template>
  <el-menu class="el-menu" :default-active="activeIndex" mode="horizontal" :router="true">
    <el-menu-item index="1" route="/admin">Dashboard</el-menu-item>
    <el-menu-item index="2" route="/admin/courses">Courses</el-menu-item>
    <el-menu-item index="3" route="/admin/link2">Link 2</el-menu-item>
  </el-menu>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  setup () {
    return {
      activeIndex: '1',
      activeIndex2: '1',
      activeIndex3: '1'
    }
  }
})
</script>
