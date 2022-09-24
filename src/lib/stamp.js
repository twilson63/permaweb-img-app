import { WarpFactory, defaultCacheOptions } from 'warp-contracts/web'
import { add, compose, propEq, values, length, prop, filter, reduce, pluck } from 'ramda'

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
})

const warp = WarpFactory.forMainnet({ ...defaultCacheOptions, inMemory: true })
const CACHE = 'https://cache.permapages.app'

const STAMPCOIN = 'aSMILD7cEJr93i7TAVzzMjtci_sGkXcWnqpDkG6UGcA'
let data = null

const stampCount = asset => compose(
  length,
  filter(propEq('asset', asset)),
  values,
  prop('stamps')
)

const rewardSum = asset => compose(
  reduce(add, 0),
  pluck('coins'),
  filter(propEq('asset', asset)),
  prop('rewardLog')
)

export async function stamp(transactionId) {
  return warp.contract(STAMPCOIN).connect('use_wallet').writeInteraction({
    function: 'stamp',
    transactionId,
    timestamp: Date.now()
  })
    .then(x => fetch(`${CACHE}/${STAMPCOIN}`)
      .then(res => res.json())
      .then(state => (data = state, data))
      .then(_ => x)
    )
}

export async function isVouched(addr) {
  return arweave.api.post('graphql', {
    query: `
query {
  transactions(tags: {name: "Vouch-For", values: ["${addr}"]}) {
    edges {
      node {
        id
      }
    }
  }
}
  `}).then(result => (result.data?.data?.transactions?.edges || []).length > 0)
}

export async function getCount(asset) {
  // temporarily cache data during session
  if (data) {
    return stampCount(asset)(data)
  }

  return fetch(`${CACHE}/${STAMPCOIN}`)
    .then(res => res.json())
    .then(state => (data = state, state))
    .then(stampCount(asset))
}

export async function getRewards(asset) {
  // temporarily cache data during session
  if (data) {
    return rewardSum(asset)(data)
  }
  return fetch(`${CACHE}/${STAMPCOIN}`)
    .then(res => res.json())
    .then(state => (data = state, state))
    .then(rewardSum(asset))
}