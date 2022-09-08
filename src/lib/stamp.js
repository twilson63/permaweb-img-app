import { WarpFactory, defaultCacheOptions } from 'warp-contracts/web'

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
})

const warp = WarpFactory.forMainnet({ ...defaultCacheOptions, inMemory: true })
const cache = 'https://cache.permapages.app'

const STAMPCOIN = 'aSMILD7cEJr93i7TAVzzMjtci_sGkXcWnqpDkG6UGcA'

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