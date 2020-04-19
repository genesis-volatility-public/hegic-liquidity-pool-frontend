import React from "react";
import { DAI_TOKEN_ABI, DAI_ADDRESS, POOL_ABI, POOL_ADDRESS } from "../config";
import Web3 from "web3";
import ProvideLiquidityForm from "./provideLiquidityForm";

export default class ApproveDaiForm extends React.Component {
  constructor(props) {
    super(props);

    this.unlockDai = this.unlockDai.bind(this);
  }
  async unlockDai(daiAmount) {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    const daiValue = (daiAmount / Math.pow(10, -18)).toString();
    const DaiContract = new web3.eth.Contract(DAI_TOKEN_ABI, DAI_ADDRESS);
    DaiContract.methods
      .approve("0x009c216b7e86e5c38af14fcd8c07aab3a2e7888e", daiValue)
      .send({ from: account })
      .once("receipt", (receipt) => {
        console.log(receipt);
      });
    console.log(typeof (daiAmount / Math.pow(10, -18)));
  }

  render() {
    return (
      <div className="row">
        <div className="col-lg-6">
          <h4>Step 1: Approve an amount of DAI on the DAI Token Contract </h4>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              this.unlockDai(this.task.value);
            }}
          >
            <input
              id="ApproveDai"
              ref={(input) => (this.task = input)}
              type="text"
              className="form-control"
              placeholder="Amount of Dai to Approve for Pool"
              required
              style={{ width: "300px", height: "20px" }}
            />
            <input type="submit" />
          </form>
        </div>

        <div className="col-lg-6" style={{ marginTop: "50px" }}>
          <h4>
            Step 2: Provide an amount of DAI to the writeDAI liquidity pool
            contract
          </h4>
          <ProvideLiquidityForm />
        </div>
      </div>
    );
  }
}
