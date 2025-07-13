import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as associadoService from '../services/associadoService'
import type { Associado } from '../services/associadoService'

export const useAssociadosStore = defineStore('associados', () => {
  // --- STATE ---
  // Armazena a lista completa de associados.
  const associados = ref<Associado[]>([])
  // Armazena o termo de busca introduzido pelo utilizador.
  const searchTerm = ref('')

  // --- GETTERS ---
  // Filtra a lista de associados com base no searchTerm.
  // A busca é feita no nome completo ou no CPF. [cite: 141]
  const filteredAssociados = computed(() => {
    if (!searchTerm.value) {
      return associados.value
    }
    const lowerCaseSearch = searchTerm.value.toLowerCase()
    return associados.value.filter(
      (associado) =>
        associado.nome_completo.toLowerCase().includes(lowerCaseSearch) ||
        associado.cpf.includes(lowerCaseSearch)
    )
  })

  // --- ACTIONS ---
  // Obtém todos os associados da API e atualiza o estado.
  async function fetchAssociados() {
    try {
      associados.value = await associadoService.getAssociados()
    } catch (error) {
      console.error("Falha ao obter associados:", error)
      // Opcional: Adicionar tratamento de erro para a UI
    }
  }

  // Obtém um único associado pelo seu ID.
  async function getAssociadoById(id: string): Promise<Associado | undefined> {
    try {
      return await associadoService.getAssociadoById(id)
    } catch (error) {
      console.error(`Falha ao obter associado com ID ${id}:`, error)
    }
  }

  // Guarda um associado (cria um novo ou atualiza um existente).
  async function saveAssociado(data: Partial<Associado>, id?: string) {
    try {
      if (id) {
        // Atualiza um associado existente
        await associadoService.updateAssociado(id, data)
      } else {
        // Cria um novo associado
        await associadoService.createAssociado(data as Omit<Associado, 'id' | 'criado_em' | 'ativo'>)
      }
      // Após salvar, atualiza a lista local para refletir as alterações.
      await fetchAssociados()
    } catch (error) {
      console.error("Falha ao salvar associado:", error)
    }
  }

  return {
    // State
    associados,
    searchTerm,
    // Getters
    filteredAssociados,
    // Actions
    fetchAssociados,
    getAssociadoById,
    saveAssociado
  }
})