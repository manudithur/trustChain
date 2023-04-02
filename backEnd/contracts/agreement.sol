pragma solidity ^0.8.9;
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";

import "./IArbitrator.sol";

contract AgreementContract is Ownable{

    uint64 _agreementCounter = 0;

    enum Status{
        Initial,
        Reclaimed,
        Disputed,
        Resolved,
        Finished
    }

    enum RulingOptions {
        Initial,
        PayerWins,
        PayeeWins
    }

    struct Agreement{
        address provider;
        address buyer;
        uint256 balance;
        uint8 checkpoint;
        bool paid;
        bool advanceProvider;
        bool advanceBuyer;
        bool disputable;
        Status status;
        RulingOptions ruling;
        bytes cid;
    }

    IArbitrator public arbitrator;

    mapping (uint64 => Agreement) private idToAgreement;
    mapping (address => uint64[]) private addressToIds;
    mapping (uint256 => uint64) private disputeToAgreement;

    function createAgreement(uint256 _balance) public returns (uint64) {
        uint64 agreementId = _agreementCounter++;
        addressToIds[msg.sender].push(agreementId);
        idToAgreement[agreementId].provider = msg.sender;
        idToAgreement[agreementId].balance = _balance;
        idToAgreement[agreementId].paid = false;
        idToAgreement[agreementId].advanceBuyer =false;
        idToAgreement[agreementId].advanceProvider=false;
        idToAgreement[agreementId].disputable = true;
        idToAgreement[agreementId].checkpoint=0;
        idToAgreement[agreementId].status = Status.Initial;
        idToAgreement[agreementId].ruling = RulingOptions.Initial;

        return agreementId;
    }

    function setArbitrator(address _arbitrator) public onlyOwner{
        arbitrator = IArbitrator(_arbitrator);
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

    function getAgreement(uint64 _agreementId) public view returns(Agreement memory){
        return idToAgreement[_agreementId];
    }

    function getBalance(uint64 _agreementId) public view returns(uint256){
        return idToAgreement[_agreementId].balance;
    }

    function claim(uint64 _agreementId) public {
        
        require(idToAgreement[_agreementId].checkpoint == 3);
        require(idToAgreement[_agreementId].provider == msg.sender);
        require(idToAgreement[_agreementId].status == Status.Initial || idToAgreement[_agreementId].status == Status.Resolved);

        if(idToAgreement[_agreementId].status == Status.Resolved){
            require(idToAgreement[_agreementId].ruling == RulingOptions.PayeeWins);
        }

        //Transfer balance to provider
        Address.sendValue(payable(msg.sender), idToAgreement[_agreementId].balance);
        idToAgreement[_agreementId].status = Status.Finished;

        //idToAgreement[_agreementId].provider.transfer(idToAgreement[_agreementId].balance);
    }
    

    function reclaimFunds(uint64 _agreementId) public payable{
        require(msg.sender == idToAgreement[_agreementId].buyer);
        require(idToAgreement[_agreementId].status == Status.Initial || idToAgreement[_agreementId].status == Status.Resolved);
        idToAgreement[_agreementId].disputable = false;

        if(idToAgreement[_agreementId].status == Status.Resolved){
            require(idToAgreement[_agreementId].ruling == RulingOptions.PayerWins);
            Address.sendValue(payable(msg.sender), idToAgreement[_agreementId].balance);
            idToAgreement[_agreementId].status = Status.Finished;

        } else{
            uint256 arbitrationCost = arbitrator.arbitrationCost("");
            require(msg.value >= arbitrationCost, "Not enough ETH to cover arbitration costs.");
            uint256 disputeID = arbitrator.createDispute{value: msg.value}(2, "", idToAgreement[_agreementId].cid);
            disputeToAgreement[disputeID] = _agreementId;
            idToAgreement[_agreementId].status = Status.Disputed;
        }
    }

    function rule(uint256 disputeID, uint256 _ruling) public{
        require(msg.sender == address(arbitrator));

        uint64 id = disputeToAgreement[disputeID];

        require(idToAgreement[id].status == Status.Disputed);

        if(_ruling == 1){
            idToAgreement[id].ruling = RulingOptions.PayerWins;
        }else if(_ruling == 2){
            idToAgreement[id].ruling = RulingOptions.PayeeWins;
        }
        idToAgreement[id].status = Status.Resolved;
    } 

    function checkpointBuyer(uint64 _agreementId) public{
        require(msg.sender==idToAgreement[_agreementId].buyer);
        idToAgreement[_agreementId].advanceBuyer =true;
        if(idToAgreement[_agreementId].advanceProvider){
            idToAgreement[_agreementId].checkpoint++;
            idToAgreement[_agreementId].advanceBuyer =false;
            idToAgreement[_agreementId].advanceProvider =false;
        }
    }

    
    function checkpointProvider(uint64 _agreementId) public{
        require(msg.sender==idToAgreement[_agreementId].provider);
        idToAgreement[_agreementId].advanceProvider =true;
        if(idToAgreement[_agreementId].advanceBuyer){
            idToAgreement[_agreementId].checkpoint++;
            idToAgreement[_agreementId].advanceBuyer =false;
            idToAgreement[_agreementId].advanceProvider =false;
        }
    }

    function getAgreementStatus(uint64 _agreementId) public view returns (uint8){
        return idToAgreement[_agreementId].checkpoint;
    }

    function getContractBalance() public view returns (uint256) {
         return address(this).balance;
    }

}