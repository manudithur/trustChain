import { Container, Grid, Button, rem, createStyles, Title } from "@mantine/core";
import { SrvRecord } from "dns";
import { useRouter } from "next/router";
import { useState } from "react";
import smartContract from '../smartContract/AgreementContract.json';
import contractAddress from '../smartContract/conctractAddress.json';
import { ethers } from 'ethers';
import Web3 from 'web3';

const useStyles = createStyles((theme) => ({
    control: {
        paddingLeft: rem(50),
        paddingRight: rem(50),
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        fontSize: rem(22),
    
        [theme.fn.smallerThan('md')]: {
          width: '100%',
        },
      },
  }));
  

export default function accept(){
    const {classes} = useStyles();

    const router = useRouter();
    const {id} = router.query;
    async function  acceptAgreement(){
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: "0x13881" }],
           // '0x3830303031'
      });
    
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    // step 2 - Initialize your contract
    
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const yourSignedContractObject = new ethers.Contract(
          contractAddress.address, 
          smartContract.abi,
          provider.getSigner(0)
        );
    
        const web3 = new Web3(window.ethereum);
             
        var myContractInstance = new web3.eth.Contract(smartContract.abi as any, contractAddress.address);
        // step 3 - Submit transaction to metamask
        var aux = await myContractInstance.methods.getBalance(id).call({
            from: web3.utils.toChecksumAddress(accounts[0]), 
            gas: 0x00, 
            gasPrice: 0x00
         }).then((resp:any)=>{
            console.log(resp);
        })
         
        var aux2 = await myContractInstance.methods.signAgreement(id).send({
               from: web3.utils.toChecksumAddress(accounts[0]), 
               value: aux,
               
            })
            
    
      }
    return (
        <div style={{overflowY: 'hidden', overflowX: 'hidden'}}>
            <Grid mt={100}>
                <Grid.Col span={4}/>
                <Grid.Col span={4}>
                    <Container>
                        <Title>Agreement ID: {id}</Title>
                        <Button
                            variant="gradient"
                            gradient={{ from: 'pink', to: 'yellow' }}
                            size="xl"
                            ml={43}
                            className={classes.control}
                            //onClick={createAgreement}
                            mt={60}
                            onClick={acceptAgreement}
                            >
                            Accept Agreement
                        </Button>
                    </Container>
                </Grid.Col>
                <Grid.Col span={4}/>
            </Grid>
        </div>

    );

}