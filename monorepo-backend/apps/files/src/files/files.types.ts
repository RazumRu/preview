export interface IFileInfo {
  size: number
  contentType: string
  filename: string
  bucket: string
}

export interface IFileSyncJob {
  name: string
  uuid: string
}

export interface ICreateFileData extends IFileInfo {
  uuid: string
}
