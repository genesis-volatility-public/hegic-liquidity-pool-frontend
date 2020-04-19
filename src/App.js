import React, { Component } from "react";
import "./App.css";
import { Web3Provider } from "react-web3";
import HomePage from "./HomePage";
import DownloadMetaMaskButton from "./DownloadMetaMaskButton";
import ApproveDaiForm from "./component/approveDaiForm.jsx";
import WithdrawLiquidityForm from "./component/withdrawLiquidityForm.jsx";
import { BrowserRouter, Route, Switch, HashRouter } from "react-router-dom";

class App extends Component {
  render(props, context) {
    return (
      <div className="App container-fluid">
        <Web3Provider
          web3UnavailableScreen={() => (
            <div>
              <p>
                You need a web3 browser like MetaMask to use this site and
                manage cryptocurrencies.
              </p>
              <DownloadMetaMaskButton />
            </div>
          )}
        >
          <BrowserRouter basename={process.env.PUBLIC_URL}>
            <HashRouter hashType="noslash">
              <Switch>
                <Route path="/addLiquidity" component={ApproveDaiForm} />
                <Route
                  path="/removeLiquidity"
                  component={WithdrawLiquidityForm}
                />
                <Route path="/" component={HomePage} />
              </Switch>
            </HashRouter>
          </BrowserRouter>
        </Web3Provider>
      </div>
    );
  }
}

export default App;
