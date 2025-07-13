import apiClient from './api'; // Importe a instância pré-configurada

export interface Associado {
  id: string;
  nome_completo: string;
  cpf: string;
  email: string;
  telefone: string;
  ativo: boolean;
  criado_em: string;
}

// O serviço não precisa mais mockar os dados. Ele fará chamadas reais.

export async function getAssociados(): Promise<Associado[]> {
  const response = await apiClient.get<Associado[]>('/associados');
  return response.data;
}

export async function getAssociadoById(id: string): Promise<Associado> {
    const response = await apiClient.get<Associado>(`/associados/${id}`);
    return response.data;
}

export async function createAssociado(data: Omit<Associado, 'id' | 'criado_em' | 'ativo'>): Promise<Associado> {
    const response = await apiClient.post<Associado>('/associados', data);
    return response.data;
}

export async function updateAssociado(id: string, data: Partial<Omit<Associado, 'id'>>): Promise<Associado> {
    const response = await apiClient.put<Associado>(`/associados/${id}`, data);
    return response.data;
}