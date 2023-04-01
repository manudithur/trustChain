pragma solidity ^0.8.9;

contract Agreement {

    uint64 _agreementCounter = 0;

    struct Agreement{
        address provider;
        address buyer;
        uint256 balance;
        bool canClaim;
        bool paid;
    }

    mapping (uint64 => Agreement) private idToAgreement;
    mapping (address => uint64[]) private addressToIds;

    function createAgreement(uint256 _balance) public returns (uint64) {
        uint64 agreementId = _agreementCounter++;
        addressToIds[msg.sender].push(agreementId);
        idToAgreement[agreementId].provider = msg.sender;
        idToAgreement[agreementId].balance = _balance;
        idToAgreement[agreementId].canClaim = false;
        idToAgreement[agreementId].paid = false;
        return agreementId;
    }

    function signAgreement(uint64 _agreementId) public payable{
        // TODO revisar lo del hex:
        require(msg.value == idToAgreement[_agreementId].balance );
        idToAgreement[_agreementId].buyer = msg.sender;
        idToAgreement[_agreementId].paid = true;
    }

    function isPaid(uint64 _agreementId) public view returns(bool){
        return idToAgreement[_agreementId].paid;
    }

    function getAgreements() public view returns(uint64 [] memory){
        return addressToIds[msg.sender];
    }

    function getBalance(uint64 _agreementId) public view returns(uint256){
        return idToAgreement[_agreementId].balance;
    }

    function claim(uint64 _agreementId) public {
        require(idToAgreement[_agreementId].provider == msg.sender);
        require(idToAgreement[_agreementId].canClaim);
        idToAgreement[_agreementId].provider.transfer(idToAgreement[_agreementId].balance);
    }

    //returns 0 when ok
    //returns 1 when money should be sent to buyer
    //returns 2 when money should be sent to provider
    function oracle() public returns(uint8) {
        return 0;
    }

    function mediate(){
        if(oracle() == 0){
            idToAgreement[_agreementId].canClaim = true;
        }elif(oracle() == 1){
            idToAgreement[_agreementId].buyer.transfer(idToAgreement[_agreementId].balance);
        }else {
            idToAgreement[_agreementId].provider.transfer(idToAgreement[_agreementId].balance);
        }
    }

}