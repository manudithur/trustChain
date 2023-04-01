pragma solidity ^0.8.9;
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";

contract AgreementContract {

    uint64 _agreementCounter = 0;

    struct Agreement{
        address provider;
        address buyer;
        uint256 balance;
        uint8 checkpoint;
        bool canClaim;
        bool paid;
        bool advanceProvider;
        bool advanceBuyer;
        bool disputable;
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
        idToAgreement[agreementId].advanceBuyer =false;
        idToAgreement[agreementId].advanceProvider=false;
        idTOAgreement[agreementId].disputable = true;
        idToAgreement[agreementId].checkpoint=0;

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
        mediate(_agreementId);
        require(idToAgreement[_agreementId].provider == msg.sender);
        require(idToAgreement[_agreementId].canClaim);
        Address.sendValue(payable(msg.sender), idToAgreement[_agreementId].balance);
        //idToAgreement[_agreementId].provider.transfer(idToAgreement[_agreementId].balance);
    }

    //returns 0 when ok
    //returns 1 when money should be sent to buyer
    //returns 2 when money should be sent to provider
    function oracle() public returns(uint8) {
        return 0;
    }

    function mediate(uint64 _agreementId) public{
        if(oracle() == 0){
            idToAgreement[_agreementId].canClaim = true;
        }
        // }else if(oracle() == 1){
        //     idToAgreement[_agreementId].buyer.transfer(idToAgreement[_agreementId].balance);
        // }else {
        //     idToAgreement[_agreementId].provider.transfer(idToAgreement[_agreementId].balance);
        // }
    }

    function dispute(uint64 _agreementId) public {
        require(msg.sender == idToAgreement[_agreementId].buyer || msg.sender == idToAgreement[_agreementId].provider);
        idToAgreement[_agreementId].disputable = false;
        //DISPUTE WITH ARBITRATOR

    }

    function checkpointBuyer(uint64 _agreementId) public{
        require(msg.sender==idToAgreement[_agreementId].buyer);
        idToAgreement[_agreementId].advanceBuyer =true;
        if(idToAgreement[_agreementId].advanceProvider){
            idToAgreement[_agreementId].checkpoint++;
            idToAgreement[_agreementId].advanceBuyer =false;
            idToAgreement[_agreementId].advanceConsumer =false;
        }
    }

    
    function checkpointProvider(uint64 _agreementId) public{
        require(msg.sender==idToAgreement[_agreementId].provider);
        idToAgreement[_agreementId].advanceProvider =true;
        if(idToAgreement[_agreementId].advanceBuyer){
            idToAgreement[_agreementId].checkpoint++;
            idToAgreement[_agreementId].advanceBuyer =false;
            idToAgreement[_agreementId].advanceConsumer =false;
        }
    }

    function getAgreementStatus(uint64 _agreementId) public view return (uint8){
        return idToAgreement[_agreementId].checkpoint;
    }

    function getContractBalance() public view returns (uint256) {
         return address(this).balance;
    }

}