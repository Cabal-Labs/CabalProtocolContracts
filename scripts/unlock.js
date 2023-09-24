const hre = require("hardhat");
const lockAbi = require("../artifacts/@unlock-protocol/contracts/dist/PublicLock/IPublicLockV13.sol/IPublicLockV13.json")

async function main() {
    const MembershipAddress = "0x5e9a795158a2bcb908b56d494467deee97649022"
    const EthNY = "0x332613d2a8ceee1d327990c0f1eac67a9635e079"
    const ETHIstambul = "0xf6ea151c63e8923ff84c8e17e3f8d79cda6c0df0";
    const ETHIndia ="0xd4bde84e3445e8fd3d939ccf3cd10fd5ece41077";
    const [deployer] = await hre.ethers.getSigners();

    console.log("Setting up Unlock with account:", deployer.address);
    const lockContractMem = new hre.ethers.Contract(MembershipAddress, lockAbi.abi, deployer);
    const lockContractPart1 = new hre.ethers.Contract(EthNY, lockAbi.abi, deployer);
    const lockContractPart2 = new hre.ethers.Contract(ETHIstambul, lockAbi.abi, deployer);
    const lockContractPart3 = new hre.ethers.Contract(ETHIndia, lockAbi.abi, deployer);

    const OnMember = await hre.ethers.getContractFactory("OnMemberHook");
    const OnParticipant = await hre.ethers.getContractFactory("OnParticipantHook");
    
    const onMember = await OnMember.deploy("");
    const onParticipant = await OnParticipant.deploy();
    
    await onMember.deployed();
    await onParticipant.deployed();


    await (
        await lockContractMem.setEventHooks (
            onMember.address,
            hre.ethers.constants.AddressZero,
            hre.ethers.constants.AddressZero,
            hre.ethers.constants.AddressZero,
            hre.ethers.constants.AddressZero,
            hre.ethers.constants.AddressZero,
            hre.ethers.constants.AddressZero,
            
        )
    ).wait();

    await (await lockContractMem.addLockManager(onMember.address)).wait();

    await (
        await lockContractPart1.setEventHooks (
            onParticipant.address,
            hre.ethers.constants.AddressZero,
            hre.ethers.constants.AddressZero,
            hre.ethers.constants.AddressZero,
            hre.ethers.constants.AddressZero,
            hre.ethers.constants.AddressZero,
            hre.ethers.constants.AddressZero,
            
        )
    ).wait();

    await (await lockContractPart1.addLockManager(onParticipant.address)).wait();

    await (
        await lockContractPart2.setEventHooks (
            onParticipant.address,
            hre.ethers.constants.AddressZero,
            hre.ethers.constants.AddressZero,
            hre.ethers.constants.AddressZero,
            hre.ethers.constants.AddressZero,
            hre.ethers.constants.AddressZero,
            hre.ethers.constants.AddressZero,
            
        )
    ).wait();

    await (await lockContractPart2.addLockManager(onParticipant.address)).wait();

    await (
        await lockContractPart3.setEventHooks (
            onParticipant.address,
            hre.ethers.constants.AddressZero,
            hre.ethers.constants.AddressZero,
            hre.ethers.constants.AddressZero,
            hre.ethers.constants.AddressZero,
            hre.ethers.constants.AddressZero,
            hre.ethers.constants.AddressZero,
            
        )
    ).wait();

    await (await lockContractPart3.addLockManager(onParticipant.address)).wait();

   
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });