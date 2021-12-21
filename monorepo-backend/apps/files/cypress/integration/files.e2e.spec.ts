describe('Files E2E', () => {
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

  describe('GET /getUploadURL', () => {
    it('must get upload url', () => {
      const filename = 'test.jpg'

      cy.request({
        url: `/getUploadURL?filename=${filename}`,
        method: 'GET'
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.filename).to.be.a('string')
        expect(response.body.link).to.be.a('string')
        expect(response.body.link).to.contain('http')
      })
    })
  })

  describe('GET /getFiles', () => {
    it('must get files', () => {
      cy.request({
        url: `/getFiles?uuids=8843d5d1-42ab-4f39-86e5-4d694b7d2d80`,
        method: 'GET'
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.a('array')
      })
    })
  })
})
