import {
  DecorativeCategories as dc,
  MaterialTypes as mt,
} from "scripts/utils/custom/consts.js" 
/**
 * 根据品类id和已有物料,过滤出incomes中所需的物料
 * @param {Number} id 品类id
 * @param {income} Object 对应的一个尺寸的income
 * @param {Array} materiasls 物料数据
 * @return {Array} r 最终返回的选择的物料数组
 */
export let filterCatMaterials = (id, income, materials) => {
  let r = []
  const m = materials
  switch (id) {
    case dc.Frame:
    case dc.Matless:
    case dc.Frames:
      for (let k of income.Materials) {
        for (let i of m.filter(v => v.Type !== mt.Mat)) {
          if (k === i.Id) {
            r.push(i)
            continue
          }
        }
      }
      for (let k of income) {
        let id = k.Packets[0]
        let color = k.Options
        for (let i of this.materialList.filter(v => v.Type === mt.Mat)) {
          if (i.Id === id) {
            let options = []
            i.Properties.Options.forEach((item) => {
              if (color.some(v => Number(v) === Number(item.Property.OptionId))) {
                options.push(item)
              }
            })
            i.Properties.Options = options
            materlist.push(i)
            break
          }
        }
      }
      break
  }
}