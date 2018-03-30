// Copyright 2016 CHEN Xianren. All rights reserved.

const obj = {
  EmailVerifyIncorrect: '邮件验证码错误',
  EmailAlreadyExists: '邮箱已存在',
  MobileAlreadyExists: '手机已存在',
  MobileVerifyIncorrect: '手机验证码错误',
  NicknameAlreadyExists: '昵称已存在',
  VerifyIncorrect: '短信或邮件验证码错误',
  AccountNotExist: '账号不存在',
  UserDisabled: '用户已禁用',
  AccountAlreadyExists: '账号已存在',
  CaptchaIncorrect: '图片验证码错误',
  LoginFailed: '账号或密码不正确',
  SendFailed: '发送失败',
  InvalidAccount: '账号不正确',
  AlreadyLogin: '已经登录',
  NotLogin: '未登录'
}
export function Errors(x) {
  return obj[x] ? obj[x] : x
}
