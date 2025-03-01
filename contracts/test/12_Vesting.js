const { BN, constants, expectEvent, expectRevert, time } = require('openzeppelin-test-helpers');

const MerkleTree = require('./helpers/merkleTree');
var jsonfile = require('jsonfile');
var droplist = jsonfile.readFileSync('../airdrop/drop_proofs.json');
var contractList = jsonfile.readFileSync('./contracts.json');

const VestedEscrow = artifacts.require("VestedEscrow");
const cvxRewardPool = artifacts.require("cvxRewardPool");
const ConvexToken = artifacts.require("ConvexToken");


contract("VestedEscrow Test", async accounts => {
  it("should claim unlock over time and claim", async () => {

    //system
    let vested = await VestedEscrow.at(contractList.system.vestedEscrow)
    let cvxRewards = await cvxRewardPool.at(contractList.system.cvxRewards)
    let cvx = await ConvexToken.at(contractList.system.cvx)

    let accountA = "0xAAc0aa431c237C2C0B5f041c8e59B3f1a43aC78F";
    let accountB = "0xb3DF5271b92e9fD2fed137253BB4611285923f16";
    for(var i = 0; i < 13; i++){
        await time.increase(35*86400);
        await time.advanceBlock();
        await time.advanceBlock();
        await time.advanceBlock();
       
        await time.latest().then(a=>console.log("advance time..."+a));
        await vested.totalTime().then(a=>console.log("vesting total time: " +a));
        await vested.initialLockedSupply().then(a=>console.log("vesting initialLockedSupply: " +a));
        await vested.unallocatedSupply().then(a=>console.log("vesting unallocatedSupply: " +a));
        await vested.vestedSupply().then(a=>console.log("vesting vestedSupply: " +a));

        await vested.lockedOf(accountA).then(a=>console.log("userA locked: " +a))
        await vested.balanceOf(accountA).then(a=>console.log("userA balance: " +a))
        await vested.vestedOf(accountA).then(a=>console.log("userA vested: " +a))

        await vested.lockedOf(accountB).then(a=>console.log("userB locked: " +a))
        await vested.balanceOf(accountB).then(a=>console.log("userB balance: " +a))
        await vested.vestedOf(accountB).then(a=>console.log("userB vested: " +a))
    }

    await vested.claim(accountA);
    await cvx.balanceOf(accountA).then(a=>console.log("User A cvx in wallet: " +a))

    await vested.claimAndStake({from:accountB})
    await cvxRewards.balanceOf(accountB).then(a=>console.log("User B cvx staked: " +a))
  });
});


