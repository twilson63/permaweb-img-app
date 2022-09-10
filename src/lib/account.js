import Account from 'arweave-account'

const account = new Account()

export async function getProfile(addr) {
  const res = await account.get(addr);
  console.log(res)
  return res
}