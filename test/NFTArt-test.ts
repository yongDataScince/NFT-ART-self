import {ethers, network, waffle} from "hardhat"
import {Signer, Contract, ContractFactory, BigNumber} from "ethers"
import chai, { use } from "chai"
import {solidity} from "ethereum-waffle"
import type {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers"
import {
    NFTArt,
    NFTArt__factory,
} from "../typechain";
import { Address } from "cluster"
import { exec } from "child_process"

chai.use(solidity)
const {expect} = chai

function ether(eth: string) {
    let weiAmount = ethers.utils.parseEther(eth)
    return weiAmount;
}

function getUsersAddresses(users: SignerWithAddress[]) : string[] {
    let usersAddresses: string[] = []
    for(let i = 0; i < users.length; i++) {
        usersAddresses.push(users[i].address);
    } 
    return usersAddresses;
}  

describe("NFTArt", async function () {
    let owner: SignerWithAddress;
    let author1: SignerWithAddress;
    let validator1: SignerWithAddress;
    let admin1: SignerWithAddress;
    let user1: SignerWithAddress;
    let platform: SignerWithAddress;
    let users: Array<SignerWithAddress>;
    let NFTArtFactory: NFTArt__factory;
    let nftArt: NFTArt;

    beforeEach("Deploy the contract", async function () {
        [owner, user1, author1, validator1, admin1, platform, ...users] = await ethers.getSigners();

        let userAddresses = getUsersAddresses(users.slice(0, 50))

        NFTArtFactory = new NFTArt__factory(owner);
        nftArt = await NFTArtFactory.deploy("https://nftArt.com/", platform.address, "NFTArt", "NFTART");
        await nftArt.deployed();

        expect(await nftArt.baseTokenURI()).to.equal("https://nftArt.com/");
        expect(await nftArt.name()).to.equal("NFTArt");
        expect(await nftArt.symbol()).to.equal("NFTART");
        expect(await nftArt.platformAddress()).to.equal(platform.address);
        for(let i = 0; i < 9; i++) {
            expect(await nftArt.ownerOf(i)).to.equal(await nftArt.PREMINT_ADDRESS());
        }
    });

    describe("Owner's functions", async function () {
        it("togglePresaleStarted, not owner", async function () {
            await expect(nftArt.connect(author1).togglePresaleStarted()).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("togglePresaleStarted", async function () {
            expect(await nftArt.startPresale()).to.equal(false);
            expect(await nftArt.togglePresaleStarted()).to.ok;
            expect(await nftArt.startPresale()).to.equal(true);
        });

        it("togglePublicSaleStarted, not owner", async function () {
            await expect(nftArt.connect(author1).togglePublicSaleStarted()).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("togglePublicSaleStarted", async function () {
            expect(await nftArt.startSale()).to.equal(false);
            expect(await nftArt.togglePublicSaleStarted()).to.ok;
            expect(await nftArt.startSale()).to.equal(true);
        });

        it("addValidator, not owner", async function () {
            await expect(nftArt.connect(author1).addValidator(validator1.address)).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("addValidator", async function () {
            expect(await nftArt.isValidator(validator1.address)).to.equal(false);
            expect(await nftArt.addValidator(validator1.address)).to.ok
                .to.emit(nftArt, 'AddingValidator')
                .withArgs(validator1.address);
            expect(await nftArt.isValidator(validator1.address)).to.equal(true);
        });

        it("removeValidator, not owner", async function () {
            await expect(nftArt.connect(author1).removeValidator(validator1.address)).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("removeValidator, This is not a validator", async function () {
            expect(await nftArt.addValidator(validator1.address)).to.ok
            expect(await nftArt.isValidator(validator1.address)).to.equal(true);
            expect(await nftArt.isValidator(author1.address)).to.equal(false);
            await expect(nftArt.removeValidator(author1.address)).to.be.revertedWith("This is not a validator");
        });

        it("removeValidator", async function () {
            expect(await nftArt.addValidator(validator1.address)).to.ok
            expect(await nftArt.isValidator(validator1.address)).to.equal(true);
            expect(await nftArt.removeValidator(validator1.address)).to.ok
                .to.emit(nftArt, 'RemoveValidator')
                .withArgs(validator1.address);
            expect(await nftArt.isValidator(validator1.address)).to.equal(false);
        });

        it("addAdmin, not owner", async function () {
            await expect(nftArt.connect(author1).addAdmin(admin1.address)).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("addAdmin", async function () {
            expect(await nftArt.isAdmin(admin1.address)).to.equal(false);
            expect(await nftArt.addAdmin(admin1.address)).to.ok
                .to.emit(nftArt, 'AddingAdmin')
                .withArgs(admin1.address);
            expect(await nftArt.isAdmin(admin1.address)).to.equal(true);
        });

        it("removeAdmin, not owner", async function () {
            await expect(nftArt.connect(author1).removeAdmin(admin1.address)).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("removeAdmin, This is not an admin", async function () {
            expect(await nftArt.addAdmin(admin1.address)).to.ok
            expect(await nftArt.isAdmin(admin1.address)).to.equal(true);
            expect(await nftArt.isAdmin(author1.address)).to.equal(false);
            await expect(nftArt.removeAdmin(author1.address)).to.be.revertedWith("This is not an admin");
        });

        it("removeAdmin", async function () {
            expect(await nftArt.addAdmin(admin1.address)).to.ok
            expect(await nftArt.isAdmin(admin1.address)).to.equal(true);
            expect(await nftArt.removeAdmin(admin1.address)).to.ok
                .to.emit(nftArt, 'RemoveAdmin')
                .withArgs(admin1.address);
            expect(await nftArt.isAdmin(admin1.address)).to.equal(false);
        });

        it("setMaxSupply, not owner", async function () {
            await expect(nftArt.connect(author1).setMaxSupply(100)).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("setMaxSupply, You can only increase max supply", async function () {
            expect(await nftArt.maxSupply()).to.equal(30);
            await expect(nftArt.setMaxSupply(20)).to.be.revertedWith("You can only increase max supply");
        });

        it("setMaxSupply", async function () {
            expect(await nftArt.maxSupply()).to.equal(30);
            expect(await nftArt.setMaxSupply(50)).to.ok;
            expect(await nftArt.maxSupply()).to.equal(50);
        });

        it("addToPresale, not owner", async function () {
            await expect(nftArt.connect(author1).addToPresale([author1.address, validator1.address])).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("addToPresale, Cannot add a null address", async function () {
            await expect(nftArt.addToPresale([author1.address, ethers.constants.AddressZero])).to.be.revertedWith("Cannot add a null address");
        });

        it("addToPresale", async function () {
            expect(await nftArt.presaleEligible(author1.address)).to.equal(false);
            expect(await nftArt.presaleEligible(validator1.address)).to.equal(false);
            expect(await nftArt.addToPresale([author1.address, validator1.address])).to.ok;
            expect(await nftArt.presaleEligible(author1.address)).to.equal(true);
            expect(await nftArt.presaleEligible(validator1.address)).to.equal(true);
        });

        it("removeFromPresale, not owner", async function () {
            await expect(nftArt.connect(author1).removeFromPresale(author1.address)).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("removeFromPresale", async function () {
            expect(await nftArt.presaleEligible(author1.address)).to.equal(false);
            expect(await nftArt.presaleEligible(validator1.address)).to.equal(false);
            expect(await nftArt.addToPresale([author1.address, validator1.address])).to.ok;
            expect(await nftArt.presaleEligible(author1.address)).to.equal(true);
            expect(await nftArt.presaleEligible(validator1.address)).to.equal(true);
            expect(await nftArt.removeFromPresale(author1.address)).to.ok;
            expect(await nftArt.presaleEligible(author1.address)).to.equal(false);
            expect(await nftArt.presaleEligible(validator1.address)).to.equal(true);
        });

        it("setBaseURI, not owner", async function () {
            await expect(nftArt.connect(author1).setBaseURI("https://nftArt1.com/")).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("setBaseURI", async function () {
            expect(await nftArt.baseTokenURI()).to.equal("https://nftArt.com/");
            expect(await nftArt.setBaseURI("https://nftArt1.com/")).to.ok
                .to.emit(nftArt, 'ChangeBaseURI')
                .withArgs("https://nftArt1.com/");
            expect(await nftArt.baseTokenURI()).to.equal("https://nftArt1.com/");
        });

        it("setPresaleMaxSupply, not owner", async function () {
            await expect(nftArt.connect(author1).setPresaleMaxSupply(30)).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("setPresaleMaxSupply", async function () {
            expect(await nftArt.presaleMaxSupply()).to.equal(20);
            expect(await nftArt.setPresaleMaxSupply(30)).to.ok;
            expect(await nftArt.presaleMaxSupply()).to.equal(30);
        });

        it("setPresaleMaxMint, not owner", async function () {
            await expect(nftArt.connect(author1).setPresaleMaxMint(12)).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("setPresaleMaxMint", async function () {
            expect(await nftArt.presaleMaxMint()).to.equal(11);
            expect(await nftArt.setPresaleMaxMint(12)).to.ok;
            expect(await nftArt.presaleMaxMint()).to.equal(12);
        });

        it("setPresaleMaxPerMint, not owner", async function () {
            await expect(nftArt.connect(author1).setPresaleMaxPerMint(10)).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("setPresaleMaxPerMint", async function () {
            expect(await nftArt.presaleMaxPerMint()).to.equal(8);
            expect(await nftArt.setPresaleMaxPerMint(10)).to.ok;
            expect(await nftArt.presaleMaxPerMint()).to.equal(10);
        });

        it("changeMintPrice, not owner", async function () {
            await expect(nftArt.connect(author1).changeMintPrice([1, 2], [ether("0.03"), ether("0.04")])).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("changeMintPrice, Mismatched arrays length", async function () {
            await expect(nftArt.changeMintPrice([1, 2, 3], [ether("0.03"), ether("0.04")])).to.be.revertedWith("Mismatched arrays length");
        });

        it("changeMintPrice", async function () {
            expect(await nftArt.mintPrices(1)).to.equal(0);
            expect(await nftArt.mintPrices(2)).to.equal(0);
            expect(await nftArt.changeMintPrice([1, 2], [ether("0.03"), ether("0.04")])).to.ok;
            expect(await nftArt.mintPrices(1)).to.equal(ether("0.03"));
            expect(await nftArt.mintPrices(2)).to.equal(ether("0.04"));
        });

        it("changePresaleMintPrice, not owner", async function () {
            await expect(nftArt.connect(author1).changePresaleMintPrice([1, 2], [ether("0.03"), ether("0.04")])).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("changePresaleMintPrice, Mismatched arrays length", async function () {
            await expect(nftArt.changePresaleMintPrice([1, 2, 3], [ether("0.03"), ether("0.04")])).to.be.revertedWith("Mismatched arrays length");
        });

        it("changePresaleMintPrice", async function () {
            expect(await nftArt.presalePrices(1)).to.equal(0);
            expect(await nftArt.presalePrices(2)).to.equal(0);
            expect(await nftArt.changePresaleMintPrice([1, 2], [ether("0.03"), ether("0.04")])).to.ok;
            expect(await nftArt.presalePrices(1)).to.equal(ether("0.03"));
            expect(await nftArt.presalePrices(2)).to.equal(ether("0.04"));
        });
    });

    describe("Admin functions", async function () {
        beforeEach("addAdmin", async function () {
            expect(await nftArt.addAdmin(admin1.address)).to.ok
                .to.emit(nftArt, 'AddingAdmin')
                .withArgs(admin1.address);
            expect(await nftArt.isAdmin(admin1.address)).to.equal(true);
        });

        let _minterRoyaltyPercentage = 10
        let _numberOfTransactions = 5
        let _authorRoyaltyPercentage = 4
        let _authorRoyaltyType = false
        

        it("changeRoyalties, not admin", async function () {
            await expect(nftArt.connect(author1).changeRoyalties(_minterRoyaltyPercentage, _numberOfTransactions, _authorRoyaltyPercentage, _authorRoyaltyType)).to.be.revertedWith("Caller is not an admin")
        });

        it("changeRoyalties", async function () {
            expect(await nftArt.minterRoyaltyPercentage()).to.equal(0);
            expect(await nftArt.minterRoyaltyN()).to.equal(0);
            expect(await nftArt.authorRoyaltyPercentage()).to.equal(0);
            expect(await nftArt.decreaseAuthorRoyalty()).to.equal(false);
            expect(await nftArt.connect(admin1).changeRoyalties(_minterRoyaltyPercentage, _numberOfTransactions, _authorRoyaltyPercentage, _authorRoyaltyType)).to.ok;
            expect(await nftArt.minterRoyaltyPercentage()).to.equal(10);
            expect(await nftArt.minterRoyaltyN()).to.equal(5);
            expect(await nftArt.authorRoyaltyPercentage()).to.equal(4);
            expect(await nftArt.decreaseAuthorRoyalty()).to.equal(false);
        });

        it("setAuthorsRoyaltyDistribution, not admin", async function () {
            await expect(nftArt.connect(author1).setAuthorsRoyaltyDistribution([author1.address, validator1.address], [4_000, 6_000])).to.be.revertedWith("Caller is not an admin")
        });

        it("setAuthorsRoyaltyDistribution, different array sizes", async function () {
            await expect(nftArt.connect(admin1).setAuthorsRoyaltyDistribution([author1.address, validator1.address], [4_000, 5_000, 1_000])).to.be.revertedWith("Different array sizes")
        });

        it("setAuthorsRoyaltyDistribution, Rates sum cannot be grater than 100", async function () {
            await expect(nftArt.connect(admin1).setAuthorsRoyaltyDistribution([author1.address, validator1.address], [4_000, 7_000])).to.be.revertedWith("Rates sum cannot be grater than 100")
        });

        it("setAuthorsRoyaltyDistribution, Cannot add a null address", async function () {
            await expect(nftArt.connect(admin1).setAuthorsRoyaltyDistribution([ethers.constants.AddressZero, validator1.address], [4_000, 6_000])).to.be.revertedWith("Cannot add a null address")
        });

        it("setAuthorsRoyaltyDistribution", async function () {
            expect(await nftArt.connect(admin1).setAuthorsRoyaltyDistribution([author1.address, validator1.address], [4_000, 6_000])).to.ok;
            let authors = await nftArt.getAuthors()
            let rates = await nftArt.getRates()
            expect(await authors[0]).to.equal(author1.address);
            expect(await authors[1]).to.equal(validator1.address);
            expect(await rates[0]).to.equal(4_000);
            expect(await rates[1]).to.equal(6_000);
        });

        it("setFiatRate, not admin", async function () {
            await expect(nftArt.connect(author1).setFiatRate(10)).to.be.revertedWith("Caller is not an admin")
        });

        it("setFiatRate, not admin", async function () {
            await expect(nftArt.connect(admin1).setFiatRate(0)).to.be.revertedWith("Rate should be greater than zero")
        });

        it("setFiatRate", async function () {
            expect(await nftArt.fiatRate()).to.equal(1);
            expect(await nftArt.connect(admin1).setFiatRate(10)).to.ok;
            expect(await nftArt.fiatRate()).to.equal(10);
        });
    });

    describe("Validator functions", async function () {
        beforeEach("addValidator", async function () {
            expect(await nftArt.isValidator(validator1.address)).to.equal(false);
            expect(await nftArt.addValidator(validator1.address)).to.ok
                .to.emit(nftArt, 'AddingValidator')
                .withArgs(validator1.address);
            expect(await nftArt.isValidator(validator1.address)).to.equal(true);
        });

        it("verify, not validator", async function () {
            await expect(nftArt.verify(1)).to.be.revertedWith("Caller is not a validator");
        });

        it("verify, invalid lot status", async function () {
            await expect(nftArt.connect(validator1).verify(3)).to.be.revertedWith("Invalid lot status");
        });

        it("verify", async function () {
            let tokenId = 10
            let priceWei = 10000
            let selfValidate = false
            expect(await nftArt.togglePublicSaleStarted()).to.ok;
            expect(await nftArt.connect(user1).mint([tokenId])).to.ok;
            expect(await nftArt.ownerOf(10)).to.equal(user1.address);
            expect(await nftArt.connect(user1).listToken(tokenId, priceWei, selfValidate)).to.ok;
            expect(await nftArt.connect(validator1).verify(10)).to.ok
                .to.emit(nftArt, 'ChangeStateLot')
                .withArgs(10, 2);
            expect(await nftArt.getLotState(10)).to.equal(2);
        });       
    });

    describe("Platform functions", async function () {
        it("setMintFeePercentage, not platform", async function () {
            await expect(nftArt.setMintFeePercentage(100)).to.be.revertedWith("Caller is not a platform");
        });

        it("setMintFeePercentage, Wrong value", async function () {
            await expect(nftArt.connect(platform).setMintFeePercentage(5000)).to.be.revertedWith("Wrong value");
        });

        it("setMintFeePercentage", async function () {
            expect(await nftArt.mintFeePercentage()).to.equal(0);
            expect(await nftArt.connect(platform).setMintFeePercentage(3000)).to.ok;
            expect(await nftArt.mintFeePercentage()).to.equal(3000);
        });

        it("setSellFeePercentage, not platform", async function () {
            await expect(nftArt.setSellFeePercentage(100)).to.be.revertedWith("Caller is not a platform");
        });

        it("setSellFeePercentage, Wrong value", async function () {
            await expect(nftArt.connect(platform).setSellFeePercentage(500)).to.be.revertedWith("Wrong value");
        });

        it("setSellFeePercentage", async function () {
            expect(await nftArt.sellFeePercentage()).to.equal(0);
            expect(await nftArt.connect(platform).setSellFeePercentage(300)).to.ok;
            expect(await nftArt.sellFeePercentage()).to.equal(300);
        });

        it("changeFeeAddress, not platform", async function () {
            await expect(nftArt.changeFeeAddress(author1.address)).to.be.revertedWith("Caller is not a platform");
        });

        it("changeFeeAddress, Wrong address", async function () {
            await expect(nftArt.connect(platform).changeFeeAddress(ethers.constants.AddressZero)).to.be.revertedWith("Wrong address");
        });

        it("changeFeeAddress", async function () {
            expect(await nftArt.feeAddress()).to.equal("0x5B38Da6a701c568545dCfcB03FcB875f56beddC4");
            expect(await nftArt.connect(platform).changeFeeAddress(author1.address)).to.ok;
            expect(await nftArt.feeAddress()).to.equal(author1.address);
        });

        it("changePlatformAddress, not platform", async function () {
            await expect(nftArt.changePlatformAddress(author1.address)).to.be.revertedWith("Caller is not a platform");
        });

        it("changePlatformAddress, Wrong address", async function () {
            await expect(nftArt.connect(platform).changePlatformAddress(ethers.constants.AddressZero)).to.be.revertedWith("Wrong address");
        });

        it("changePlatformAddress", async function () {
            expect(await nftArt.platformAddress()).to.equal(platform.address);
            expect(await nftArt.connect(platform).changePlatformAddress(author1.address)).to.ok
                .to.emit(nftArt, 'ChangePlatform')
                .withArgs(author1.address);
            expect(await nftArt.platformAddress()).to.equal(author1.address);
        });
    });

    describe("Public functions", async function () {
        let tokenId = 10
        
        describe("mintPresale", async function () {
            beforeEach("changePresaleMintPrice", async function () {
                expect(await nftArt.changePresaleMintPrice([10, 11, 12, 13, 14, 15, 16, 17, 18, 19], 
                    [ether("0.05"), ether("0.05"), ether("0.05"), ether("0.05"), ether("0.05"), ether("0.05"), ether("0.05"), ether("0.05"), ether("0.05"), ether("0.05")])).to.ok;
            });

            it("mintPresale, Presale has not started", async function () {
                await expect(nftArt.connect(user1).mintPresale([tokenId], {value: ether("0.002")})).to.be.revertedWith("Presale has not started");
            });

            it("mintPresale, You are not eligible for the presale", async function () {
                expect(await nftArt.togglePresaleStarted()).to.ok;
                await expect(nftArt.connect(user1).mintPresale([tokenId], {value: ether("0.05")})).to.be.revertedWith("You are not eligible for the presale");
            });

            it("mintPresale, All presale tokens have been minted", async function () {
                expect(await nftArt.togglePresaleStarted()).to.ok;
                expect(await nftArt.addToPresale([user1.address])).to.ok;
                expect(await nftArt.setPresaleMaxSupply(0)).to.ok;
                await expect(nftArt.connect(user1).mintPresale([10, 11], {value: ether("0.05")})).to.be.revertedWith("All presale tokens have been minted");
            });

            it("mintPresale, Purchase exceeds max allowed for presale", async function () {
                expect(await nftArt.togglePresaleStarted()).to.ok;
                expect(await nftArt.addToPresale([user1.address])).to.ok;
                await expect(nftArt.connect(user1).mintPresale([10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22], {value: ether("0.02")})).to.be.revertedWith("Purchase exceeds max allowed for presale");
            });

            it("mintPresale, You exceed max tokens allowed per mint", async function () {
                expect(await nftArt.togglePresaleStarted()).to.ok;
                expect(await nftArt.addToPresale([user1.address])).to.ok;
                await expect(nftArt.connect(user1).mintPresale([10, 11, 12, 13, 14, 15, 16, 17, 18], {value: ether("0.02")})).to.be.revertedWith("You exceed max tokens allowed per mint");
            });

            it("mintPresale, Token is alredy minted", async function () {
                expect(await nftArt.togglePresaleStarted()).to.ok;
                expect(await nftArt.addToPresale([user1.address])).to.ok;
                await expect(nftArt.connect(user1).mintPresale([1], {value: ether("0.03")})).to.be.revertedWith("Token is alredy minted");
            });

            it("mintPresale, ETH amount is incorrect", async function () {
                expect(await nftArt.togglePresaleStarted()).to.ok;
                expect(await nftArt.addToPresale([user1.address])).to.ok;
                await expect(nftArt.connect(user1).mintPresale([tokenId], {value: ether("0.03")})).to.be.revertedWith("ETH amount is incorrect");
            });

            it("mintPresale", async function () {
                expect(await nftArt.togglePresaleStarted()).to.ok;
                expect(await nftArt.addToPresale([user1.address])).to.ok;
                expect(await nftArt.totalSupply()).to.equal(10);
                expect(await nftArt.balanceOf(user1.address)).to.equal(0);
                expect(await nftArt.connect(user1).mintPresale([tokenId], {value: ether("0.05")})).to.ok
                    .to.emit(nftArt, 'PresaleMint')
                    .withArgs(user1.address, [tokenId]);
                expect(await nftArt.totalSupply()).to.equal(10 + 1);
                expect(await nftArt.balanceOf(user1.address)).to.equal(1);
            });
        });

        describe("mint", async function () {
            beforeEach("changeMintPrice", async function () {
                expect(await nftArt.changeMintPrice([10, 11, 12, 13, 14, 15, 16, 17, 18, 19], 
                    [ether("0.05"), ether("0.05"), ether("0.05"), ether("0.05"), ether("0.05"), ether("0.05"), ether("0.05"), ether("0.05"), ether("0.05"), ether("0.05")])).to.ok;
            });

            it("mint, Sale has not started", async function () {
                await expect(nftArt.connect(user1).mint([10], {value: ether("0.05")})).to.be.revertedWith("Sale has not started");
            });

            it("mint, All tokens have been minted", async function () {
                expect(await nftArt.togglePublicSaleStarted()).to.ok;
                await expect(nftArt.connect(user1).mint([10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40], {value: ether("0.05")}))
                    .to.be.revertedWith("All tokens have been minted");
            });

            it("mintPresale, Token is alredy minted", async function () {
                expect(await nftArt.togglePublicSaleStarted()).to.ok;
                await expect(nftArt.connect(user1).mint([1], {value: ether("0.05")})).to.be.revertedWith("Token is alredy minted");
            });

            it("mint, ETH amount is incorrect", async function () {
                expect(await nftArt.togglePublicSaleStarted()).to.ok;
                await expect(nftArt.connect(user1).mint([10], {value: ether("0.003")})).to.be.revertedWith("ETH amount is incorrect");
            });

            it("mint", async function () {
                expect(await nftArt.togglePublicSaleStarted()).to.ok;
                expect(await nftArt.connect(user1).mint([10], {value: ether("0.05")})).to.ok
                    .to.emit(nftArt, 'PublicSaleMint')
                    .withArgs(user1.address, [10]);
                expect(await nftArt.totalSupply()).to.equal(10 + 1);
                expect(await nftArt.balanceOf(user1.address)).to.equal(1);
            });
        });

        describe("listToken", async function () {
            let tokenId = 10
            let priceWei = 10000
            let selfValidate = false
            beforeEach("minting", async function () {
                expect(await nftArt.changeMintPrice([10, 11, 12, 13, 14, 15, 16, 17, 18, 19], 
                    [ether("0.05"), ether("0.05"), ether("0.05"), ether("0.05"), ether("0.05"), ether("0.05"), ether("0.05"), ether("0.05"), ether("0.05"), ether("0.05")])).to.ok;
                expect(await nftArt.togglePublicSaleStarted()).to.ok;
                expect(await nftArt.connect(user1).mint([10, 11], {value: ether("0.1")})).to.ok
                    .to.emit(nftArt, 'PublicSaleMint')
                    .withArgs(user1.address, [10, 11]);
                expect(await nftArt.connect(author1).mint([12], {value: ether("0.05")})).to.ok
                    .to.emit(nftArt, 'PublicSaleMint')
                    .withArgs(author1.address, [12]);
                expect(await nftArt.balanceOf(user1.address)).to.equal(2);
                expect(await nftArt.balanceOf(author1.address)).to.equal(1);
            });

            it("listToken, You are not token owner", async function () {
                await expect(nftArt.connect(author1).listToken(tokenId, priceWei, selfValidate)).to.be.revertedWith("You are not token owner");
            });

            it("listToken, Error amount", async function () {
                let priceWei = 0
                await expect(nftArt.connect(user1).listToken(tokenId, priceWei, selfValidate)).to.be.revertedWith("Error amount");
            });

            it("listToken, selfValidate = false/true", async function () {
                expect(await nftArt.connect(user1).listToken(10, priceWei, false)).to.ok
                    .to.emit(nftArt, 'ListToken')
                    .withArgs(user1.address, 10, priceWei, false);
                expect(await nftArt.getLotState(10)).to.equal(1);
                expect(await nftArt.balanceOf(user1.address)).to.equal(1);
                expect(await nftArt.balanceOf(nftArt.address)).to.equal(1);
                let selfValidate = true
                expect(await nftArt.connect(user1).listToken(11, priceWei, selfValidate)).to.ok
                    .to.emit(nftArt, 'ListToken')
                    .withArgs(user1.address, 11, priceWei, true);
                expect(await nftArt.getLotState(11)).to.equal(3);
                expect(await nftArt.balanceOf(user1.address)).to.equal(0);
                expect(await nftArt.balanceOf(nftArt.address)).to.equal(2);
                expect(await nftArt.connect(author1).listToken(12, priceWei, selfValidate)).to.ok
                    .to.emit(nftArt, 'ListToken')
                    .withArgs(author1.address, 12, priceWei, true);
                expect(await nftArt.getLotState(12)).to.equal(3);
                expect(await nftArt.balanceOf(author1.address)).to.equal(0);
                expect(await nftArt.balanceOf(nftArt.address)).to.equal(3);
            });
        });

        describe("revokeToken", async function () {
            let tokenId = 10
            let priceWei = 10000
            let selfValidate = false
            beforeEach("minting", async function () {
                expect(await nftArt.changeMintPrice([10, 11, 12, 13, 14, 15, 16, 17, 18, 19], 
                    [ether("0.05"), ether("0.05"), ether("0.05"), ether("0.05"), ether("0.05"), ether("0.05"), ether("0.05"), ether("0.05"), ether("0.05"), ether("0.05")])).to.ok;
                expect(await nftArt.togglePublicSaleStarted()).to.ok;
                expect(await nftArt.connect(user1).mint([10, 11], {value: ether("0.1")})).to.ok
                    .to.emit(nftArt, 'PublicSaleMint')
                    .withArgs(user1.address, [10, 11]);
                expect(await nftArt.connect(author1).mint([12], {value: ether("0.05")})).to.ok
                    .to.emit(nftArt, 'PublicSaleMint')
                    .withArgs(author1.address, [12]);
                expect(await nftArt.connect(user1).listToken(10, priceWei, false)).to.ok
                    .to.emit(nftArt, 'ListToken')
                    .withArgs(user1.address, 10, priceWei, false);
                expect(await nftArt.getLotState(10)).to.equal(1);
            });

            it("revokeToken, Token is not listed", async function () {
                await expect(nftArt.connect(user1).revokeToken(13)).to.be.revertedWith("Token is not listed");
            });

            it("revokeToken, You can only revoke your own token", async function () {
                await expect(nftArt.connect(author1).revokeToken(10)).to.be.revertedWith("You can only revoke your own token");
            });

            it("revokeToken", async function () {
                expect(await nftArt.getLotState(10)).to.equal(1);
                expect(await nftArt.balanceOf(user1.address)).to.equal(1);
                expect(await nftArt.balanceOf(nftArt.address)).to.equal(1);
                expect(await nftArt.connect(user1).revokeToken(10)).to.ok
                    .to.emit(nftArt, 'RevokeToken')
                    .withArgs(10);
                expect(await nftArt.getLotState(10)).to.equal(0);
                expect(await nftArt.balanceOf(user1.address)).to.equal(2);
                expect(await nftArt.balanceOf(nftArt.address)).to.equal(0);
            });
        });

        describe("buyToken/Withdraw", async function () {
            let tokenId = 10
            let priceWei = ether("1")
            let selfValidate = false

            let _minterRoyaltyPercentage = 10
            let _numberOfTransactions = 5
            let _authorRoyaltyPercentage = 5
            let _authorRoyaltyType = true
            beforeEach("minting", async function () {
                expect(await nftArt.changeMintPrice([10, 11, 12, 13, 14, 15, 16, 17, 18, 19], 
                    [ether("1"), ether("0.05"), 50000,  ether("0.05"), ether("0.05"), ether("0.05"), ether("0.05"), ether("0.05"), ether("0.05"), ether("0.05")])).to.ok;
                expect(await nftArt.togglePublicSaleStarted()).to.ok;
                expect(await nftArt.connect(user1).mint([10, 11], {value: ether("1.05")})).to.ok
                    .to.emit(nftArt, 'PublicSaleMint')
                    .withArgs(user1.address, [10, 11]);
                expect(await nftArt.connect(author1).mint([12], {value: 50000})).to.ok
                    .to.emit(nftArt, 'PublicSaleMint')
                    .withArgs(author1.address, [12]);
                expect(await nftArt.connect(user1).listToken(10, priceWei, false)).to.ok
                    .to.emit(nftArt, 'ListToken')
                    .withArgs(user1.address, 10, priceWei, false);
                expect(await nftArt.getLotState(10)).to.equal(1);
                expect(await nftArt.connect(author1).listToken(12, 50000, false)).to.ok
                    .to.emit(nftArt, 'ListToken')
                    .withArgs(author1.address, 12, 50000, false);
                expect(await nftArt.getLotState(12)).to.equal(1);
            });

            it("buyToken, Token is not listed", async function () {
                await expect(nftArt.buyToken(10, {value: ether("1")})).to.be.revertedWith("Token is not listed");
            });

            it("buyToken, You cannot buy token from yourself", async function () {
                expect(await nftArt.addValidator(validator1.address)).to.ok;
                expect(await nftArt.connect(validator1).verify(10)).to.ok;
                await expect(nftArt.connect(user1).buyToken(10, {value: ether("1")})).to.be.revertedWith("You cannot buy token from yourself");
            });

            it("buyToken, ETH amount is incorrect", async function () {
                expect(await nftArt.addValidator(validator1.address)).to.ok;
                expect(await nftArt.connect(validator1).verify(10)).to.ok;
                await expect(nftArt.buyToken(10, {value: 900})).to.be.revertedWith("ETH amount is incorrect");
            });

            it("buyToken, royaltyType = true", async function () {
                expect(await nftArt.addAdmin(admin1.address)).to.ok
                expect(await nftArt.connect(admin1).changeRoyalties(_minterRoyaltyPercentage, _numberOfTransactions, _authorRoyaltyPercentage, _authorRoyaltyType)).to.ok;
                expect(await nftArt.addValidator(validator1.address)).to.ok;
                expect(await nftArt.connect(validator1).verify(10)).to.ok;
                expect(await nftArt.minterRoyaltyN()).to.equal(_numberOfTransactions);
                const provider = waffle.provider;
                let balanceBeforeUser1 = await provider.getBalance(user1.address);
                expect(await nftArt.connect(admin1).buyToken(10, {value: priceWei})).to.ok
                    .to.emit(nftArt, 'BuyToken')
                    .withArgs(10);
                let balanceAfterUser1 = await provider.getBalance(user1.address);

                expect(await balanceAfterUser1.sub(balanceBeforeUser1)).to.equal(ether("0.9995"));
                expect(await nftArt.getLotState(10)).to.equal(0);
                expect(await nftArt.balanceOf(nftArt.address)).to.equal(1);
                expect(await nftArt.balanceOf(admin1.address)).to.equal(1);
            });

            it("buyToken, royaltyType = false", async function () {
                let _authorRoyaltyType = false
                expect(await nftArt.addAdmin(admin1.address)).to.ok
                expect(await nftArt.connect(admin1).changeRoyalties(_minterRoyaltyPercentage, _numberOfTransactions, _authorRoyaltyPercentage, _authorRoyaltyType)).to.ok;
                expect(await nftArt.addValidator(validator1.address)).to.ok;
                expect(await nftArt.connect(validator1).verify(10)).to.ok;
                expect(await nftArt.connect(admin1).buyToken(10, {value: priceWei})).to.ok
                    .to.emit(nftArt, 'BuyToken')
                    .withArgs(10);
                expect(await nftArt.getLotState(10)).to.equal(0);
                expect(await nftArt.balanceOf(nftArt.address)).to.equal(1);
                expect(await nftArt.balanceOf(admin1.address)).to.equal(1);
            });

            it("buyToken, minterRoyaltyN > _tokenTransactions", async function () {
                let _authorRoyaltyType = false
                expect(await nftArt.addAdmin(admin1.address)).to.ok
                expect(await nftArt.connect(admin1).changeRoyalties(_minterRoyaltyPercentage, 0, _authorRoyaltyPercentage, _authorRoyaltyType)).to.ok;
                expect(await nftArt.addValidator(validator1.address)).to.ok;
                expect(await nftArt.connect(validator1).verify(10)).to.ok;
                expect(await nftArt.connect(admin1).buyToken(10, {value: priceWei})).to.ok
                    .to.emit(nftArt, 'BuyToken')
                    .withArgs(10);
                expect(await nftArt.getLotState(10)).to.equal(0);
                expect(await nftArt.balanceOf(nftArt.address)).to.equal(1);
                expect(await nftArt.balanceOf(admin1.address)).to.equal(1);
            });

            it("buyToken, decreaseAuthorRoyalty && _fiatPrice > 5000", async function () {
                let _authorRoyaltyType = true
                expect(await nftArt.addAdmin(admin1.address)).to.ok
                expect(await nftArt.connect(admin1).changeRoyalties(_minterRoyaltyPercentage, _numberOfTransactions, _authorRoyaltyPercentage, _authorRoyaltyType)).to.ok;
                expect(await nftArt.addValidator(validator1.address)).to.ok;
                expect(await nftArt.connect(validator1).verify(12)).to.ok;
                expect(await nftArt.connect(admin1).setFiatRate(ether("1"))).to.ok;
                expect(await nftArt.connect(admin1).buyToken(12, {value: 50000})).to.ok
                    .to.emit(nftArt, 'BuyToken')
                    .withArgs(12);
                expect(await nftArt.getLotState(12)).to.equal(0);
                expect(await nftArt.balanceOf(nftArt.address)).to.equal(1);
                expect(await nftArt.balanceOf(admin1.address)).to.equal(1);
            });

            it("Withdraw", async function () {
                expect(await nftArt.addAdmin(admin1.address)).to.ok
                expect(await nftArt.connect(admin1).changeRoyalties(_minterRoyaltyPercentage, _numberOfTransactions, _authorRoyaltyPercentage, _authorRoyaltyType)).to.ok;
                expect(await nftArt.connect(admin1).setAuthorsRoyaltyDistribution([author1.address, validator1.address], [4_000, 6_000])).to.ok;
                expect(await nftArt.addValidator(validator1.address)).to.ok;
                expect(await nftArt.connect(validator1).verify(10)).to.ok;
                expect(await nftArt.minterRoyaltyN()).to.equal(_numberOfTransactions);
                const provider = waffle.provider;
                let balanceBeforeUser1 = await provider.getBalance(user1.address);
                expect(await nftArt.connect(admin1).buyToken(10, {value: priceWei})).to.ok
                    .to.emit(nftArt, 'BuyToken')
                    .withArgs(10);
                let balanceAfterUser1 = await provider.getBalance(user1.address);

                expect(await balanceAfterUser1.sub(balanceBeforeUser1)).to.equal(ether("0.9995"));
                expect(await nftArt.getLotState(10)).to.equal(0);
                expect(await nftArt.balanceOf(nftArt.address)).to.equal(1);
                expect(await nftArt.balanceOf(admin1.address)).to.equal(1);

                let balanceBeforeAuthor1 = await provider.getBalance(author1.address);
                let balanceBeforeValidator1 = await provider.getBalance(validator1.address);

                let balanceContract = await provider.getBalance(nftArt.address);
                expect(balanceContract).to.equal(ether("1.05050000000005"));
                expect(await nftArt.withdraw()).to.ok;
                let balanceAfterAuthor1 = await provider.getBalance(author1.address);
                let balanceAfterValidator1 = await provider.getBalance(validator1.address);

                expect(await balanceAfterAuthor1.sub(balanceBeforeAuthor1)).to.equal(ether("0.42020000000002"));
                expect(await balanceAfterValidator1.sub(balanceBeforeValidator1)).to.equal(ether("0.63030000000003"));
            });
        });
    });
});