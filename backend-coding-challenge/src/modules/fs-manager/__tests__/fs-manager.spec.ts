import 'jest-extended'
import { FsManagerFake } from '../fs-manager.fake'
console.log = jest.fn()

const getFsManagerInstance = () => {
  return new FsManagerFake()
}

describe('fs-manager', () => {
  describe('createDir', () => {
    it(`should create dir`, async () => {
      const instance = getFsManagerInstance()

      await instance.createDir('a/b')

      // a
      {
        const dir = await instance.getDir('a')

        expect(dir.name).toEqual('a')
        expect(dir.path).toEqual('a')
        expect(dir.isRoot).toEqual(false)
        expect(dir.parent).toBeTruthy()
        expect(dir.subdirs.size).toEqual(1)
      }

      // a/b
      {
        const dir = await instance.getDir('a/b')

        expect(dir.name).toEqual('b')
        expect(dir.path).toEqual('a/b')
        expect(dir.isRoot).toEqual(false)
        expect(dir.parent).toBeTruthy()
        expect(dir.subdirs.size).toEqual(0)
      }
    })

    it(`should create dir inside another dir`, async () => {
      const instance = getFsManagerInstance()

      await instance.createDir('a')
      await instance.createDir('a/b')

      // a
      {
        const dir = await instance.getDir('a')

        expect(dir.name).toEqual('a')
        expect(dir.path).toEqual('a')
        expect(dir.isRoot).toEqual(false)
        expect(dir.parent).toBeTruthy()
        expect(dir.subdirs.size).toEqual(1)
      }

      // a/b
      {
        const dir = await instance.getDir('a/b')

        expect(dir.name).toEqual('b')
        expect(dir.path).toEqual('a/b')
        expect(dir.isRoot).toEqual(false)
        expect(dir.parent).toBeTruthy()
        expect(dir.subdirs.size).toEqual(0)
      }
    })
  })

  describe('getDir', () => {
    it(`should get dir`, async () => {
      const instance = getFsManagerInstance()

      await instance.createDir('a')

      // a
      {
        const dir = await instance.getDir('a')

        expect(dir.name).toEqual('a')
        expect(dir.path).toEqual('a')
        expect(dir.isRoot).toEqual(false)
        expect(dir.parent).toBeTruthy()
        expect(dir.subdirs.size).toEqual(0)
      }
    })

    it(`should get root dir`, async () => {
      const instance = getFsManagerInstance()

      const dir = await instance.getDir()

      expect(dir.name).toEqual('/')
      expect(dir.path).toEqual('')
      expect(dir.isRoot).toEqual(true)
      expect(dir.parent).toBeFalsy()
      expect(dir.subdirs.size).toEqual(0)
    })

    it(`should throw error if dir not found`, async () => {
      const instance = getFsManagerInstance()

      await expect(instance.getDir('unknown')).rejects.toThrowWithMessage(
        Error,
        /does not exist/
      )
    })
  })

  describe('moveDir', () => {
    it(`should move dir`, async () => {
      const instance = getFsManagerInstance()

      await instance.createDir('a')
      await instance.createDir('b')
      await instance.moveDir('a', 'b')

      // check old dir
      await expect(instance.getDir('a')).rejects.toThrowWithMessage(
        Error,
        /does not exist/
      )

      // check moved dir
      {
        const dir = await instance.getDir('b/a')

        expect(dir.name).toEqual('a')
        expect(dir.path).toEqual('b/a')
        expect(dir.parent?.path).toEqual('b')
      }

      // check b dir
      {
        const dir = await instance.getDir('b')

        expect(dir.name).toEqual('b')
        expect(dir.path).toEqual('b')
        expect(dir.subdirs.size).toEqual(1)
      }
    })

    it(`should move dir several times`, async () => {
      const instance = getFsManagerInstance()

      await instance.createDir('a')
      await instance.createDir('b')
      await instance.createDir('c')
      await instance.moveDir('a', 'b')
      await instance.moveDir('b/a', 'c')

      // check old dir
      await expect(instance.getDir('a')).rejects.toThrowWithMessage(
        Error,
        /does not exist/
      )

      await expect(instance.getDir('b/a')).rejects.toThrowWithMessage(
        Error,
        /does not exist/
      )

      // check moved dir
      {
        const dir = await instance.getDir('c/a')

        expect(dir.name).toEqual('a')
        expect(dir.path).toEqual('c/a')
        expect(dir.parent?.path).toEqual('c')
      }
    })

    it(`should move dir and all subdirs`, async () => {
      const instance = getFsManagerInstance()

      await instance.createDir('a/c')
      await instance.createDir('b')
      await instance.moveDir('a', 'b')

      // check old dir
      await expect(instance.getDir('a/c')).rejects.toThrowWithMessage(
        Error,
        /does not exist/
      )

      await expect(instance.getDir('a')).rejects.toThrowWithMessage(
        Error,
        /does not exist/
      )

      // check moved dir
      {
        const dir = await instance.getDir('b/a/c')

        expect(dir.name).toEqual('c')
        expect(dir.path).toEqual('b/a/c')
        expect(dir.parent?.path).toEqual('b/a')
      }

      // check b dir
      {
        const dir = await instance.getDir('b')

        expect(dir.name).toEqual('b')
        expect(dir.path).toEqual('b')
        expect(dir.subdirs.size).toEqual(1)
      }

      // check a dir
      {
        const dir = await instance.getDir('b/a')

        expect(dir.name).toEqual('a')
        expect(dir.path).toEqual('b/a')
        expect(dir.subdirs.size).toEqual(1)
        expect(dir.parent?.path).toEqual('b')
      }
    })

    it(`should throw error if some dir not found`, async () => {
      const instance = getFsManagerInstance()

      await instance.createDir('b')

      // check old dir
      await expect(instance.moveDir('a', 'b')).rejects.toThrowWithMessage(
        Error,
        /does not exist/
      )

      // check target dir
      await expect(instance.moveDir('b', 'a')).rejects.toThrowWithMessage(
        Error,
        /does not exist/
      )
    })
  })

  describe('deleteDir', () => {
    it(`should delete dir`, async () => {
      const instance = getFsManagerInstance()

      await instance.createDir('a')
      await instance.deleteDir('a')

      // check old dir
      await expect(instance.getDir('a')).rejects.toThrowWithMessage(
        Error,
        /does not exist/
      )
    })

    it(`should delete dir after move`, async () => {
      const instance = getFsManagerInstance()

      await instance.createDir('a')
      await instance.createDir('b')
      await instance.moveDir('a', 'b')
      await instance.deleteDir('b/a')

      // check old dir
      await expect(instance.getDir('b/a')).rejects.toThrowWithMessage(
        Error,
        /does not exist/
      )

      const dir = await instance.getDir('b')
      expect(dir).toBeTruthy()
    })

    it(`should delete dir and subdirs`, async () => {
      const instance = getFsManagerInstance()

      await instance.createDir('a/b')
      await instance.deleteDir('a')

      // check old dir
      await expect(instance.getDir('a')).rejects.toThrowWithMessage(
        Error,
        /does not exist/
      )

      // check old dir
      await expect(instance.getDir('a/b')).rejects.toThrowWithMessage(
        Error,
        /does not exist/
      )
    })

    it(`should delete only subdir`, async () => {
      const instance = getFsManagerInstance()

      await instance.createDir('a/b')
      await instance.deleteDir('a/b')

      const dir = await instance.getDir('a')
      expect(dir.name).toEqual('a')
      expect(dir.subdirs.size).toEqual(0)

      // check old dir
      await expect(instance.getDir('a/b')).rejects.toThrowWithMessage(
        Error,
        /does not exist/
      )
    })

    it(`should throw error if dir not found`, async () => {
      const instance = getFsManagerInstance()

      await instance.createDir('a')

      // check dir
      await expect(instance.deleteDir('a/b')).rejects.toThrowWithMessage(
        Error,
        /Cannot delete/
      )
    })
  })

  describe('printDirs', () => {
    it(`should print all dirs`, async () => {
      const instance = getFsManagerInstance()
      const rand = Math.random()

      await instance.createDir(`${rand}a/${rand}b`)
      await instance.createDir(`${rand}c`)
      await instance.createDir(`${rand}del`)
      await instance.createDir(`${rand}move`)
      await instance.moveDir(`${rand}move`, `${rand}c`)
      await instance.deleteDir(`${rand}del`)

      await instance.printDirs()

      // check old dir
      expect(console.log).toHaveBeenCalledWith(`${rand}a`)
      expect(console.log).toHaveBeenCalledWith(`\t${rand}b`)
      expect(console.log).toHaveBeenCalledWith(`${rand}c`)
      expect(console.log).toHaveBeenCalledWith(`\t${rand}move`)
    })

    it(`should print all dirs in some path`, async () => {
      const instance = getFsManagerInstance()
      const rand = Math.random()

      await instance.createDir(`${rand}a/${rand}b/${rand}c`)

      await instance.printDirs(`${rand}a/${rand}b`)

      // check old dir
      expect(console.log).not.toHaveBeenCalledWith(`${rand}a`)
      expect(console.log).toHaveBeenCalledWith(`${rand}b`)
      expect(console.log).toHaveBeenCalledWith(`\t${rand}c`)
    })

    it(`should throw error if dir not exists`, async () => {
      const instance = getFsManagerInstance()

      await expect(instance.printDirs('unknown')).rejects.toThrowWithMessage(
        Error,
        /Cannot print/
      )
    })
  })
})
