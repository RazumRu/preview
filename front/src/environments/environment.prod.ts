export const environment = {
  production: true,
  apiUrl: 'https://api.example.ru',

  swaggerSpecs: [
    {
      path: '/users/swagger-api-json',
      name: 'users'
    },
    {
      path: '/files/swagger-api-json',
      name: 'files'
    },
    {
      path: '/jewelry/swagger-api-json',
      name: 'jewelry'
    }
  ]
}
