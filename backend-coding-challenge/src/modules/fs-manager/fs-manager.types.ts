/**
 * File system management. Allows you to delete, create, move and view the directory listing
 */
export interface IFsManager {
  /**
   * Create dir and all subdirs
   * @param path
   */
  createDir(path: string): Promise<void>

  /**
   * Get dir and all subdirs
   * @param path
   */
  getDir(path: string): Promise<IDir>

  /**
   * Move some dir (if exists) to another place (also if exists)
   * @param path
   * @param target
   */
  moveDir(path: string, target: string): Promise<void>

  /**
   * Print all directories in some place
   * @param path
   */
  printDirs(path?: string): Promise<void>

  /**
   * delete some dir (if exists) and all subdirs
   * @param path
   */
  deleteDir(path: string): Promise<void>
}

export interface IDir {
  name: string
  path: string
  isRoot: boolean
  parent?: IDir
  subdirs: Map<string, IDir>
}
