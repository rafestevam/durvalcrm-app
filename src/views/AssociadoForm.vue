<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ pageTitle }}</h1>
    <router-link :to="{ name: 'Associados' }" class="text-blue-500 hover:underline mb-6 block">
      &lt; Voltar para a lista
    </router-link>

    <div class="bg-white p-8 rounded-lg shadow-lg">
      <form @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="col-span-2">
            <label for="nome" class="block text-sm font-bold text-gray-600 mb-2">Nome Completo</label>
            <input v-model="form.nome_completo" type="text" id="nome" class="w-full input-style" required />
          </div>
          <div>
            <label for="cpf" class="block text-sm font-bold text-gray-600 mb-2">CPF</label>
            <input v-model="form.cpf" type="text" id="cpf" class="w-full input-style" required />
          </div>
          <div>
            <label for="email" class="block text-sm font-bold text-gray-600 mb-2">E-mail</label>
            <input v-model="form.email" type="email" id="email" class="w-full input-style" required />
          </div>
          <div>
            <label for="telefone" class="block text-sm font-bold text-gray-600 mb-2">Telefone</label>
            <input v-model="form.telefone" type="text" id="telefone" class="w-full input-style" />
          </div>
        </div>

        <div class="mt-8 flex justify-end">
          <button type="submit" class="bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-500 transition-colors">
            Salvar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAssociadosStore } from '../store/associados';

const store = useAssociadosStore();
const route = useRoute();
const router = useRouter();

const associadoId = computed(() => route.params.id as string | undefined);
const isEditing = computed(() => !!associadoId.value);
const pageTitle = computed(() => isEditing.value ? 'Editar Associado' : 'Adicionar Novo Associado');

const form = ref({
  nome_completo: '',
  cpf: '',
  email: '',
  telefone: '',
});

onMounted(async () => {
  if (isEditing.value && associadoId.value) {
    // Busca os dados do associado na 'API' se estiver a editar
    const associado = await store.getAssociadoById(associadoId.value);
    if (associado) {
      form.value = { ...associado };
    }
  }
});

async function handleSubmit() {
  await store.saveAssociado(form.value, associadoId.value);
  router.push({ name: 'Associados' });
}
</script>

<style scoped>
.input-style {
  @apply px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500;
}
</style>