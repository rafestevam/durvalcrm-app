<template>
  <header class="flex items-center justify-between px-6 py-4 bg-white border-b-2 border-gray-200">
    <div>
      </div>
    <div v-if="keycloak && keycloak.authenticated">
      <span class="mr-4">Olá, {{ userInfo.name || 'Usuário' }}</span>
      <button @click="logout" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Sair</button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, inject } from 'vue';
import type { KeycloakProfile } from 'keycloak-js';
import keycloak from '../../keycloak'; // Atualizado para o novo arquivo

const userInfo = ref({ name: '' });
//const keycloak = inject(keycloakKey);

onMounted(async () => {
  if (keycloak && keycloak.authenticated) {
    try {
      const profile: KeycloakProfile = await keycloak.loadUserProfile();
      userInfo.value.name = profile.firstName || profile.username || '';
    } catch (error) {
      console.error("Falha ao carregar perfil do usuário", error);
    }
  }
});

const logout = () => {
  if (keycloak) {
    keycloak.logout({ redirectUri: window.location.origin });
  }
};
</script>