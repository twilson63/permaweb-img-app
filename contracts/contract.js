import { AddPair, CancelOrder, CreateOrder, Halt } from "@verto/flex";

export async function handle(state, action) {
  const { input, caller } = action
  const balances = state.balances
  // tradeable state
  const claimable = state.claimable;
  const claims = state.claims;


  if (input.function === "claim") {
    // Claim input: txID
    const txID = input.txID;
    // Claim qty
    const qty = input.qty;

    // Check to make sure it hasn't been claimed already
    for (let i = 0; i < claims.length; i++) {
      if (claims[i] === txID) {
        console.log('Already Claimed!')
        return { state }
        //throw new ContractError("This claim has already been made");
      }
    }

    if (!claimable.length) {
      throw new ContractError("Contract has no claims available");
    }
    // Search for txID inside of `claimable`
    let obj, index;
    for (let i = 0; i < claimable.length; i++) {
      if (claimable[i].txID === txID) {
        index = i;
        obj = claimable[i];
      }
    }
    if (obj === undefined) {
      throw new ContractError("Unable to find claim");
    }
    if (obj.to !== caller) {
      throw new ContractError("Claim not addressed to caller");
    }
    if (obj.qty !== qty) {
      throw new ContractError("Claiming incorrect quantity of tokens");
    }
    // Check to make sure it hasn't been claimed already
    for (let i = 0; i < claims.length; i++) {
      if (claims[i] === txID) {
        throw new ContractError("This claim has already been made");
      }
    }
    if (!Number.isInteger(balances[caller])) balances[caller] = 0;
    // Not already claimed --> can claim
    balances[caller] += obj.qty;

    // remove from claimable
    claimable.splice(index, 1);

    // add txID to `claims`
    claims.push(txID);

    return { state };
  }

  if (input.function === "allow") {
    const target = input.target;
    const quantity = input.qty;

    if (!Number.isInteger(quantity) || quantity === undefined) {
      throw new ContractError(
        "Invalid value for quantity. Must be an integer."
      );
    }
    if (!target) {
      throw new ContractError("No target specified.");
    }
    if (quantity <= 0 || caller === target) {
      throw new ContractError("Invalid token transfer.");
    }
    if (balances[caller] < quantity) {
      throw new ContractError(
        "Caller balance not high enough to make claimable " +
        quantity +
        " token(s)."
      );
    }

    balances[caller] -= quantity;
    claimable.push({
      from: caller,
      to: target,
      qty: quantity,
      txID: SmartWeave.transaction.id,
    });

    return { state };
  }

  if (input.function === "addPair") {
    const _ = await AddPair(state, action)
    return { state: _.state };
  }

  if (input.function === "cancelOrder") {
    const _ = await CancelOrder(state, action)
    return { state: _.state };
  }

  if (input.function === "createOrder") {
    const _ = await CreateOrder(state, action);
    return { state: _.state }
  }

  if (input.function === "halt") {
    const _ = await Halt(state, action);
    return { state: _.state };
  }

  if (input.function === "balance") {
    let target;
    if (!input.target) {
      target = caller;
    } else {
      target = input.target;
    }
    const ticker = state.ticker;

    ContractAssert(typeof target === "string", "Must specify target to get balance for.")
    ContractAssert(typeof balances[target] === "number", "Cannot get balance; target does not exist.")

    return {
      result: {
        target,
        ticker,
        balance: balances[target],
      },
    };
  }

  if (input.function === 'transfer') {
    const { qty, target } = input
    ContractAssert(target, 'target MUST be defined')
    ContractAssert(target !== caller, 'target can not be caller')
    ContractAssert(typeof qty === 'number', 'qty MUST be a number')
    ContractAssert(qty > 0, 'qty MUST be greater than zero')
    ContractAssert(balances[caller] >= qty, 'caller does not have enough qty')

    state.balances[caller] -= qty
    if (!state.balances[target]) {
      state.balances[target] = qty
    } else {
      state.balances[target] += qty
    }

    return { state }
  }
  return { state }
}