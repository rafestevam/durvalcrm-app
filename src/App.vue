<template>
  <div class="flex h-screen bg-gray-100">
    <SideMenu />
    <div class="flex-1 flex flex-col overflow-hidden">
      <AppHeader />
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-8">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import SideMenu from './components/layout/SideMenu.vue';
import AppHeader from './components/layout/AppHeader.vue';
</script>