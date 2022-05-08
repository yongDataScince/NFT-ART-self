// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

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

    uint256 private royaltyPercentage = 0;      // in 0.01%
    uint256 private royaltyDecrease = 0;        // in 0.01%
    uint256 private mintFeePercentage = 0;      // in 0.01%
    uint256 private mintFees = 0;               // accumulated fees
    uint256 private sellFeePercentage = 0;      // in 0.01%
    uint256 private sellFees = 0;               // accumulated fees
    address constant public FEE_ADDRESS = 0x0eab415C80DC6B1c3265a75dbB836932A9938c83;
    bool private royaltyType = true;            //true - royalty decrease with a transactions number, false - royalty decrease with a token price    
    
    address[] private beneficiaries;
    uint256[] private rates;
    uint256 constant private MAX_RATE = 100;

    string public baseTokenURI;

    bytes32 constant private VALIDATOR = keccak256("VALIDATOR");
    bytes32 constant private ADMIN = keccak256("ADMIN");
    bytes32 constant private AUTHOR = keccak256("AUTHOR");
    bytes32 constant private PLATFORM = keccak256("PLATFORM");

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
    
    mapping (address => bytes32) private _roles;
    mapping (uint256 => uint256) private _lotStates;
    mapping (uint256 => uint256) public mintPrices;
    mapping (uint256 => uint256) public presalePrices;

    /*
    _lotStates has the following states:
    0 - token at the owner
    1 - contract owns the token, the token listing isn't confirmed
    2 - contract owns the token, the token is listed and confirmed by the validator
    3 - contract owns the token, the token is listed and confirmed by the seller itself
    */

    mapping (address => bool) public presaleEligible;
    mapping (uint256 => uint256) private _tokenPrice;
    mapping (uint256 => address) private _tokensPreviousOwner;
    mapping (uint256 => uint256) private _tokenTransactions;
    
    modifier onlyAdmin() {
        require(_roles[_msgSender()] == ADMIN, "caller is not the admin!");
        _;
    }

    modifier onlyValidator() {
        require(_roles[_msgSender()] == VALIDATOR, "caller is not the validator!");
        _;
    }

    modifier onlyAuthor() {
        require(_roles[_msgSender()] == AUTHOR, "caller is not the author!");
        _;
    }

    modifier onlyPlatform() {
        require(_roles[_msgSender()] == PLATFORM, "caller is not the platform!");
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

        _roles[_platformAddress] = PLATFORM;

        _premint();
        
        emit ChangeBaseURI(baseTokenURI);
    }


   /*///////////////////////////////////////////////////////////////
                    OWNER'S FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    
    function addValidator(address _address) external onlyOwner {
        _roles[_address] = VALIDATOR;
        emit AddingValidator(_address);
    }

    function removeValidator(address _address) external onlyOwner {
        require(_roles[_address] == VALIDATOR, "This is not a validator");
        _roles[_address] = 0;
        emit RemoveValidator(_address);
    }

    function addAdmin(address _address) external onlyOwner {
        _roles[_address] = ADMIN;
        emit AddingAdmin(_address);
    }

    function removeAdmin(address _address) external onlyOwner {
        require(_roles[_address] == ADMIN, "This is not an admin");
        _roles[_address] = 0;
        emit RemoveAdmin(_address);
    }

    function addAuthor(address _address) external onlyOwner {
        _roles[_address] = AUTHOR;
        emit AddingAuthor(_address);
    }

    function removeAuthor(address _address) external onlyOwner {
        require(_roles[_address] == AUTHOR, "This is not an author");
        _roles[_address] = 0;
        emit RemoveAuthor(_address);
    }

    function setBaseURI(string calldata baseURI) public onlyOwner {
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

    function setPresaleMaxSupply(uint256 _presaleMaxSupply) public onlyOwner {
        presaleMaxSupply = _presaleMaxSupply;
    }

    function setPresaleMaxMint(uint256 _presaleMaxMint) public onlyOwner {
        presaleMaxMint = _presaleMaxMint;
    }

    function setPresaleMaxPerMint(uint256 _presaleMaxPerMint) public onlyOwner {
        presaleMaxPerMint = _presaleMaxPerMint;
    }

    function changePresaleMintPrice(uint256[] calldata _ids, uint256[] calldata _prices) external onlyOwner {
        require(_ids.length == _prices.length, "Mismatched arrays length");
        for (uint256 i = 0; i < _ids.length; i++) {
            _tokenPrice[_ids[i]] = _prices[i];
        }
    }

    // Public sale settings
    function togglePublicSaleStarted() external onlyOwner {
        startSale = !startSale;
    }

    function changeMintPrice(uint256[] calldata _ids, uint256[] calldata _prices) external onlyOwner {
        require(_ids.length == _prices.length, "Mismatched arrays length");
        for (uint256 i = 0; i < _ids.length; i++) {
            presalePrices[_ids[i]] = _prices[i];
        }
    }

    function setMaxSupply(uint256 _maxSupply) external onlyOwner {
        require(_maxSupply > maxSupply, "You can only increase max supply");
        maxSupply = _maxSupply;
    }


    /*///////////////////////////////////////////////////////////////
                    ADMIN FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function changeRoyalty(
        uint256 _royaltyPercentage,
        bool _royaltyType,
        uint256 _decrease)
        external
        onlyAdmin
        {
        royaltyType = _royaltyType; //true - royalty decrease with a transactions number, false - royalty decrease with a token price
        royaltyPercentage = _royaltyPercentage;     // in 0.01% of a price
        royaltyDecrease = _decrease;                // in 0.01% of a price
    }

    function setRoyaltyDistribution(
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
        require(presaleEligible[_msgSender()], "You are not eligible for the presale");
        require(totalSupply() + _tokenIDs.length < AMOUNT_PREMINT + presaleMaxSupply, "All presale tokens have been minted");
        require(balanceOf(_msgSender()) + _tokenIDs.length < presaleMaxMint, "Purchase exceeds max allowed for presale");
        
        uint256 totalPrice = 0;
        for (uint256 i = 0; i < _tokenIDs.length; i++) {
            require(!_exists(_tokenIDs[i]), "Token is alredy minted");
            totalPrice += presalePrices[_tokenIDs[i]];
        }
        require(msg.value == totalPrice, "ETH amount is incorrect");
        mintFees += totalPrice * mintFeePercentage / 10_000;

        for (uint256 i = 0; i < _tokenIDs.length; i++) {
            _safeMint(_msgSender(), _tokenIDs[i]);
        }

        emit PresaleMint(_msgSender(), _tokenIDs);
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

        for (uint256 i = 0; i < _tokenIDs.length; i++) {
            _safeMint(_msgSender(), _tokenIDs[i]);
        }

        emit PublicSaleMint(_msgSender(), _tokenIDs);
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
        payable(_previousOwner).transfer(getTokenEarnings(_tokenID));
        _transfer(address(this), _msgSender(), _tokenID);

        emit BuyToken(_tokenID);
    }

    function widthdraw(uint256 _amount) public {
        payable(FEE_ADDRESS).transfer(sellFees + mintFees);
        sellFees = 0;
        mintFees = 0;

        for (uint256 i = 0; i < beneficiaries.length; i++) {
            uint256 share = (_amount * rates[i]) / 100;
            (bool success, ) = beneficiaries[i].call{value: share}("");
            require(success, "Failed to transfer Ether");
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
        sellFeePercentage = _feePercentage;     // in 0.01%
    }

    function setMintFeePercentage(uint256 _feePercentage) external onlyPlatform {
        mintFeePercentage = _feePercentage;     // in 0.01%
    }  

    function changePlatformAddress(address _newAddress) external onlyPlatform {
        _roles[_msgSender()] = bytes32(0);
        _roles[_newAddress] = PLATFORM;
        emit AddingValidator(_newAddress);
    }  


    /*///////////////////////////////////////////////////////////////
                            VIEWERS
    //////////////////////////////////////////////////////////////*/

    function getTokenEarnings(uint256 _tokenID) public view returns(uint256 _totalPrice) {
        uint256 currentRoyalty = 0;

        // Royalty decreases with each transaction
        if (royaltyType == true) {
            // uint256 decrease = royaltyDecrease * _tokenTransactions[_tokenID];
            // if (decrease < royaltyPercentage)
            //     currentRoyalty = royaltyPercentage - decrease;    // in 0.01% of a price
        }
        // Royalty decreases with a price
        else {
            // currentRoyalty = royaltyPercentage * PRICE / _tokenPrice[_tokenID];    // in 0.01% of a price
            // if (currentRoyalty > royaltyPercentage) 
            //     currentRoyalty = royaltyPercentage;
        }

        // _totalPrice = _tokenPrice[_tokenID] * (10_000 - currentRoyalty - feePercentage) / 10_000;
    }

    function getTokenPrice(uint256 _tokenID) public view returns(uint256 _totalPrice) {
        return _tokenPrice[_tokenID];
    }

    function isAuthor(address _user) public view returns(bool) {
        return _roles[_user] == AUTHOR;
    }

    function isAdmin(address _user) public view returns(bool) {
        return _roles[_user] == ADMIN;
    }

    function isValidator(address _user) public view returns(bool) {
        return _roles[_user] == VALIDATOR;
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
            _roles[_addresses[i]] = AUTHOR;
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
}
