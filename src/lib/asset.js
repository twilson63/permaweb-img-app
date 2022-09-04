import { prop, propEq, find } from 'ramda'

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
      type: prop('value', find(propEq('name', 'Type'), data.transaction.tags))
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