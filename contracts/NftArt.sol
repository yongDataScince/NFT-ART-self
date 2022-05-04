// SPDX-License-Identifier: MIT

pragma solidity ^0.8.1;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract NFTArt is ERC721Enumerable, Ownable{

    /*///////////////////////////////////////////////////////////////
                    GLOBAL STATE
    //////////////////////////////////////////////////////////////*/

    address constant public PREMINT_ADDRESS = 0x0eab415C80DC6B1c3265a75dbB836932A9938c83;
    address constant public FEE_ADDRESS = 0x0eab415C80DC6B1c3265a75dbB836932A9938c83;

    uint256 constant public AMOUNT_PREMINT = 10;
    uint256 constant public PRESALE_PRICE = 0.001 ether;
    uint256 constant public PRESALE_MAX_SUPPLY = 20;
    uint256 constant public PRESALE_MAX_PER_MINT = 8;
    uint256 constant public PRESALE_MAX_MINT = 11;

    uint256 public PRICE = 0.002 ether;
    uint256 constant private MAX_RATE = 100;

    bytes32 constant private VALIDATOR = keccak256("VALIDATOR");
    bytes32 constant private ADMIN = keccak256("ADMIN");
    bytes32 constant private AUTHOR = keccak256("AUTHOR");


    uint256 public maxSupply = 30;
    uint256 private royaltyPercentage = 0;  // in 0.01%
    uint256 private royaltyDecrease = 0;    // in 0.01%
    uint256 private feePercentage = 0;    // in 0.01%
    uint256 private fees = 0;    // accumulated fees
    
    string public baseTokenURI;

    bool private royaltyType = true; //true - royalty decrease with a transactions number, false - royalty decrease with a token price
    bool public startSale = false;
    bool public startPresale = false;
    
    address[] private beneficiaries;
    uint256[] private rates;

    event AddingValidator(address _validatorAddress);
    event AddingAuthor(address _authorAddress);
    event AddingAdmin(address _adminAddress);
    event ChangeBaseURI(string baseURI); 
    event ChangeStateLot(uint256 lot, uint256 value);
    event PresaleMint(address minter, uint256 tokensID);
    event PublicSaleMint(address minter, uint256 tokensID);
    event RemoveValidator(address _validatorAddress);
    event RemoveAdmin(address _adminAddress);


    /*///////////////////////////////////////////////////////////////
                    DATA STRUCTURES 
    //////////////////////////////////////////////////////////////*/
    
    mapping (address => bytes32) private _roles;
    mapping (uint256 => uint256) public lotStates;
    mapping (uint256 => uint256) public mintPrices;
    mapping (uint256 => uint256) public presalePrices;

    /*
    lotStates has the following states:
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

    modifier ifTockenExist(uint256 _tokenID) {
        _exists(_tokenID);
        _;
    }

    constructor(
        string memory baseURI,
        address[] memory _authors,
        string memory _name,
        string memory _symbol,
        uint256 _feePercentage)
     ERC721(_name,_symbol) {
        baseTokenURI = baseURI;
        feePercentage = _feePercentage;    // in 0.01%

        _addAuthor(_authors);

        _premint();
        
        emit ChangeBaseURI(baseTokenURI);
    }


   /*///////////////////////////////////////////////////////////////
                    OWNER'S FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function togglePresaleStarted() external onlyOwner {
        startPresale = !startPresale;
    }
    
    function togglePublicSaleStarted() external onlyOwner {
        startSale = !startSale;
    }
    
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

    function setMaxSupply(uint256 _max) external onlyOwner {
        require(_max > maxSupply, "You can only increase max supply");
        maxSupply = _max;
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

    function setBaseURI(string calldata baseURI) public onlyOwner {
        baseTokenURI = baseURI;
        emit ChangeBaseURI(baseURI);
    }


    /*///////////////////////////////////////////////////////////////
                    ADMIN FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    // add platforms fee in constructor

    function changeRoyalty(
        uint256 _royaltyPercentage,
        bool _royaltyType,
        uint256 _decrease)
        external
        onlyAdmin
        {
        royaltyType = _royaltyType; //true - royalty decrease with a transactions number, false - royalty decrease with a token price
        royaltyPercentage = _royaltyPercentage;  // in 0.01% of a price
        royaltyDecrease = _decrease;             // in 0.01% of a price
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
        require(lotStates[_id] == 1, "invalid lot status");
        lotStates[_id] = 2;
        emit ChangeStateLot(_id, 2);
    }


    /*///////////////////////////////////////////////////////////////
                    AUTHOR FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function changeMintPrice(uint[] calldata _ids, uint[] calldata _prices) external onlyAuthor {
        require(_ids.length == _prices.length, "Wrong arrays");
/////////////////////// todo
        // for (uint256 i = 0; i < _addresses.length; i++) {
        //     require(_addresses[i] != address(0), "Cannot add null address");
        //     presaleEligible[_addresses[i]] = true;
        // }
    }


    /*///////////////////////////////////////////////////////////////
                        PUBLIC FUNCTIONS 
    //////////////////////////////////////////////////////////////*/

    function mintPresale(uint256 _tokenID) external payable {
        require(startPresale, "Presale has not started");
        require(presaleEligible[_msgSender()], "You are not eligible for the presale");
        require(totalSupply() < AMOUNT_PREMINT + PRESALE_MAX_SUPPLY, "All presale tokens have been minted");
        require(balanceOf(_msgSender()) < PRESALE_MAX_MINT, "Purchase exceeds max allowed for presale");
        require(msg.value == presalePrices[_tokenID], "ETH amount is incorrect");
        require(!_exists(_tokenID), "Token is alredy minted");
       
        _safeMint(_msgSender(), _tokenID);

        emit PresaleMint(_msgSender(), _tokenID);
    }

    function mint(uint256 _tokenID) external payable {
        require(startSale, "Sale has not started");
        require(totalSupply() < maxSupply, "All tokens have been minted");
        require(msg.value == mintPrices[_tokenID], "ETH amount is incorrect");
        require(!_exists(_tokenID), "Token is alredy minted");

        _safeMint(_msgSender(), _tokenID);

        emit PublicSaleMint(_msgSender(), _tokenID);
    }

    function listToken(uint256 _tokenID, uint256 _priceWei, bool selfValidate) external ifTockenExist(_tokenID) {
        address _owner = ownerOf(_tokenID);

        require(_owner == _msgSender(), "You are not token owner");
        require(_priceWei > 0, "Error amount");
        
        _tokenPrice[_tokenID] = _priceWei;
        
        if (selfValidate == true) {
            lotStates[_tokenID] = 3;
        }
        else {
            lotStates[_tokenID] = 1;
        }

        _tokensPreviousOwner[_tokenID] = _owner;
        _transfer(_owner, address(this), _tokenID);
    }

    function revokeToken(uint256 _tokenID) external payable ifTockenExist(_tokenID) {
        address _previousOwner = _tokensPreviousOwner[_tokenID];

        require(lotStates[_tokenID] != 0, "Token is not listed");
        require(_previousOwner == _msgSender(), "You can only revoke your own token");

        lotStates[_tokenID] = 0;
        _tokenPrice[_tokenID] = 0;
        _transfer(address(this), _msgSender(), _tokenID);
    }

    function buyToken(uint256 _tokenID) external payable ifTockenExist(_tokenID) {
        require(msg.value == getTokenPrice(_tokenID), "ETH amount is incorrect");

        address _previousOwner = _tokensPreviousOwner[_tokenID];

        require(lotStates[_tokenID] == 2 || lotStates[_tokenID] == 3, "Token is not listed");
        require(_previousOwner != _msgSender(), "You cannot buy token from yourself");
        
        _tokenTransactions[_tokenID]++;
        lotStates[_tokenID] = 0;
        fees += getTokenPrice(_tokenID) * feePercentage;
        payable(_previousOwner).transfer(getTokenEarnings(_tokenID));
        _transfer(address(this), _msgSender(), _tokenID);
    }

    function widthdraw(uint256 _amount) public {
        payable(FEE_ADDRESS).transfer(fees);
        fees = 0;

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
                            VIEWERS
    //////////////////////////////////////////////////////////////*/

    function getTokenEarnings(uint256 _tokenID) public view returns(uint256 _totalPrice) {
        uint256 currentRoyalty = 0;

        // Royalty decreases with each transaction
        if (royaltyType == true) {
            uint256 decrease = royaltyDecrease * _tokenTransactions[_tokenID];
            if (decrease < royaltyPercentage)
                currentRoyalty = royaltyPercentage - decrease;    // in 0.01% of a price
        }
        // Royalty decreases with a price
        else {
            currentRoyalty = royaltyPercentage * PRICE / _tokenPrice[_tokenID];    // in 0.01% of a price
            if (currentRoyalty > royaltyPercentage) 
                currentRoyalty = royaltyPercentage;
        }

        _totalPrice = _tokenPrice[_tokenID] * (10_000 - currentRoyalty - feePercentage) / 10_000;
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

    function getFeePercentage() public view returns(uint256) {
        return feePercentage;
    }

    function getBeneficiaries() public view returns(address[] memory) {
        return beneficiaries;
    }

    function getRates() public view returns(uint256[] memory) {
        return rates;
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