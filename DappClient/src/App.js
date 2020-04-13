import React, { Component } from "react";
import CryptoRamContract from "./contracts/CryptoRam.json";
import CryptoRamSalesContract from "./contracts/CryptoRamSale.json";
import RamCoinContract from "./contracts/RamCoin.json";
import getWeb3 from "./utils/getWeb3";

import Ram from "./components/ram";
import Header from "./components/header";
import PurchaserInventory from "./components/PurchaserInventory";

import buildRamTable from "./helpers/buildRamTable";

import { Col, Container, Pagination } from "react-materialize";

// ******************************************************************************************************
//
//  The main CRYPTORAMs React GUI to the two smart contracts:  CryptoRams and CryptoRamSales.
//
//  Note:  this is a horrible combination of REACT with smart contracts.  I publish this as a way NOT to do things
//
//         this system has too many loopholes.  Decisions (such as 2 token limit) are made by the GUI, not the smart ontract
//         Worse: the contract doesn't take Ramcoins directly, it takes 2 separate transactions.  This can easily be gamed.
//
//         so... don't write code like this!
//
// *****************************************************************************************************

class App extends Component {
  state = {
    web3: null,
    accounts: null,
    CR: {},
    CS: {},
    RC: {},

    loading: false,
    value: "",
    message: "",

    ramsTable: [],
    purchasedRamsTable: [],

    purchaserAddress: "",
    purchaserRamCount: 0,
    purchaserRamCoinCount: 0,
    walletAddress: "0x4327D8b79AB0499F81dD801db4365CdC914d6f3f",

    numPages: 13,
    activePage: 1,
    NUMRAMS: 204
  };

  // **************************************************************************
  //
  // React will call this routine only once when App page loads; do initialization here
  //
  // **************************************************************************

  componentDidMount = async () => {
    //
    // Get network provider and web3 instance for CryptoRam and CryptoRamSale and RamCoin contracts
    //

    try {
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      const purchaserAddress = accounts[0];

      // Get 3 contract instances

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = CryptoRamContract.networks[networkId];
      const CR = new web3.eth.Contract(
        CryptoRamContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      const CSdeployedNetwork = CryptoRamSalesContract.networks[networkId];
      const CS = new web3.eth.Contract(
        CryptoRamSalesContract.abi,
        CSdeployedNetwork && CSdeployedNetwork.address
      );

      const RCdeployedNetwork = RamCoinContract.networks[networkId];
      const RC = new web3.eth.Contract(
        RamCoinContract.abi,
        RCdeployedNetwork && RCdeployedNetwork.address
      );

      //  log basic info to show we are alive
      const mySym = await CR.methods.symbol().call();
      console.log("my symbol", mySym);
      console.log("accounts", accounts);

      // get number of RAMs and RAMCOINS purchaser already owns

      let purchaserRamCount = await CR.methods
        .balanceOf(purchaserAddress)
        .call();

      let purchaserRamCoinCount = await RC.methods
        .balanceOf(purchaserAddress)
        .call();
      purchaserRamCoinCount /= 1e18;

      // build table of CryptoRams owned by this account

      let purchasedRamsTable = [];

      for (var i = 0; i < purchaserRamCount; i++) {
        let myRam = await CR.methods.ownedTokens(purchaserAddress, i).call();
        let metaData = await CR.methods.getRamData(myRam).call();
        purchasedRamsTable.push(
          <Col>
            <Ram
              key={myRam}
              ramID={myRam}
              ramName={metaData.ramName}
              ramColor={metaData.ramColor}
              ramPrice={metaData.ramPrice}
              ramSellable={false}
            />
          </Col>
        );
      }

      // Write web3, accounts, and contract and all other info to the state

      this.setState({
        web3: web3,
        accounts: accounts,
        CR,
        CS,
        RC,
        purchaserAddress,
        purchaserRamCount,
        purchaserRamCoinCount,
        purchasedRamsTable,
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );

      console.log(error);
    }

    // build table of rams for this active page; existance table indicates item has been created (purchased)

    let existanceTable = await this.buildExistanceTable(1);
    let ramTable = buildRamTable(this.state, 1, existanceTable);

    // one-time operation to transfer ownership of CryptoRam to CryptoRamSale from the original creator
    // This only works for original creator (and owner) of the CryptoRam contract

    let CROwner = await this.state.CR.methods.owner().call();
    if (CROwner !== this.state.CS._address) {
      console.log("transferring CR ownership to CS contract");
      await this.state.CR.methods
        .transferOwnership(this.state.CS._address)
        .send({ from: this.state.purchaserAddress });
    } else {
      console.log("CS already owns CR contract");
    }

    this.setState({ramTable});

  };

  // ***********************************************************************************
  //
  //  utility routines and select button handler
  //
  // ***********************************************************************************

  // 16 at a time for each page

  buildExistanceTable = async page => {
    let existanceTable = [];
    for (let i = 0; i < 16; i++) {
      let ramID = (page - 1) * 16 + i;
      existanceTable[i] = await this.state.CR.methods.exists(ramID).call();
    }
    return existanceTable;
  };

  //   button handler for selecting new pages

  onSelectHandler = async event => {
    const activePage = await event;
    let existanceTable = await this.buildExistanceTable(activePage);
    let ramTable = buildRamTable(this.state, activePage, existanceTable);
    this.setState({ activePage, ramTable, existanceTable });
  };

  // *************************************************************************
  //
  // main render routine for App component
  //
  // **************************************************************************

  render() {
    return (
      <div>
        <Header />
        <hr />
        <Container>
          <div>
            <PurchaserInventory state={this.state} />
          </div>
          <hr />
        </Container>
        <h2> CryptoRAM Inventory </h2>
        <Pagination
          activePage={this.state.activePage}
          items={13}
          onSelect={this.onSelectHandler}
        />
        {/* {this.state.allRamsTable}*/}
        <div>{this.state.ramTable}</div>
      </div>
    );
  }
}

export default App;
