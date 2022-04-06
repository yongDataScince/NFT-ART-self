// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;
//не покупается Didn't send enough ETH".
//продается невалидированный токен

import "./access/Ownable.sol";
import "./token/ERC721/extensions/ERC721Enumerable.sol";

contract NFTArt is ERC721Enumerable, Ownable{

    /*///////////////////////////////////////////////////////////////
                    GLOBAL STATE
    //////////////////////////////////////////////////////////////*/

    address constant public PREMINT_ADDRESS = 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2;

    uint256 constant public AMOUNT_PREMINT = 10;

    uint256 constant public PRESALE_MAX_SUPPLY = 20;
    uint256 constant public PRESALE_MAX_PER_MINT = 8;
    uint256 constant public PRESALE_MAX_MINT = 11;

    uint256 constant public MAX_PER_MINT = 12;
    uint256 constant public MAX_MINT = 15;

    uint256 constant public PRICE = 0.1 ether;
    uint256 constant private MAX_RATE = 100;

    bytes32 constant private VALIDATOR = keccak256("VALIDATOR");
    bytes32 constant private ADMIN = keccak256("ADMIN");
    bytes32 constant private AUTHOR = keccak256("AUTHOR"); // сделать функцию чтения


    uint256 public maxSupply = 30;
    uint256 private royaltyPercentage = 0;  // in 0.01% of a price
    uint256 private royaltyDecrease = 0;    // in 0.01% of a price
    
    string public baseTokenURI;

    bool private royaltyType = true; //true - уменьшается от количества транзакций, false - уменьшается от цены
    bool public startSale = false;
    bool public startPresale = false;
    
    address[] public beneficiaries;
    uint256[] private rate;

    event AddingValidator(address _validatorAddress);
    event AddingAuthor(address _authorAddress);
    event AddingAdmin(address _adminAddress);
    event ChangeBaseURI(string baseURI); 
    event ChangeStateLot(uint256 lot, uint256 value);
    event PresaleMint(address minter, uint256 amountOf);
    event PublicSaleMint(address minter, uint256 amountOf);
    event RemoveValidator(address _validatorAddress);
    event RemoveAdmin(address _adminAddress);


    /*///////////////////////////////////////////////////////////////
                    DATA STRUCTURES 
    //////////////////////////////////////////////////////////////*/
    
    mapping (address => bytes32) private _roles;
    mapping (uint256 => uint256) public _lotStates;

    /*
    _lotStates has the following states:
    0 - token from the owner
    1 - the token is in the contract, the owner has flipped, but not confirmed
    2 - the token of the contract, the owner has flipped, confirmed by the validator
    3 - the token of the contract, the owner has flipped and confirmed himself
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
        string memory _symbol)
     ERC721(_name,_symbol) {
        baseTokenURI = baseURI;
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
        royaltyType = _royaltyType; // true - уменьшается от количества транзакций, false - уменьшается от цены
        royaltyPercentage = _royaltyPercentage;  // in 0.01% of a price
        royaltyDecrease = _decrease;             // in 0.01% of a price
    }

    function setRoyaltyDistribution(
        address[] calldata _addresses,
        uint256[] calldata _rate) 
        external
        onlyAdmin
        {
        uint256 totalRate = 0;
        for (uint256 i = 0; i < _rate.length; i++) {
            totalRate += _rate[i];
        }
        require(totalRate <= MAX_RATE, "totalRate cannot be more than 100");

        rate = _rate;
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
                        PUBLIC FUNCTIONS 
    //////////////////////////////////////////////////////////////*/

    // проверить ошибку по газу
    function mintPresale(uint256 _amountOf) external payable {
        require(startPresale, "Presale has not started");
        require(presaleEligible[_msgSender()], "You are not eligible for the presale");
        require(totalSupply() < AMOUNT_PREMINT + PRESALE_MAX_SUPPLY, "All presale tokens have been minted");
        require(totalSupply() + _amountOf <= AMOUNT_PREMINT + PRESALE_MAX_SUPPLY, "Minting would exceed presale max supply");
        require(balanceOf(_msgSender()) + _amountOf <= PRESALE_MAX_MINT, "Purchase exceeds max allowed for presale");
        require(_amountOf <= PRESALE_MAX_PER_MINT, "Cannot purchase this many tokens during presale");
       
        for (uint256 i = totalSupply(); i < totalSupply() + _amountOf; i++) {
            _safeMint(_msgSender(), i);
        }

        emit PresaleMint(_msgSender(), _amountOf);
    }

    function mint(uint256 _amountOf) external payable {
        require(startSale, "Sale has not started");
        require(totalSupply() + _amountOf <= maxSupply, "All tokens have been minted");

        for (uint256 i = totalSupply(); i < totalSupply() + _amountOf; i++) {
            _safeMint(_msgSender(), i);
        }
    }

    // проверить логику с _previousOwner
    function listToken(uint256 _tokenID, uint256 _amount, bool selfValidate) external ifTockenExist(_tokenID) {
        address _owner = ownerOf(_tokenID);

        require(_owner == _msgSender(), "You are not token owner");
        require(_amount > 0, "Error amount");
        
        _tokenPrice[_tokenID] = _amount;
        
        if (selfValidate == true){
            _lotStates[_tokenID] = 3;
        }
        else {
             _lotStates[_tokenID] = 1;
        }

        _tokensPreviousOwner[_tokenID] = _owner;
        _transfer(_owner, address(this), _tokenID);
    }

    function buyToken(uint256 _tokenID) external payable ifTockenExist(_tokenID) {
        address _previousOwner = _tokensPreviousOwner[_tokenID];

        require(_lotStates[_tokenID] == 2 || _lotStates[_tokenID] == 3, "Token is not listed");
        require(_tokenPrice[_tokenID] == msg.value, "Not correct ETH value");
        require(_previousOwner != _msgSender(), "You cannot buy token from yourself");
        
        payable(_previousOwner).transfer(getTokenPrice(_tokenID));
        _tokenTransactions[_tokenID]++;
        _transfer(address(this), _msgSender(), _tokenID);
    }

    function revertToken(uint256 _tokenID) external payable ifTockenExist(_tokenID) {
        address _previousOwner = _tokensPreviousOwner[_tokenID];

        require(_lotStates[_tokenID] == 2 || _lotStates[_tokenID] == 3, "Token is not listed");
        require(_previousOwner == _msgSender(), "You can revert only your token");

        _transfer(address(this), _msgSender(), _tokenID);
    }

    // затестить что эфиры переводятся с контракта
    function widthdraw(uint256 _amount) public {
        for (uint256 i = 0; i < beneficiaries.length; i++) {
            uint256 share = (_amount * rate[i]) / 100;
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

    function getTokenPrice(uint256 _tokenID) public view returns(uint256 _totalPrice) {
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

        _totalPrice = _tokenPrice[_tokenID] * (10_000 - currentRoyalty) / 10_000;
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