import Account from 'arweave-account'
import { prop, propEq, find, head, split } from 'ramda'

const account = new Account()

const ANS = 'HrPi8hFc7M5dbrtlELfTKwPr53RRrDBgXGdDkp0h-j4'
const CACHE = 'https://cache.permapages.app'
const DRE = 'https://dre-1.warp.cc'

export async function getProfile(addr) {
  const res = await account.get(addr);
  console.log(res)
  return res
}

export async function accountByANS(name) {

  return fetch(`${DRE}/contract?id=${ANS}&query=$.users`).then(res => res.ok ? res.json() : Promise.reject('CONTRACT NOT FOUND!'))
    .then(r => r.result[0])
    .then(find(propEq('currentLabel', head(split('.', name)))))
    .then(user => user ? user : ({}))
}