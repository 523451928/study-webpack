// Copyright 2016 CHEN Xianren. All rights reserved.

const obj = {
  NameAlreadyExists: '相册名称已存在',
  AlbumCountOverLimit: '相册数量超过限制',
  AlbumNotExist: '相册不存在',
  AlbumHasImage: '不允许删除有图片的相册',
  CoverNotExist: '封面不存在',
  CoverNotInAlbum: '封面不在相册中',
  RemoveDefaultNotAllow: '不允许删除默认相册',
  FileTooSmall: '文件太小',
  FileTooLarge: '文件太大',
  FileUnsupported: '文件类型不支持',
  WidthTooSmall: '图片宽太小',
  WidthTooLarge: '图片宽太大',
  HeightTooSmall: '图片高太小',
  HeightTooLarge: '图片高太大',
  UploadNothing: '图片上传失败',
  EmptySet: '不能为空'
}
export function Errors(x) {
  return obj[x] ? obj[x] : x
}
