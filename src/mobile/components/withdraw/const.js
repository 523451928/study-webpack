// Copyright 2016 CHEN Xianren. All rights reserved.

const obj = {
  InvalidUser: '不合法的用户',
  IncomeNotEnoughIncome: '余额不足',
  AlreadyWithdrawThisMonth: '本月已取现',
  AccountNotExist: '银行账户不存在',
  AccountNotBelongToUser: '银行账户错误',
  AddWithdrawFailed: '添加失败',
  NotLogin: '账号未登录',
  InvalidName: '名称不合法',
  InvalidAccount: '账号不合法',
  InvalidAccountType: '账号类型错误',
  InvalidBankName: '银行名称不合法',
  InvalidBankBranch: '支行名称不合法',
  AccountAlreadyBind: '该账号已绑定',
  MaxBindCountLimited: '账号数量超过限制，请先删除重试'
}

export function Errors(x) {
  return obj[x] ? obj[x] : x
}
