import Keycloak from 'keycloak-js';

// ✅ Configuração melhorada do Keycloak
const keycloak = new Keycloak({
  url: 'http://localhost:8080',
  realm: 'durval-crm', 
  clientId: 'durvalcrm-app'
});

// ✅ Adiciona eventos para debug
keycloak.onReady = (authenticated) => {
  console.log('Keycloak pronto. Autenticado:', authenticated);
};

keycloak.onAuthSuccess = () => {
  console.log('Autenticação bem-sucedida');
};

keycloak.onAuthError = (error) => {
  console.error('Erro de autenticação:', error);
};

keycloak.onAuthRefreshSuccess = () => {
  console.log('Token atualizado com sucesso');
};

keycloak.onAuthRefreshError = () => {
  console.warn('Falha ao atualizar token');
};

keycloak.onAuthLogout = () => {
  console.log('Usuário deslogado');
};

keycloak.onTokenExpired = () => {
  console.log('Token expirado, tentando atualizar...');
  keycloak.updateToken(30).catch(() => {
    console.log('Não foi possível atualizar token, redirecionando para login');
    keycloak.login();
  });
};

export default keycloak;