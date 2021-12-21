import { Logger } from './logger'

describe(Logger, () => {
  const logger = new Logger()
  logger.init({
    environment: 'test',
    appName: 'test',
    appVersion: '1'
  })

  describe(logger.debug, () => {
    const pinoSpy = jest.spyOn(logger.getPino(), 'debug')

    it('should call debug', () => {
      logger.debug('message', {
        foo: 'bar'
      })

      expect(pinoSpy).toHaveBeenCalledTimes(1)
      expect(pinoSpy).toHaveBeenCalledWith({
        msg: 'message',
        level: 'debug',
        environment: 'test',
        appName: 'test',
        appVersion: '1',
        data: {
          foo: 'bar'
        }
      })
    })
  })

  describe(logger.log, () => {
    const pinoSpy = jest.spyOn(logger.getPino(), 'info')

    it('should call log', () => {
      logger.log('message', {
        foo: 'bar'
      })

      expect(pinoSpy).toHaveBeenCalledTimes(1)
      expect(pinoSpy).toHaveBeenCalledWith({
        msg: 'message',
        level: 'info',
        environment: 'test',
        appName: 'test',
        appVersion: '1',
        data: {
          foo: 'bar'
        }
      })
    })
  })

  describe(logger.verbose, () => {
    const pinoSpy = jest.spyOn(logger.getPino(), 'trace')

    it('should call verbose', () => {
      logger.verbose('message', {
        foo: 'bar'
      })

      expect(pinoSpy).toHaveBeenCalledTimes(1)
      expect(pinoSpy).toHaveBeenCalledWith({
        msg: 'message',
        level: 'verbose',
        environment: 'test',
        appName: 'test',
        appVersion: '1',
        data: {
          foo: 'bar'
        }
      })
    })
  })

  describe(logger.warn, () => {
    const pinoSpy = jest.spyOn(logger.getPino(), 'warn')

    it('should call warn', () => {
      logger.warn('message', {
        foo: 'bar'
      })

      expect(pinoSpy).toHaveBeenCalledTimes(1)
      expect(pinoSpy).toHaveBeenCalledWith({
        msg: 'message',
        level: 'warn',
        environment: 'test',
        appName: 'test',
        appVersion: '1',
        data: {
          foo: 'bar'
        }
      })
    })
  })

  describe(logger.error, () => {
    const pinoSpy = jest.spyOn(logger.getPino(), 'error')

    beforeEach(() => {
      pinoSpy.mockClear()
    })

    it('should call error with text', () => {
      logger.error('message', {
        foo: 'bar'
      })

      expect(pinoSpy).toHaveBeenCalledTimes(1)
      expect(pinoSpy).toHaveBeenCalledWith({
        msg: 'message',
        level: 'error',
        environment: 'test',
        appName: 'test',
        appVersion: '1',
        data: {
          foo: 'bar'
        }
      })
    })

    it('should call error with Error', () => {
      const error = new Error('message')
      logger.error(error, {
        foo: 'bar'
      })

      expect(pinoSpy).toHaveBeenCalledTimes(1)
      expect(pinoSpy).toHaveBeenCalledWith({
        msg: 'message',
        error,
        level: 'error',
        environment: 'test',
        appName: 'test',
        appVersion: '1',
        data: {
          foo: 'bar'
        }
      })
    })
  })

  describe(logger.sentryError, () => {
    it('should call sentryError', () => {
      logger.sentryError(new Error(), {})
    })
  })
})
