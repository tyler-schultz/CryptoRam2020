const BigNumber = web3.BigNumber;

const CryptoRam = artifacts.require("CryptoRam");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("RamCoin", accounts => {
  const _name = "CryptoRam Token";
  const _symbol = "CRYPTORAM";

  it("Should make first account an owner", async () => {
    let instance = await CryptoRam.deployed();
    let owner = await instance.owner();
    console.log(owner);
    assert.equal(owner, accounts[0]);
  });


  beforeEach(async function() {
    this.token = await CryptoRam.new();
  });

  describe("token attributes", function() {
    it("has the correct name", async function() {
      const name = await this.token.name();
      name.should.equal(_name);
    });

    it("has the correct symbol", async function() {
      const symbol = await this.token.symbol();
      symbol.should.equal(_symbol);
    });
  });

    describe("mint", () => {
        it("creates token with specified outer and inner colors", async () => {
            let instance = await CryptoRam.deployed();
            let owner = await instance.owner();
            console.log("owner", owner);

            let token = await instance.mint("#ff00dd", "#ddddff");
            let gradients = await instance.getGradient(0);
            assert.equal(gradients[0], "#ff00dd");
            assert.equal(gradients[1], "#ddddff");
        });
    });
});
