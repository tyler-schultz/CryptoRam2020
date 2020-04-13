const w3 = require("web3-utils");
const CryptoRam = artifacts.require("./CryptoRam.sol");
const CryptoRamSale = artifacts.require("./CryptoRamSale.sol");

// deploy the cryptoram contract and get its address on the blockchain
// then deploy the sales center cryptoramsale using that address
//
// After deployment manually move over the RAMCOIN.json file to the build/contracts directory from RAMCOIN project

module.exports = async function(deployer, network, accounts) {

    await deployer.deploy(CryptoRam);
    const CRdeployedToken = await CryptoRam.deployed();

    const _wallet         = accounts[0];
    const _token          = CRdeployedToken.address;

    console.log("wallet & token", _wallet, _token);
    await deployer.deploy(CryptoRamSale,
        _wallet,
        _token,
    );

    return true;
};


/*

Starting migrations...
======================
> Network name:    'rinkeby'
> Network id:      4
> Block gas limit: 0x989680


1_initial_migration.js
======================

   Deploying 'Migrations'
   ----------------------
   > transaction hash:    0x6145c96c095a5bda682c563c877237b6800d57e385c52c7b795e7a9aaf86b530
   > Blocks: 0            Seconds: 8
   > contract address:    0x914390a4B3420423B4931E2b0A425980193F4489
   > block number:        6265304
   > block timestamp:     1586134610
   > account:             0x4327D8b79AB0499F81dD801db4365CdC914d6f3f
   > balance:             526.272471211600001039
   > gas used:            234958
   > gas price:           25 gwei
   > value sent:          0 ETH
   > total cost:          0.00587395 ETH


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.00587395 ETH


2_deploy_contract.js
====================

   Deploying 'CryptoRam'
   ---------------------
   > transaction hash:    0x9e960501ebb2b5da627142e670c5bc170a15da67aa04ed0906d49decaf3b6e08
   > Blocks: 0            Seconds: 8
   > contract address:    0xE2449e662bC63f9F17204253D390a6065984BC74
   > block number:        6265306
   > block timestamp:     1586134640
   > account:             0x4327D8b79AB0499F81dD801db4365CdC914d6f3f
   > balance:             526.221790386600001039
   > gas used:            1984865
   > gas price:           25 gwei
   > value sent:          0 ETH
   > total cost:          0.049621625 ETH

wallet & token 0x4327D8b79AB0499F81dD801db4365CdC914d6f3f 0xE2449e662bC63f9F17204253D390a6065984BC74

   Deploying 'CryptoRamSale'
   -------------------------
   > transaction hash:    0xef3dc153c05664fe358458ac57a5f0687f5efdc06cdcf5149832436e2592388c
   > Blocks: 0            Seconds: 8
   > contract address:    0xf79c2b819079488F89Aa6291aeCC52D67f03449F
   > block number:        6265307
   > block timestamp:     1586134655
   > account:             0x4327D8b79AB0499F81dD801db4365CdC914d6f3f
   > balance:             526.212746461600001039
   > gas used:            361757
   > gas price:           25 gwei
   > value sent:          0 ETH
   > total cost:          0.009043925 ETH


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.05866555 ETH


Summary
=======
> Total deployments:   3
> Final cost:          0.0645395 ETH



 */

