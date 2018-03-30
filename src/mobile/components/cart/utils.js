/* eslint-disable */
import { initListEntryObj } from 'components/public/display/app/display-util'
export function initItem(carts, entriesDetail, name = 'Item') {
  //  初始化所有item 数据，转成前端比较容易使用的数据
  // *select(选中状态) *count（购买数量） *id *money *moneyX（原价）*name(根据catId转换) *pictures *entries
  var initCarts = []
  _.each(carts, (cl) => {
    let item = cl[name]
    let thisIds = item.Entries
    let thisDetail = []
    let newItem = {}
    let entryParm
    newItem['Checked'] = cl.Checked
    newItem['Count'] = cl.Count
    newItem['Discount'] = cl.Discount
    newItem['Id'] = cl.Id
    newItem['Money'] = cl.Money
    newItem['Status'] = item['Status']
    newItem['PayMoney'] = cl.PayMoney
    newItem['Work'] = item['Work'] || item['SnapshotWork']
    newItem['CategoryId'] = item['CategoryId']
    if (cl.hasOwnProperty('Discount')) {
      newItem['MoneyX'] = parseInt(item.Money * 100 / item.Discount)
      newItem['MoneyDis'] = newItem['MoneyX'] - newItem['Money']
    }
    if (cl.hasOwnProperty('Price')) {
      newItem['Price'] = cl.Price
    }
    newItem['Name'] = cl.Name
    if (item.Pictures) {
      newItem['Pictures'] = item.Pictures[0]
    }
    newItem['BomDetail'] = []
    _.each(thisIds, id => {
      let thisEn = _.find(entriesDetail, (d) => {
        return d.Id === id
      })
      newItem['BomDetail'] = thisEn['Properties']
      thisDetail.push(thisEn)
    })
    newItem.EntriesDetail = thisDetail
    entryParm = initListEntryObj(thisDetail)
    newItem.displayer = entryParm.displayer
    newItem.entry = entryParm.entry
    newItem.Entries = item.Entries
    newItem.displays = entryParm.displays
    initCarts.push(newItem)
  })
  return initCarts
}

export function initOrderItem(carts, entriesDetail, name = 'Item') {
  //  初始化所有item 数据，转成前端比较容易使用的数据
  // *select(选中状态) *count（购买数量） *id *money *moneyX（原价）*name(根据catId转换) *pictures *entries
  var initCarts = []
  _.each(carts, (cl) => {
    let item = cl[name]
    let thisIds = item.Entries
    let thisDetail = []
    let newItem = {}
    let entryParm
    newItem['Count'] = cl.Count
    newItem['Discount'] = cl.Item.Discount
    newItem['Id'] = cl.Id
    newItem['Money'] = cl.Item.Money
    newItem['IsCustom'] = cl.Item.Work ? false : true  // 是否为定制产品
    newItem['IsShop'] = !newItem['IsCustom']  // 是否为商店产品
    newItem['ProductId'] = cl.Item.Packets // 产品Id
    if (cl.Item.Work) {
      newItem['WorkId'] = cl.Item.Work.Id         // 作品Id
      newItem['ArtistId'] = cl.Item.Work.UserId   // 艺术家Id
      newItem['WorkTitle'] = cl.Item.Work.Title   // 作品title
    }
    newItem['Work'] = item['Work'] || item['SnapshotWork']
    newItem['CategoryId'] = cl.Item['CategoryId']
    if (cl.hasOwnProperty('Discount')) {
      newItem['MoneyX'] = parseInt(item.Money * 100 / item.Discount)
      newItem['MoneyDis'] = newItem['MoneyX'] - newItem['Money']
    }
    if (cl.Item.hasOwnProperty('Price')) {
      newItem['Price'] = cl.Item.Price
    }
    newItem['Name'] = cl.Name
    newItem['Pictures'] = item.Pictures[0]
    newItem['BomDetail'] = []
    _.each(thisIds, id => {
      let thisEn = _.find(entriesDetail, (d) => {
        return d.Id === id
      })
      newItem['BomDetail'] = thisEn['Properties']

      thisDetail.push(thisEn)
    })
    newItem.EntriesDetail = thisDetail
    entryParm = initListEntryObj(thisDetail)
    newItem.displayer = entryParm.displayer
    newItem.entry = entryParm.entry
    newItem.Entries = item.Entries
    newItem.displays = entryParm.displays
    initCarts.push(newItem)
  })
  return initCarts
}

export function freshTotal(carts) {
  var total = {
    money: 0,
    count: 0
  }
  _.each(carts, (item) => {
    if (item.Checked) {
      total.count += item.Count
      total.money += item.Money * item.Count
    }
  })
  return {
    totalMoney: total.money,
    totalCount: total.count
  }
}

export function orderFreshTotal(carts) {
  var total = {
    money: 0,
    count: 0
  }
  _.each(carts, (item) => {
    total.count += item.Count
    total.money += item.Money * item.Count
  })
  return {
    totalMoney: total.money,
    totalCount: total.count
  }
}

