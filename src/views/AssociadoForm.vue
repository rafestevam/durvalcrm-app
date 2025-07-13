<template>
  <div>
    <h1 class="text-2xl font-bold mb-2">{{ isEditing ? 'Editar Associado' : 'Adicionar Novo Associado' }}</h1>
    <router-link to="/associados" class="text-blue-500 hover:underline mb-6 block">&lt; Voltar para a lista</router-link>

    <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
        <strong class="font-bold">Ocorreu um erro!</strong>
        <span class="block sm:inline">{{ errorMessage }}</span>
    </div>

    <form @submit.prevent="handleSubmit" class="p-8 bg-white rounded-lg shadow-md">
        <div class="mb-4">
            <label for="nome" class="block text-gray-700 font-bold mb-2">Nome Completo</label>
            <input type="text" v-model="form.nomeCompleto" id="nome" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required :disabled="isLoading">
        </div>
        <div class="mb-4">
            <label for="cpf" class="block text-gray-700 font-bold mb-2">CPF</label>
            <input type="text" v-model="form.cpf" id="cpf" v-maska data-maska="'###.###.###-##'" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required :disabled="isLoading" placeholder="111.222.333-44">
        </div>
        <div class="mb-4">
            <label for="email" class="block text-gray-700 font-bold mb-2">E-mail</label>
            <input type="email" v-model="form.email" id="email" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required :disabled="isLoading">
        </div>
        <div class="mb-6">
            <label for="telefone" class="block text-gray-700 font-bold mb-2">Telefone</label>
            <input type="text" v-model="form.telefone" id="telefone" v-maska :data-maska="['(##) ####-####', '(##) #####-####']" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" :disabled="isLoading" placeholder="(11) 99999-1111">
        </div>
        <div class="flex items-center justify-end">
            <button type="submit" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline" :disabled="isLoading">
                {{ isLoading ? 'Salvando...' : 'Salvar' }}
            </button>
        </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { createAssociado, getAssociadoById, updateAssociado, type Associado } from '../services/associadoService';
import { AxiosError } from 'axios';
import { vMaska } from 'maska/vue';

const props = defineProps({
  id: String
});

const router = useRouter();
const form = ref<Associado>({
  nomeCompleto: '',
  cpf: '',
  email: '',
  telefone: ''
});

const isLoading = ref(false);
const errorMessage = ref<string | null>(null);

const isEditing = computed(() => !!props.id);

onMounted(async () => {
  if (props.id) {
    isLoading.value = true;
    try {
      const response = await getAssociadoById(props.id);
      form.value = response.data;
    } catch (error) {
      console.error("Erro ao buscar dados do associado:", error);
      errorMessage.value = "Não foi possível carregar os dados do associado.";
    } finally {
        isLoading.value = false;
    }
  }
});

const handleSubmit = async () => {
  isLoading.value = true;
  errorMessage.value = null; // Limpa erros anteriores

  try {
    if (isEditing.value) {
      await updateAssociado(props.id!, form.value);
    } else {
      await createAssociado(form.value);
    }
    router.push('/associados');
  } catch (error) {
    console.error("Erro ao salvar associado:", error);
    if (error instanceof AxiosError && error.response) {
        // Tenta extrair uma mensagem de erro mais amigável da resposta da API
        const responseData = error.response.data;
        if (responseData && responseData.message) {
            errorMessage.value = responseData.message;
        } else if (error.response.status === 400) {
            errorMessage.value = "Dados inválidos. Verifique os campos e tente novamente.";
        } else {
            errorMessage.value = `Ocorreu um erro no servidor (código: ${error.response.status}).`;
        }
    } else {
        errorMessage.value = "Não foi possível conectar ao servidor. Verifique sua conexão.";
    }
  } finally {
    isLoading.value = false;
  }
};
</script>