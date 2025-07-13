<template>
  <div id="durvalcrm-app" class="bg-gray-100 min-h-screen">
    <header v-if="keycloak?.authenticated" class="bg-white shadow-md">
      <nav class="container mx-auto px-6 py-3 flex justify-between items-center">
        <div class="text-xl font-bold text-blue-800">DurvalCRM</div>
        <div>
          <span class="mr-4 text-gray-700">Olá, {{ keycloak.tokenParsed?.preferred_username }}</span>
          <button @click="handleLogout" class="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition-colors">
            Sair
          </button>
        </div>
      </nav>
    </header>
    <main class="container mx-auto p-4">
      <router-view v-if="keycloak?.authenticated" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { keycloakKey } from './main';

// Injeta a instância do Keycloak fornecida no main.ts
const keycloak = inject(keycloakKey);

const handleLogout = () => {
  if (keycloak) {
    // Redireciona para a página de login do Keycloak após o logout
    keycloak.logout({ redirectUri: window.location.origin });
  }
};
</script>