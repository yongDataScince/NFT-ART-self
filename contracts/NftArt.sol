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
    
    uint256 public minterRoyaltyPercentage = 0;    // in 0.01%
    uint256 public minterRoyaltyN = 0;             // max number of transactions to gain royalty
    uint256 public authorRoyaltyPercentage = 0;    // in 0.01%
    bool public authorRoyaltyType;                 // false - constant percentage, true - decreasing 
    uint256 public fiatRate = 0;                   // for athor royalty, 1:1 ratio equals 1 ether or 10^18
    
    address[] private authors;
    uint256[] private rates;        // in 0.01%
    uint256 constant private MAX_RATE = 10_000; // in 0.01%

    string public baseTokenURI;

    bytes32 constant public VALIDATOR = keccak256("VALIDATOR");
    bytes32 constant public ADMIN = keccak256("ADMIN");
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
        address _platformAddress,
        string memory _name,
        string memory _symbol)
     ERC721(_name,_symbol) {
        baseTokenURI = baseURI;

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

    function changeRoyalties(
        uint256 _minterRoyaltyPercentage,
        uint256 _numberOfTransactions,
        uint256 _authorRoyaltyPercentage,
        bool _authorRoyaltyType)
        external
        onlyAdmin
        {
        minterRoyaltyPercentage = _minterRoyaltyPercentage;     // in 0.01% of a price
        minterRoyaltyN = _numberOfTransactions;                 // max number of transactions to gain royalty
        authorRoyaltyPercentage = _authorRoyaltyPercentage;     // in 0.01% of a price
        authorRoyaltyType = _authorRoyaltyType;                 // false - constant percentage, true - decreasing 
    }

    function setAuthorsRoyaltyDistribution(
        address[] calldata _addresses,
        uint256[] calldata _rates) 
        external
        onlyAdmin
        {
        require(_addresses.length == _rates.length, "Different array sizes");
        uint256 totalRate = 0;
        for (uint256 i = 0; i < _rates.length; i++) {
            totalRate += _rates[i]; // in 0.01%
        }
        require(totalRate <= MAX_RATE, "Sum of rates cannot be grater than 100");

        rates = _rates;
        authors = _addresses;
    }

    function setFiatRate(uint256 _fiatRate) external onlyAdmin {
        require(_fiatRate != 0, "Rate should be greater than zero");
        fiatRate = _fiatRate;
    }


    /*///////////////////////////////////////////////////////////////
                        PLATFORM FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function setMintFeePercentage(uint256 _feePercentage) external onlyPlatform {
        require(_feePercentage <= 4000, "Wrong value");
        mintFeePercentage = _feePercentage;     // in 0.01%
    }

    function setSellFeePercentage(uint256 _feePercentage) external onlyPlatform {
        require(_feePercentage <= 300, "Wrong value");
        sellFeePercentage = _feePercentage;     // in 0.01%
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
                    VALIDATOR FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function verify(uint256 _id) external onlyValidator {
        require(_lotStates[_id] == 1, "Invalid lot status");
        _lotStates[_id] = 2;
        emit ChangeStateLot(_id, 2);
    }


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

    function withdraw() public {
        uint256 fees = sellFees + mintFees;
        sellFees = 0;
        mintFees = 0;
        payable(feeAddress).transfer(fees);

        uint256 _amount = address(this).balance;
        for (uint256 i = 0; i < authors.length; i++) {
            uint256 share = (_amount * rates[i]) / 10_000;
            payable(authors[i]).transfer(share);
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
                            VIEWERS
    //////////////////////////////////////////////////////////////*/

    function getTokenEarnings(uint256 _tokenID) public view returns(uint256 _earning, uint256 _minterRoyalty, uint256 _authorRoyalty) {
        uint256 _price = _tokenPrice[_tokenID];

        _minterRoyalty = 0;
        // A minter royalty decreases with each transaction
        if(minterRoyaltyN > _tokenTransactions[_tokenID]) {
            uint256 percentage = ((minterRoyaltyN - _tokenTransactions[_tokenID]) / minterRoyaltyN) * minterRoyaltyPercentage;  // in 0.01%
            _minterRoyalty = _price * percentage / 10_000;
        }

        uint256 _fiatPrice = _price * fiatRate / 1 ether;
        // An author royalty 
        // Decreases with a price
        if(authorRoyaltyType && _fiatPrice > 5000 ether) {
            _authorRoyalty = _fiatPrice * (10_000 / thirdRoot(_fiatPrice, 0, 10) + 20) / 10_000;
        }
        // Contant
        else {
            _authorRoyalty = _fiatPrice * authorRoyaltyPercentage / 10_000;
        }

        _earning = _price * (10_000 - _minterRoyalty - _authorRoyalty - sellFeePercentage) / 10_000;
    }

    function getTokenPrice(uint256 _tokenID) public view returns(uint256 _totalPrice) {
        return _tokenPrice[_tokenID];
    }

    function isAdmin(address _user) public view returns(bool) {
        return roles[_user] == ADMIN;
    }

    function isPlatform(address _user) public view returns(bool) {
        return roles[_user] == PLATFORM;
    }

    function isValidator(address _user) public view returns(bool) {
        return roles[_user] == VALIDATOR;
    }

    function getAuthors() public view returns(address[] memory) {
        return authors;
    }

    function getRates() public view returns(uint256[] memory) {
        return rates;       // in 0.01%
    }

    function getLotStates(uint256 _id) public view returns (uint256) {
        return _lotStates[_id];
    }


    /*///////////////////////////////////////////////////////////////
                            INTERNAL HELPERS
    //////////////////////////////////////////////////////////////*/

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
    function thirdRoot(uint256 _a, uint256 _dp, uint256 _maxIts) public pure returns(uint256) {
        // The scale factor is a crude way to turn everything into integer calcs.
        // Actually do (a * (10 ^ ((dp + 1) * 3))) ^ (1/3)
        // We calculate to one extra dp and round at the end
        uint256 one = 10 ** (1 + _dp);
        uint256 a0 = one ** 3 * _a;

        // Initial guess: 1.0
        uint256 xNew = one;

        uint256 iter = 0;
        uint256 x = xNew;

        while (xNew != x && iter < _maxIts) {
            x = xNew;
            uint256 t0 = x ** 2;
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
