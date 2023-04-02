import { Badge, Button, Card, Divider, Grid, List, Title, createStyles } from "@mantine/core";
import smartContract from '../smartContract/AgreementContract.json';
import contractAddress from '../smartContract/conctractAddress.json';
import { ethers } from 'ethers';
import Web3 from 'web3';
import { useEffect, useState } from "react";

type ListItemProps = {
    title: string,
    colorNum: number
}

type statusVar = {
    id: string,
    status: number
}

function ListItem({ title, colorNum }: ListItemProps) {
    //0 No status
    //1 Salio
    //2 Llego
    //3 Recibio
    var color = 'white';
    var label = 'Not Accepted'
    switch(colorNum){
        case 1: {
            color = 'green'
            label = 'Accepted'
        };
        case 2: {
            color = 'cyan'
            label = 'In Port'
        };
        case 3: {
            color = 'green'
            label = 'Received'
        };
        default:{

        }
    }
    return (
      <Card style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #ccc'}}>
        <div>{title}</div>
        <div style={{ borderRadius: '12px', padding: '4px 8px' }}><Badge color={color}>{label}</Badge></div>
      </Card>
    );
  }
  
function MyList({ values }: { values: Array<Agreement> }) {
    return (
        <List>
        {values.map((item) => (
            <ListItem key={item.id} title={item.id} colorNum={Number(item.status)}/>
        ))}
        </List>
    );
}

  
interface Agreement {
    id: string;
    status: string;
  }
  
  export default function Status() {
    const [array, setArray] = useState<Agreement[]>([]);
  
    useEffect(() => {
      // This function will be executed on render
      getIds();
    }, []);
  
    useEffect(() => {
      console.log("Recibi" + JSON.stringify(array));
    }, [array]);
  
    async function getIds() {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x13881" }],
      });
  
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
  
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const yourSignedContractObject = new ethers.Contract(
        contractAddress.address,
        smartContract.abi,
        provider.getSigner(0)
      );
  
      const web3 = new Web3(window.ethereum);
  
      var myContractInstance = new web3.eth.Contract(
        smartContract.abi as any,
        contractAddress.address
      );
  
      var toRet: Agreement[] = [];
      var res = await myContractInstance.methods
        .getAgreements()
        .call({ from: web3.utils.toChecksumAddress(accounts[0]) });

        for (let i = 0; i < res.length; i++) {
            const id = res[i];
            const resp = await myContractInstance.methods
              .getAgreementStatus(id)
              .call({ from: web3.utils.toChecksumAddress(accounts[0]) })
            toRet.push({ id: id, status: resp });
          }
        
          setArray(toRet);
    }
  
  
    return (
      <div style={{ overflow: "hidden" }}>
        <Grid
          pt={100}
          grow
          style={{ height: "100vh", overflowY: "hidden" }}
        >
          <Grid.Col span={4} />
          <Grid.Col span={4}>
            <Title size={20}>Your agreement statuses</Title>
            <Card
              mt={30}
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "2px solid #ccc",
              }}
            >
              <div>Agreement ID</div>
              <div
                style={{ borderRadius: "12px", padding: "4px 8px" }}
              >
                Status
              </div>
            </Card>
            <MyList values={array}></MyList>
          </Grid.Col>
          <Grid.Col span={4} />
        </Grid>
      </div>
    );
  }
  
  
  
  
  