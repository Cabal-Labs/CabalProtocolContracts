const hre = require("hardhat");


async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log("Deploying CabalDAO with account:", deployer.address);
    
    const CabalDAO = await hre.ethers.getContractFactory("CabalDAO");
    const membershipAddress = "0xd76f3fba5bc5138c05ae1dbaf27f82cd96c7e1de";  
    const cabalDAO = await CabalDAO.deploy(membershipAddress);

    await cabalDAO.deployed();

    console.log("CabalDAO deployed to:", cabalDAO.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });