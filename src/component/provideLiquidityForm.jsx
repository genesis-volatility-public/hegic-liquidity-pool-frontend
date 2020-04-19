import React from "react";
import { DAI_TOKEN_ABI, DAI_ADDRESS, POOL_ABI, POOL_ADDRESS } from "../config";
import Web3 from "web3";

export default class ProvideLiquidityForm extends React.Component {
  constructor(props) {
    super(props);

    this.provideToPool = this.provideToPool.bind(this);
  }

  async provideToPool(daiAmount) {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    const daiValue = (daiAmount / Math.pow(10, -18)).toString();
    const PoolContract = new web3.eth.Contract(POOL_ABI, POOL_ADDRESS);
    PoolContract.methods
      .provide(daiValue)
      .send({ from: account })
      .once("receipt", (receipt) => {
        console.log(receipt);
      });
    console.log(daiAmount);
  }

  render() {
    return (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          this.provideToPool(this.task.value);
        }}
      >
        <input
          id="ApproveDai"
          ref={(input) => (this.task = input)}
          type="text"
          className="form-control"
          placeholder="Dai Amount to Add to Liquidity Pool"
          required
          style={{ width: "300px", height: "20px" }}
        />
        <input type="submit" />
      </form>
    );
  }
}
