import { WarpFactory, defaultCacheOptions } from 'warp-contracts/web'
import { compose, propEq, values, length, prop, filter } from 'ramda'

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
})

const warp = WarpFactory.forMainnet({ ...defaultCacheOptions, inMemory: true })
const CACHE = 'https://cache.permapages.app'

const STAMPCOIN = 'aSMILD7cEJr93i7TAVzzMjtci_sGkXcWnqpDkG6UGcA'

const stampCount = asset => compose(
  length,
  filter(propEq('asset', asset)),
  values,
  prop('stamps')
)

export async function stamp(transactionId) {
  return warp.contract(STAMPCOIN).connect('use_wallet').writeInteraction({
    function: 'stamp',
    transactionId,
    timestamp: Date.now()
  })
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
  return fetch(`${CACHE}/${STAMPCOIN}`)
    .then(res => res.json())
    .then(stampCount(asset))
}