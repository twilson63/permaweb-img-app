import { WarpFactory, defaultCacheOptions } from 'warp-contracts/web'
import { add, compose, propEq, values, length, prop, filter, reduce, pluck, path } from 'ramda'
import Stamps from '@permaweb/stampjs'

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
})

const warp = WarpFactory.forMainnet({ ...defaultCacheOptions, inMemory: true })
const DRE = 'https://dre-1.warp.cc'
const stamps = Stamps.init({ warp, arweave })

const STAMPCOIN = __STAMP_CONTRACT__
let data = null

const stampCount = asset => stamps.count(asset).then(r => r.total)

// const rewardSum = asset => compose(
//   reduce(add, 0),
//   pluck('coins'),
//   filter(propEq('asset', asset)),
//   prop('balances')
// )

export async function stamp(transactionId) {
  return stamps.stamp(transactionId)
}

export async function getCount(asset) {
  return stampCount(asset)
}

