import { compose, prop, propEq, find, map, pluck, path } from 'ramda'


export async function imagesByOwner(addr) {
  return fetch('https://arweave.net/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: `
query {
  transactions(first: 100, owners: ["${addr}"], tags: {name: "Type", values: ["image"]}) {
    edges {
      node {
        id
        tags {
          name
          value
        }
        owner {
          address
        }
        block {
          timestamp
        }
      }
    }
  }
}    
    `})
  }).then(res => res.ok ? res.json() : Promise.reject(new Error('ERROR: STATUS ' + res.status)))
    .then(compose(
      map(transformTx),
      pluck('node'),
      path(['data', 'transactions', 'edges'])

    ))

}

export async function getAssetData(id) {
  return fetch(`https://arweave.net/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: query(id) })
  }).then(res => res.json())
    .then(({ data }) => ({
      title: prop('value', find(propEq('name', 'Title'), data.transaction.tags)),
      description: prop('value', find(propEq('name', 'Description'), data.transaction.tags)),
      type: prop('value', find(propEq('name', 'Type'), data.transaction.tags)),
      owner: data.transaction.owner.address
    }))
  //.then(_ => ({ title: 'Test', description: 'Description' }))
}

function query(id) {
  return `
query {
  transaction(id: "${id}") {
    id
    owner {
      address
    }
    tags {
      name
      value
    }
  }
}
  
  `
}

function transformTx(node) {
  return ({
    id: node.id,
    title: prop('value', find(propEq('name', 'Title'), node.tags)),
    type: prop('value', find(propEq('name', 'Type'), node.tags)),
    description: prop('value', find(propEq('name', 'Description'), node.tags)),
    owner: node.owner.address,
    timestamp: node?.block?.timestamp || Date.now() / 1000
  })

}
