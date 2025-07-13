<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Gestão de Associados</h1>
    <div class="mb-4 flex justify-between">
      <input
        type="text"
        v-model="search"
        @keyup.enter="fetchAssociados"
        placeholder="Buscar por nome ou CPF..."
        class="px-4 py-2 border rounded-md w-1/3"
      />
      <router-link to="/associados/novo" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        + Adicionar Associado
      </router-link>
    </div>

    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome Completo</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPF</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-mail</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="associado in associados" :key="associado.id">
            <td class="px-6 py-4 whitespace-nowrap">{{ associado.nomeCompleto }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ associado.cpf }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ associado.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ associado.telefone }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <router-link :to="`/associados/editar/${associado.id}`" class="text-indigo-600 hover:text-indigo-900">Editar</router-link>
              <button @click="removeAssociado(associado.id!)" class="ml-4 text-red-600 hover:text-red-900">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAssociados, deleteAssociado, type Associado } from '../services/associadoService';

const associados = ref<Associado[]>([]);
const search = ref('');

const fetchAssociados = async () => {
  try {
    const response = await getAssociados(search.value);
    associados.value = response.data;
  } catch (error) {
    console.error("Erro ao buscar associados:", error);
  }
};

const removeAssociado = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este associado?')) {
        try {
            await deleteAssociado(id);
            fetchAssociados(); // Recarrega a lista
        } catch (error) {
            console.error("Erro ao excluir associado:", error);
        }
    }
};

onMounted(fetchAssociados);
</script>