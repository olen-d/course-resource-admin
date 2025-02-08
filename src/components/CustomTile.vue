<template>
  <div class="custom-tile">
    <div class="custom-tile-header-wrapper">
      <slot name="header"></slot>
    </div>
    <div class="custom-tile-meta">
      <slot name="meta"></slot>
    </div>
    <div class="custom-tile-content">
      <slot name="content"></slot>
    </div>
    <div class="custom-tile-stats">
      <slot name="statistics"></slot>
    </div>
  </div>
</template>

<style scoped>
.custom-tile {
  text-align: left;
}
.custom-tile-content {
  margin-top: 1rem;
  color: #777;
}
.custom-tile-header-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
  width: 100%;
}
.custom-tile-meta {
  display: flex;
  flex-wrap: wrap;
  margin-top: 1rem;
}
.custom-tile-stats {
  display: flex;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.header-button {
  align-self: flex-end;
}
</style>
