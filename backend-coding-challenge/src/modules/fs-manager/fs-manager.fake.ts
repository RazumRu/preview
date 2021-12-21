import { IDir, IFsManager } from './fs-manager.types'
import path from 'path'

export class FsManagerFake implements IFsManager {
  private readonly filesystem: Map<string, IDir> = new Map([
    [
      path.sep,
      {
        name: path.sep,
        path: '',
        isRoot: true,
        subdirs: new Map()
      }
    ]
  ])

  private getRootDir(): IDir {
    const root = this.filesystem.get(path.sep)

    if (!root) {
      throw Error(`Root ditectory not found`)
    }

    return root
  }

  private splitPath(pathname: string) {
    return (pathname || '').split(path.sep).filter((p) => !!p)
  }

  public async createDir(pathname: string): Promise<void> {
    const elements = this.splitPath(pathname)

    let currentDir = this.getRootDir()
    for (const el of elements) {
      const key = el.toLowerCase()
      const subdir = currentDir.subdirs.get(key)

      if (subdir) {
        currentDir = subdir
      } else {
        const newDir = {
          name: el,
          subdirs: new Map(),
          parent: currentDir,
          isRoot: false,
          path: path.join(currentDir.path, el)
        }
        currentDir.subdirs.set(key, newDir)

        currentDir = newDir
      }
    }
  }

  public async getDir(pathname?: string): Promise<IDir> {
    if (!pathname) {
      return this.getRootDir()
    }

    const elements = this.splitPath(pathname)

    let currentDir = this.getRootDir()
    for (const el of elements) {
      const key = el.toLowerCase()
      const subdir = currentDir.subdirs.get(key)

      if (!subdir) {
        throw Error(`${path.join(currentDir.path, el)} does not exist`)
      }

      currentDir = subdir
    }

    return currentDir
  }

  public async deleteDir(pathname: string): Promise<void> {
    try {
      const dir = await this.getDir(pathname)

      dir.parent?.subdirs.delete(dir.name.toLowerCase())
    } catch (e) {
      const { message } = e as Error

      throw Error(`Cannot delete ${pathname} - ${message}`)
    }
  }

  public async printDirs(pathname?: string): Promise<void> {
    try {
      const dir = await this.getDir(pathname)

      ;(function printDir(dir: IDir, tabs = 0) {
        if (!dir.isRoot) {
          console.log(new Array(tabs).fill('\t').join('') + dir.name)
          tabs++
        }

        if (dir.subdirs.size > 0) {
          for (const d of dir.subdirs.values()) {
            printDir(d, tabs)
          }
        }
      })(dir)
    } catch (e) {
      const { message } = e as Error

      throw Error(`Cannot print ${pathname} - ${message}`)
    }
  }

  public async moveDir(pathname: string, target: string): Promise<void> {
    try {
      const initialDir = await this.getDir(pathname)
      const targetDir = await this.getDir(target)

      await this.deleteDir(initialDir.path)
      targetDir.subdirs.set(initialDir.name.toLowerCase(), initialDir)
      initialDir.parent = targetDir

      // replace paths
      this.syncPaths(targetDir)
    } catch (e) {
      const { message } = e as Error

      throw Error(`Cannot move ${pathname} - ${message}`)
    }
  }

  /**
   * Updates all absolute folder paths
   * @param dir
   * @private
   */
  private syncPaths(dir: IDir) {
    for (const d of dir.subdirs.values()) {
      d.path = path.join(dir.path, d.name)

      this.syncPaths(d)
    }
  }
}
