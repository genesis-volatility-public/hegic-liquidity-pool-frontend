import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "antd";
import Web3 from "web3";
import SwitchNetworkNotice from "./SwitchNetworkNotice";
import Typography from "@material-ui/core/Typography";
import DownloadMetaMaskButton from "./DownloadMetaMaskButton";
import Eth from "ethjs-query";
import { Link } from "react-router-dom";
import queryString from "querystringify";
import { DAI_TOKEN_ABI, DAI_ADDRESS, POOL_ABI, POOL_ADDRESS } from "./config";

class HomePage extends Component {
  constructor(props) {
    const {
      tokenNet = "1",
      message = "",
      errorMessage = "",
      net = "1",
    } = props;

    super();
    this.state = {
      tokenNet,
      message,
      errorMessage,
      net,
      account: "",
      locked: null,
      balance: null,
      contract: null,
      daiInPool: null,
      addressShareOfPool: null,
    };

    const search = window.location.search;
    const params = queryString.parse(search);

    for (let key in params) {
      this.state[key] = params[key];
    }

    this.updateNet();
  }

  componentDidMount() {
    const search = this.props.location.search;
    const params = queryString.parse(search);
    this.setState(params);
    this.loadBlockchainData();
  }
  async loadBlockchainData() {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:87545");
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    const PoolContract = new web3.eth.Contract(POOL_ABI, POOL_ADDRESS);
    this.setState({ PoolContract });
    const contractName = await this.state.PoolContract.methods.name().call();
    const lockedAmount = await this.state.PoolContract.methods
      .lockedAmount()
      .call();
    const availableBalance = await PoolContract.methods
      .availableBalance()
      .call();
    const addressShare = await PoolContract.methods
      .shareOf(this.state.account)
      .call();
    this.setState({
      locked: (lockedAmount / Math.pow(10, 18)).toFixed(2),
      balance: availableBalance,
      contract: contractName,
      daiInPool: addressShare / Math.pow(10, 18),
      addressShareOfPool: (addressShare / lockedAmount).toFixed(3),
    });
  }

  async updateNet() {
    const provider = window.web3.currentProvider;
    const eth = new Eth(provider);
    const realNet = await eth.net_version();
    this.setState({ net: realNet });
  }

  render(props, context) {
    const { tokenNet, net, message, errorMessage } = this.state;

    let error;
    if (errorMessage !== "") {
      error = (
        <p className="errorMessage">
          There was a problem adding this token to your wallet. Make sure you
          have the latest version of MetaMask installed!
          <DownloadMetaMaskButton />
        </p>
      );
    }

    if (tokenNet !== net) {
      return <SwitchNetworkNotice net={net} tokenNet={tokenNet} />;
    }

    return (
      <>
        <h1 style={{ color: "white" }}>Hegic Liquidity Pool</h1>

        <div style={{ textAlign: "center" }}>
          <Link to="/addLiquidity">
            <Button
              style={{
                backgroundColor: "#C15F8E",
                height: "50px",
                width: "200px",
                marginRight: "5%",
              }}
            >
              Add Liquidity to Hegic Pool
            </Button>
          </Link>

          <Link to="/removeLiquidity">
            <Button
              style={{
                backgroundColor: "#C15F8E",
                height: "50px",
                width: "200px",
              }}
            >
              Remove Liquidity From Hegic Pool
            </Button>
          </Link>
        </div>
        <div>
          <div>Logged in with: {this.state.account}</div>
          <div>Total DAI in Pool: {this.state.locked}</div>
          <div>My DAI Locked in Pool: {this.state.daiInPool}</div>
          <div>Your % in Pool: {this.state.addressShareOfPool}%</div>
        </div>

        <div style={{ marginTop: "75px" }}>
          <h3 style={{ color: "white" }}>About Writing Put Hedge Contracts </h3>
          <p style={{ color: "white" }}>
            Writing (selling) a Put Hedge Contract consists of providing Dai to
            the{" "}
            <code style={{ backgroundColor: "white", color: "black" }}>
              writeDai
            </code>{" "}
            liquidity pool contract. The incentive for writers to provide
            liquidity is to earn the premiums paid by buyers of Hegic put
            options. The rates paid by put option buyers (and thus earned by
            option writers) depends on the hedge contract period and strike
            price, which are selected by each individual buyer.
          </p>
          <p style={{ color: "white" }}>
            On a deposit of DAI to the liquity pool, the writer receives
            writeDAI (ERC20) tokens in return. When the writer wishes to receive
            their DAI back, they can send writeDAI tokens to the liquidity pool
            contract and use the burn function. DAI will be automatically sent
            to the writer’s ETH-address.
          </p>
          <p>
            Example: for a put hedge contract of 1 ETH with a period of 2 weeks,
            the buyer chooses a $200 strike price (at-the-money; market price of
            ETH is $200). The price of such a put hedge contract is $10. In this
            example, the buyer chooses to pay $10 in ETH and sends a 0.05 ETH
            premium to activate the hedge contract. The premium will be
            automatically swapped to DAI using Uniswap. The premium in DAI will
            be added to the liquidity pool after the successful swap. Liquidity
            providers receive this premium in advance so that they can withdraw
            it at any given moment.
            <p>
              Once the premium is received, the liquidity in DAI will be locked
              for a period of a hedge contract that the put option buyer has
              paid for. Some portion of the liquidity will always be unlocked to
              let the liquidity providers claim the DAI that they have provided
              to the liquidity pool. Initial implementations of Hegic will allow
              80% of the total amount of DAI in the pool to be locked in active
              hedge contracts. The other 20% are always unlocked and can be used
              by those who would like to withdraw the liquidity from the pool.{" "}
            </p>
            If the amount of unlocked DAI in the liquidity pool is not enough
            for the writer to swap their writeDAI to DAI, they will have to wait
            for the active hedge contracts’ expiration. If the writer wishes to
            withdraw the liquidity from the pool, but the amount of unlocked DAI
            is not enough, they send a request to swap their writeDAI to DAI as
            soon as the liquidity will be unlocked. Their requests are
            aggregated in queues. Both returns (premiums paid by option buyers)
            and potential losses (profit made by put option buyers) are
            denominated in DAI and split pro rata between liquidity providers,
            based on the proportions of DAI that they have allocated in the
          </p>
        </div>
      </>
    );
  }
}

HomePage.contextTypes = {
  web3: PropTypes.object,
};

export default HomePage;
