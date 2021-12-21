describe('Users E2E', () => {
  describe('Health check', () => {
    it('must return 200', () => {
      cy.request({
        url: '/health/check',
        method: 'GET'
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.deep.equal({ status: 'OK' })
      })
    })
  })

  describe('POST /auth/login', () => {
    it('must login', () => {
      cy.request({
        url: '/auth/login',
        method: 'POST',
        body: {
          email: Cypress.env('USER_EMAIL'),
          password: Cypress.env('USER_PASS')
        }
      }).then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body.jwt).to.be.a('string')
        expect(response.body.refresh).to.be.a('string')
        expect(response.body.refreshExpiredAt).to.be.a('number')
        expect(response.body.jwtExpiredAt).to.be.a('number')
      })
    })

    it('must return USER_NOT_FOUND error', () => {
      cy.request({
        url: '/auth/login',
        method: 'POST',
        failOnStatusCode: false,
        body: {
          email: 'email',
          password: 'password'
        }
      }).then((response) => {
        expect(response.status).to.eq(404)
        expect(response.body.code).to.eq('USER_NOT_FOUND')
      })
    })

    it('must return PASSWORD_INCORRECT error', () => {
      cy.request({
        url: '/auth/login',
        method: 'POST',
        failOnStatusCode: false,
        body: {
          email: Cypress.env('USER_EMAIL'),
          password: 'password'
        }
      }).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.code).to.eq('PASSWORD_INCORRECT')
      })
    })
  })
})
