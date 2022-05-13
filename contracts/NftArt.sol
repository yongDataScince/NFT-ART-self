// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import "./access/Ownable.sol";
import "./token/ERC721/extensions/ERC721Enumerable.sol";

contract NFTArt is ERC721Enumerable, Ownable{

    /*///////////////////////////////////////////////////////////////
                    GLOBAL STATE
    //////////////////////////////////////////////////////////////*/

    address constant public PREMINT_ADDRESS = 0x0eab415C80DC6B1c3265a75dbB836932A9938c83;
    uint256 constant public AMOUNT_PREMINT = 10;
    bool public startPresale = false;
    
    uint256 public presaleMaxSupply = 20;
    uint256 public presaleMaxPerMint = 8;
    uint256 public presaleMaxMint = 11;    

    bool public startSale = false;
    uint256 public maxSupply = 30;

    uint256 public mintFeePercentage = 0;      // in 0.01%
    uint256 public mintFees = 0;               // accumulated fees
    uint256 public sellFeePercentage = 0;      // in 0.01%
    uint256 public sellFees = 0;               // accumulated fees
    address public feeAddress = 0x0eab415C80DC6B1c3265a75dbB836932A9938c83;
    
    uint256 private minterRoyaltyPercentage = 0;    // in 0.01%
    uint256 private minterRoyaltyN = 0;      // in 0.01%
    uint256 private authorRoyaltyPercentage = 0;    // in 0.01%
    uint256 private fiatRate = 0;    // for athor royalty  
    
    address[] private beneficiaries;
    uint256[] private rates;
    uint256 constant private MAX_RATE = 100;

    string public baseTokenURI;

    bytes32 constant public VALIDATOR = keccak256("VALIDATOR");
    bytes32 constant public ADMIN = keccak256("ADMIN");
    bytes32 constant public AUTHOR = keccak256("AUTHOR");
    bytes32 constant public PLATFORM = keccak256("PLATFORM");

    event AddingValidator(address _validatorAddress);
    event RemoveValidator(address _validatorAddress);
    event AddingAuthor(address authorAddress);
    event RemoveAuthor(address authorAddress);
    event AddingAdmin(address adminAddress);
    event RemoveAdmin(address adminAddress);
    event ChangeBaseURI(string baseURI); 
    event ChangeStateLot(uint256 lot, uint256 value);
    event PresaleMint(address minter, uint256[] tokensID);
    event PublicSaleMint(address minter, uint256[] tokensID);
    event ListToken(address seller, uint256 tokenID, uint256 priceWei, bool selfValidate);
    event BuyToken(uint256 tokenID);
    event RevokeToken(uint256 tokenID);    


    /*///////////////////////////////////////////////////////////////
                    DATA STRUCTURES 
    //////////////////////////////////////////////////////////////*/
    
    mapping (address => bytes32) public roles;
    mapping (uint256 => address) public minters;

    mapping (uint256 => uint256) public mintPrices;
    mapping (uint256 => uint256) public presalePrices;
    mapping (address => bool) public presaleEligible;

    /*
    _lotStates has the following states:
    0 - token at the owner
    1 - contract owns the token, the token listing isn't confirmed
    2 - contract owns the token, the token is listed and confirmed by the validator
    3 - contract owns the token, the token is listed and confirmed by the seller itself
    */
    mapping (uint256 => uint256) private _lotStates;
    mapping (uint256 => uint256) private _tokenPrice;
    mapping (uint256 => address) private _tokensPreviousOwner;
    mapping (uint256 => uint256) private _tokenTransactions;
    
    modifier onlyAdmin() {
        require(roles[_msgSender()] == ADMIN, "Caller is not an admin");
        _;
    }

    modifier onlyValidator() {
        require(roles[_msgSender()] == VALIDATOR, "Caller is not a validator");
        _;
    }

    modifier onlyAuthor() {
        require(roles[_msgSender()] == AUTHOR, "Caller is not an author!");
        _;
    }

    modifier onlyPlatform() {
        require(roles[_msgSender()] == PLATFORM, "Caller is not a platform");
        _;
    }

    modifier ifTockenExist(uint256 _tokenID) {
        _exists(_tokenID);
        _;
    }

    constructor(
        string memory baseURI,
        address[] memory _authors,
        address _platformAddress,
        string memory _name,
        string memory _symbol)
     ERC721(_name,_symbol) {
        baseTokenURI = baseURI;

        _addAuthor(_authors);

        roles[_platformAddress] = PLATFORM;

        _premint();
        
        emit ChangeBaseURI(baseTokenURI);
    }


   /*///////////////////////////////////////////////////////////////
                    OWNER'S FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    
    function addValidator(address _address) external onlyOwner {
        roles[_address] = VALIDATOR;
        emit AddingValidator(_address);
    }

    function removeValidator(address _address) external onlyOwner {
        require(roles[_address] == VALIDATOR, "This is not a validator");
        roles[_address] = 0;
        emit RemoveValidator(_address);
    }

    function addAdmin(address _address) external onlyOwner {
        roles[_address] = ADMIN;
        emit AddingAdmin(_address);
    }

    function removeAdmin(address _address) external onlyOwner {
        require(roles[_address] == ADMIN, "This is not an admin");
        roles[_address] = 0;
        emit RemoveAdmin(_address);
    }

    function addAuthor(address _address) external onlyOwner {
        roles[_address] = AUTHOR;
        emit AddingAuthor(_address);
    }

    function removeAuthor(address _address) external onlyOwner {
        require(roles[_address] == AUTHOR, "This is not an author");
        roles[_address] = 0;
        emit RemoveAuthor(_address);
    }

    function setBaseURI(string calldata baseURI) external onlyOwner {
        baseTokenURI = baseURI;
        emit ChangeBaseURI(baseURI);
    }

    // Presale settings
    function togglePresaleStarted() external onlyOwner {
        startPresale = !startPresale;
    }

    function addToPresale(address[] calldata _addresses) external onlyOwner {
        for (uint256 i = 0; i < _addresses.length; i++) {
            require(_addresses[i] != address(0), "Cannot add null address");
            presaleEligible[_addresses[i]] = true;
        }
    }

    function removeFromPresale(address _address) external onlyOwner {
        presaleEligible[_address] = false;
    }

    function setPresaleMaxSupply(uint256 _presaleMaxSupply) external onlyOwner {
        presaleMaxSupply = _presaleMaxSupply;
    }

    function setPresaleMaxMint(uint256 _presaleMaxMint) external onlyOwner {
        presaleMaxMint = _presaleMaxMint;
    }

    function setPresaleMaxPerMint(uint256 _presaleMaxPerMint) external onlyOwner {
        presaleMaxPerMint = _presaleMaxPerMint;
    }

    function changePresaleMintPrice(uint256[] calldata _ids, uint256[] calldata _prices) external onlyOwner {
        require(_ids.length == _prices.length, "Mismatched arrays length");
        for (uint256 i = 0; i < _ids.length; i++) {
            presalePrices[_ids[i]] = _prices[i];
        }
    }

    // Public sale settings
    function togglePublicSaleStarted() external onlyOwner {
        startSale = !startSale;
    }

    function changeMintPrice(uint256[] calldata _ids, uint256[] calldata _prices) external onlyOwner {
        require(_ids.length == _prices.length, "Mismatched arrays length");
        for (uint256 i = 0; i < _ids.length; i++) {
            mintPrices[_ids[i]] = _prices[i];
        }
    }

    function setMaxSupply(uint256 _maxSupply) external onlyOwner {
        require(_maxSupply > maxSupply, "You can only increase max supply");
        maxSupply = _maxSupply;
    }


    /*///////////////////////////////////////////////////////////////
                    ADMIN FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function changeMinterRoyalty(
        uint256 _minterRoyaltyPercentage,
        uint256 _numberOfTransactions,
        uint256 _authorRoyaltyPercentage)
        external
        onlyAdmin
        {
        minterRoyaltyPercentage = _minterRoyaltyPercentage;     // in 0.01% of a price
        minterRoyaltyN = _numberOfTransactions;                 // in 0.01% of a price
        authorRoyaltyPercentage = _authorRoyaltyPercentage;     // in 0.01% of a price
    }

    function setAuthorsRoyaltyDistribution(
        address[] calldata _addresses,
        uint256[] calldata _rates) 
        external
        onlyAdmin
        {
        require(_addresses.length == _rates.length, "different array sizes");
        uint256 totalRate = 0;
        for (uint256 i = 0; i < _rates.length; i++) {
            totalRate += _rates[i];
        }
        require(totalRate <= MAX_RATE, "totalRate cannot be more than 100");

        rates = _rates;
        beneficiaries = _addresses;
    }


    /*///////////////////////////////////////////////////////////////
                    VALIDATOR FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function verify(uint256 _id) external onlyValidator {
        require(_lotStates[_id] == 1, "invalid lot status");
        _lotStates[_id] = 2;
        emit ChangeStateLot(_id, 2);
    }


    /*///////////////////////////////////////////////////////////////
                    AUTHOR FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    


    /*///////////////////////////////////////////////////////////////
                        PUBLIC FUNCTIONS 
    //////////////////////////////////////////////////////////////*/

    function mintPresale(uint256[] calldata _tokenIDs) external payable {
        require(startPresale, "Presale has not started");
        address minter = _msgSender();
        require(presaleEligible[minter], "You are not eligible for the presale");
        require(totalSupply() + _tokenIDs.length < AMOUNT_PREMINT + presaleMaxSupply, "All presale tokens have been minted");
        require(balanceOf(minter) + _tokenIDs.length < presaleMaxMint, "Purchase exceeds max allowed for presale");
        
        uint256 totalPrice = 0;
        for (uint256 i = 0; i < _tokenIDs.length; i++) {
            require(!_exists(_tokenIDs[i]), "Token is alredy minted");
            totalPrice += presalePrices[_tokenIDs[i]];
        }
        require(msg.value == totalPrice, "ETH amount is incorrect");
        mintFees += totalPrice * mintFeePercentage / 10_000;

        for (uint256 i = 0; i < _tokenIDs.length; i++) {
            minters[_tokenIDs[i]] = minter;
            _safeMint(minter, _tokenIDs[i]);
        }

        emit PresaleMint(minter, _tokenIDs);
    }

    function mint(uint256[] calldata _tokenIDs) external payable {
        require(startSale, "Sale has not started");
        require(totalSupply() + _tokenIDs.length < maxSupply, "All tokens have been minted");

        uint256 totalPrice = 0;
        for (uint256 i = 0; i < _tokenIDs.length; i++) {
            require(!_exists(_tokenIDs[i]), "Token is alredy minted");
            totalPrice += mintPrices[_tokenIDs[i]];
        }
        require(msg.value == totalPrice, "ETH amount is incorrect");
        mintFees += totalPrice * mintFeePercentage / 10_000;

        address minter = _msgSender();
        for (uint256 i = 0; i < _tokenIDs.length; i++) {
            minters[_tokenIDs[i]] = minter;
            _safeMint(minter, _tokenIDs[i]);
        }

        emit PublicSaleMint(minter, _tokenIDs);
    }

    function listToken(uint256 _tokenID, uint256 _priceWei, bool selfValidate) external ifTockenExist(_tokenID) {
        address _owner = ownerOf(_tokenID);

        require(_owner == _msgSender(), "You are not token owner");
        require(_priceWei > 0, "Error amount");
        
        _tokenPrice[_tokenID] = _priceWei;
        
        if (selfValidate == true) {
            _lotStates[_tokenID] = 3;
        }
        else {
            _lotStates[_tokenID] = 1;
        }

        _tokensPreviousOwner[_tokenID] = _owner;
        _transfer(_owner, address(this), _tokenID);

        emit ListToken(_msgSender(), _tokenID, _priceWei, selfValidate);
    }

    function revokeToken(uint256 _tokenID) external payable ifTockenExist(_tokenID) {
        address _previousOwner = _tokensPreviousOwner[_tokenID];

        require(_lotStates[_tokenID] != 0, "Token is not listed");
        require(_previousOwner == _msgSender(), "You can only revoke your own token");

        _lotStates[_tokenID] = 0;
        _tokenPrice[_tokenID] = 0;
        _transfer(address(this), _msgSender(), _tokenID);

        emit RevokeToken(_tokenID);
    }

    function buyToken(uint256 _tokenID) external payable ifTockenExist(_tokenID) {
        require(msg.value == getTokenPrice(_tokenID), "ETH amount is incorrect");

        address _previousOwner = _tokensPreviousOwner[_tokenID];

        require(_lotStates[_tokenID] == 2 || _lotStates[_tokenID] == 3, "Token is not listed");
        require(_previousOwner != _msgSender(), "You cannot buy token from yourself");
        
        _tokenTransactions[_tokenID]++;
        _lotStates[_tokenID] = 0;
        sellFees += getTokenPrice(_tokenID) * sellFeePercentage / 10_000;

        uint256 _earning;
        address _tokenMinter = minters[_tokenID];
        uint256 _minterRoyalty;
        (_earning, _minterRoyalty,) = getTokenEarnings(_tokenID);
        payable(_previousOwner).transfer(_earning);
        payable(_tokenMinter).transfer(_minterRoyalty);

        _transfer(address(this), _msgSender(), _tokenID);

        emit BuyToken(_tokenID);
    }

    function widthdraw() public {
        uint256 fees = sellFees + mintFees;
        sellFees = 0;
        mintFees = 0;
        payable(feeAddress).transfer(fees);

        uint256 _amount = address(this).balance;
        for (uint256 i = 0; i < beneficiaries.length; i++) {
            uint256 share = (_amount * rates[i]) / 100;
            payable(beneficiaries[i]).transfer(share);
        } 
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 _tokenID
    ) public override {
        _tokenTransactions[_tokenID]++;
        safeTransferFrom(from, to, _tokenID, "");
    }


    /*///////////////////////////////////////////////////////////////
                        PLATFORM FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function setSellFeePercentage(uint256 _feePercentage) external onlyPlatform {
        require(_feePercentage <= 300, "Wrong value");
        sellFeePercentage = _feePercentage;     // in 0.01%
    }

    function setMintFeePercentage(uint256 _feePercentage) external onlyPlatform {
        require(_feePercentage <= 4000, "Wrong value");
        mintFeePercentage = _feePercentage;     // in 0.01%
    }

    function changeFeeAddress(address _newFeeAddress) external onlyPlatform {
        require(_newFeeAddress != address(0), "Wrong address");
        feeAddress = _newFeeAddress;
    }

    function changePlatformAddress(address _newAddress) external onlyPlatform {
        require(_newAddress != address(0), "Wrong address");
        roles[_msgSender()] = bytes32(0);
        roles[_newAddress] = PLATFORM;
        emit AddingValidator(_newAddress);
    }


    /*///////////////////////////////////////////////////////////////
                            VIEWERS
    //////////////////////////////////////////////////////////////*/

    function getTokenEarnings(uint256 _tokenID) public view returns(uint256 _earning, uint256 _minterRoyalty, uint256 _authorRoyalty) {
        uint256 _price = getTokenPrice(_tokenID);
        // A minter royalty decreases with each transaction
        if(minterRoyaltyN - _tokenTransactions[_tokenID] > 0) {
            _minterRoyalty = _price * minterRoyaltyPercentage * (minterRoyaltyN - _tokenTransactions[_tokenID]) / minterRoyaltyN;
        }
        else {
            _minterRoyalty = 0;
        }
        // An author royalty decreases with a price
        if(getTokenPrice(_tokenID) < 50_000 ether) {
            _authorRoyalty = _price * fiatRate * authorRoyaltyPercentage / 10_000;
        }
        else {
            _authorRoyalty = 10_000 / thirdRoot(_price * fiatRate, 0, 10) + 20;
        }

        _earning = _tokenPrice[_tokenID] * (10_000 - _minterRoyalty - _authorRoyalty - sellFeePercentage) / 10_000;
    }

    function getTokenPrice(uint256 _tokenID) public view returns(uint256 _totalPrice) {
        return _tokenPrice[_tokenID];
    }

    function isAuthor(address _user) public view returns(bool) {
        return roles[_user] == AUTHOR;
    }

    function isAdmin(address _user) public view returns(bool) {
        return roles[_user] == ADMIN;
    }

    function isValidator(address _user) public view returns(bool) {
        return roles[_user] == VALIDATOR;
    }

    function getMintFeePercentage() public view returns(uint256) {
        return mintFeePercentage;   // in 0.01%
    }

    function getSellFeePercentage() public view returns(uint256) {
        return sellFeePercentage;   // in 0.01%
    }

    function getBeneficiaries() public view returns(address[] memory) {
        return beneficiaries;
    }

    function getRates() public view returns(uint256[] memory) {
        return rates;
    }

    function getLotStates(uint256 _id) public view returns (uint256) {
        return _lotStates[_id];
    }


    /*///////////////////////////////////////////////////////////////
                            INTERNAL HELPERS
    //////////////////////////////////////////////////////////////*/
    
    function _addAuthor(address[] memory _addresses) private {
        for (uint256 i = 0; i < _addresses.length; i++) {
            roles[_addresses[i]] = AUTHOR;
        }
    }

    function _premint() private {
        for (uint256 i = 0; i < AMOUNT_PREMINT; i++) {
            _safeMint(PREMINT_ADDRESS, i);
        }
    }

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }

    // calculates a^(1/3) to dp decimal places
    // maxIts bounds the number of iterations performed
    function thirdRoot(uint _a, uint _dp, uint _maxIts) public pure returns(uint) {
        // The scale factor is a crude way to turn everything into integer calcs.
        // Actually do (a * (10 ^ ((dp + 1) * 3))) ^ (1/3)
        // We calculate to one extra dp and round at the end
        uint one = 10 ** (1 + _dp);
        uint a0 = one ** 3 * _a;

        // Initial guess: 1.0
        uint xNew = one;

        uint iter = 0;
        uint x = xNew;

        while (xNew != x && iter < _maxIts) {
            x = xNew;
            uint t0 = x ** 2;
            if (x * t0 > a0) {
                xNew = x - (x - a0 / t0) / 3;
            } else {
                xNew = x + (a0 / t0 - x) / 3;
            }
            ++iter;
        }

        // Round to nearest in the last dp.
        return (xNew + 5) / 10;
    }
}
