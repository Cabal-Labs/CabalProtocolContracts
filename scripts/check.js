

const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log("Setting up Unlock with account:", deployer.address);
    
    const CabalDAO = await hre.ethers.getContractFactory("CabalDAO");

    const cabalDAO = CabalDAO.attach("0xc333b61282dEF941e112BED92e5288CDE8542c85")

    try{
        const adding1 = await cabalDAO.addEventContract("0x332613d2a8ceee1d327990c0f1eac67a9635e079","ETHNYC2023","New York", 1000);
    }catch(e){
        console.log(e)
    }
    try{
        const adding1 = await cabalDAO.addEventContract("0xf6ea151c63e8923ff84c8e17e3f8d79cda6c0df0","ETHIstambul","Turkey", 1000);
    }catch(e){
        console.log(e)
    }
    try{
        const adding1 = await cabalDAO.addEventContract("0xd4bde84e3445e8fd3d939ccf3cd10fd5ece41077","ETHIndia","India", 1000);
    }catch(e){
        console.log(e)
    }

    console.log("Done!")


}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });