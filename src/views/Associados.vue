<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Gestão de Associados</h1>
    <div class="flex justify-between items-center mb-6">
      <input
        v-model="associadosStore.searchTerm"
        type="text"
        placeholder="Buscar por nome ou CPF..."
        class="w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
      />
      <router-link
        :to="{ name: 'NovoAssociado' }"
        class="bg-blue-800 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
      >
        + Adicionar Associado
      </router-link>
    </div>

    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="min-w-full leading-normal">
        <thead>
          <tr class="bg-gray-100 text-left text-gray-600 font-bold uppercase text-sm">
            <th class="px-5 py-3">Nome Completo</th>
            <th class="px-5 py-3">CPF</th>
            <th class="px-5 py-3">E-mail</th>
            <th class="px-5 py-3">Telefone</th>
            <th class="px-5 py-3">Ações</th>
          </tr>
        </thead>
        <tbody class="text-gray-700">
          <tr v-if="!associadosStore.filteredAssociados.length">
              <td colspan="5" class="text-center py-10 text-gray-500">
                  Nenhum associado encontrado.
              </td>
          </tr>
          <tr v-for="associado in associadosStore.filteredAssociados" :key="associado.id" class="border-b border-gray-200 hover:bg-gray-50">
            <td class="px-5 py-4">{{ associado.nome_completo }}</td>
            <td class="px-5 py-4">{{ associado.cpf }}</td>
            <td class="px-5 py-4">{{ associado.email }}</td>
            <td class="px-5 py-4">{{ associado.telefone }}</td>
            <td class="px-5 py-4">
              <router-link
                :to="{ name: 'EditarAssociado', params: { id: associado.id } }"
                class="bg-gray-200 text-gray-700 font-bold py-1 px-3 rounded-lg text-xs hover:bg-gray-300"
              >
                Editar
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAssociadosStore } from '../store/associados';

const associadosStore = useAssociadosStore();

onMounted(() => {
  associadosStore.fetchAssociados();
});
</script>