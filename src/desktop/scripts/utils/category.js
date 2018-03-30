/*eslint-disable*/
import {
	categoryImgSize,
	DecorativeCategories as dc,
	MaterialTypes as mt,
	Angles,
	StackLines,
	Fulls,
	tabs,
	product,
	Directions,
	catNameIdMap,
	SuggestSize as ss
} from "scripts/utils/custom/consts.js" // 一些常量

/*物料操作方法*/
export function formCategoryList(list) {
	if (list.constructor !== Array) return []
	let r = []
	for (let k of list) {
		let parentId = k.ParentId
		let id = k.Id
		if (!parentId) {
			if (id === 9 || id === 13) {
				continue
			}
			r.push(k)
		} else {
			if (parentId === dc.Frames) {
				continue
			}
			r.push(k)
		}
	}
	return r
}
export let categoryUtil = {
  /**
   * 过滤物料
   * @param      {Array}  list    需要过滤的品类
   */
  filtering(list) {
    let b = []
    if (Array.isArray(list) && list.length > 0) {
      for (let i of list) {
        if (i.Id === 9 || i.Id === 8 || i.Id === 13 || i.Id === 3 || i.Id === 24) {
          continue
        } else {
          b.push(i.Id)
        }
      }
      return b
    }
  },
  /**
   * 将list做成一个映射表
   *
   * @param      {<Array>}  list    需要过滤的品类
   */
  categoryMap(list) {
    let m = new Map()
    for (let i of list) {
      if (i.Id === 9 || i.Id === 8 || i.Id === 13 || i.Id === 3 || i.Id === 24) {
        continue
      } else {
        m.set(i.Id, i)
      }
    }
    return m
  },
  /**
   * 过滤数据, 首先判断是否是叶子节点,并且给装饰画做一个归并
   *
   * @param      {Array}  list    需要过滤的列表, 做成一个map类型
   */
   filtering2(list) {
     if (!Array.isArray(list)) {
       return
     }
     let _map = new Map()
     for (let i of list) {
       if (i.Id === 9 || i.Id === 3 || i.Id === 5 || i.Id === 7) {
         continue
       }
       // 如果存在父节点
       if (i.ParentId) {
         if (i.Id === 1 || i.Id === 8 || i.Id === 6 ) {
           if (!_map.has(8)) {
             let o = Object.assign(i, {
               Id: 8,
               Name: '有框画',
               ParentId: 9
             })
             _map.set(8, o)
           } else {
             continue
           }
         } else {
           _map.set(i.Id, i)
         }
       } else {
         // 如果是T
         if (i.Id === 13) {
           continue
         } else {
           _map.set(i.Id, i)
         }
       }
     }
     return _map
   },
   /**
    * 获得所有的map类型
    *
    * @param      {Array}  list    The list
    */
   allMap(list) {
     let m = new Map()
     list.forEach(item => {
       m.set(item.Id, item)
     })
     return m
   }
}