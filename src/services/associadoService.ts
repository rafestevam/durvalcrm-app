import api from './api';

// Baseado na especificação OpenAPI: durvalcrm-api-openapi.json
export interface Associado {
  id?: string;
  nomeCompleto: string;
  cpf: string;
  email: string;
  telefone?: string;
}

export const getAssociados = (search: string = '') => {
  return api.get<Associado[]>('/associados', {
    params: { search }
  });
};

export const getAssociadoById = (id: string) => {
  return api.get<Associado>(`/associados/${id}`);
};

export const createAssociado = (associado: Associado) => {
  return api.post<Associado>('/associados', associado);
};

export const updateAssociado = (id: string, associado: Associado) => {
  return api.put<Associado>(`/associados/${id}`, associado);
};

export const deleteAssociado = (id: string) => {
  return api.delete(`/associados/${id}`);
};