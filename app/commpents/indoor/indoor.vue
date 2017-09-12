<template>
  <div class="indoor">
        <div class="bg"  v-if="$store.state.bg"></div>
      <slot></slot>
  </div>
</tempate>
