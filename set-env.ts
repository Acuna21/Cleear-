const fs = require('fs');
const dotenv = require('dotenv');

// Carga el .env si estás en local
dotenv.config();

const targetPath = './src/environments/environment.prod.ts';

const envConfigFile = `
export const environment = {
  azure: {
    clientId: '${process.env['AZURE_CLIENT_ID']}',
    tenantId: '${process.env['AZURE_TENANT_ID']}',
    redirectUri: '${process.env['AZURE_REDIRECT_URI']}',
    postLogoutRedirectUri: '${process.env['AZURE_LOGOUT_URI']}',
    scopes: ['${process.env['AZURE_SCOPES']}'],
    apiUri: 'https://graph.microsoft.com/v1.0/me',
  },
  api: {
    url: '${process.env['API_BASE_URL']}',
    azureLoginUrl: '/auth/azure',
    loginUrl: '/auth/login',
    prioritySummary: '/tasks/stats/priority-summary',
    refreshToken: '/auth/refresh',
    tasks: '/tasks',
    locations: '/locations'
  }
};
`;

fs.writeFile(targetPath, envConfigFile, (err: any) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Archivo generado en ${targetPath}`);
  }
});
