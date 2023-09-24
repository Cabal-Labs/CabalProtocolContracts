

const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log("Setting up Unlock with account:", deployer.address);
    
    const CabalDAO = await hre.ethers.getContractFactory("CabalDAO");

    const cabalDAO = CabalDAO.attach("0x0EbB8C57eDCa41995C576eb090D4CC7cFD7daeDC")

    try{
        const adding1 = await cabalDAO.addEventContract("0x899A8995a2dA0bc5a3cf5471A1A0006Cca293f6B","ETHMexico","New York", 1000);
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