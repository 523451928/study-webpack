/* eslint-disable */
import { DecorativeCategories as dc } from './consts'
/**
 * 过滤制定类型的物料
 * @param {Array} list  物料数组 
 * @param {Number} type 物料类型
 */
export function filterTypeMat(list, type) {
  if (!Array.isArray(list)) return
  return list.filter(item => {
    if (item.Type) return item.Type === type
  })
}

/**
 * 过滤指定id的物料
 * @param {Array} list  物料数组
 * @param {Number} id categoryId
 */
export function filterCatIdMat(list, id) {
  if (!Array.isArray(list)) return
  let b = list.filter(item => {
    if (id === dc.Frame || id === dc.Frames || id === dc.Matless) {
      return item.CategoryId === dc.Frame || item.CategoryId === dc.Frames || item.CategoryId === dc.Matless
    } else {
      return item.CategoryId === id
    }
  })
  return b
}