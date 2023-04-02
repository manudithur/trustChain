import { createStyles, Container, Title, Text, Button, rem } from '@mantine/core';
import React from 'react';

const useStyles = createStyles((theme) => ({
  root: {
    backgroundSize: 'cover',
    paddingTop: `calc(${theme.spacing.xl} * 3)`,
    paddingBottom: `calc(${theme.spacing.xl} * 3)`,

  },

  inner: {
    display: 'flex',
    justifyContent: 'space-between',

    [theme.fn.smallerThan('md')]: {
      flexDirection: 'column',
    },
  },

  image: {
    [theme.fn.smallerThan('md')]: {
      display: 'none',
    },
  },

  content: {
    paddingTop: `calc(${theme.spacing.xl} * 2)`,
    paddingBottom: `calc(${theme.spacing.xl} * 2)`,
    marginRight: `calc(${theme.spacing.xl} * 3)`,

    [theme.fn.smallerThan('md')]: {
      marginRight: 0,
    },
  },

  title: {
    color: theme.white,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 900,
    lineHeight: 1.05,
    maxWidth: rem(500),
    fontSize: rem(48),

    [theme.fn.smallerThan('md')]: {
      maxWidth: '100%',
      fontSize: rem(34),
      lineHeight: 1.15,
    },
  },

  title2: {
    fontSize: rem(34),
    fontWeight: 900,

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(24),
    },
  },

  description: {
    color: theme.white,
    opacity: 0.75,
    maxWidth: rem(500),

    [theme.fn.smallerThan('md')]: {
      maxWidth: '100%',
    },
  },

  control: {
    paddingLeft: rem(50),
    paddingRight: rem(50),
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: rem(22),

    [theme.fn.smallerThan('md')]: {
      width: '100%',
    },
  },

  card: {
    border: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1]
    }`,
  },

  cardTitle: {
    '&::after': {
      content: '""',
      display: 'block',
      backgroundColor: theme.fn.primaryColor(),
      width: rem(45),
      height: rem(2),
      marginTop: theme.spacing.sm,
    },
  },

  input: {
    height: rem(54),
    paddingTop: rem(18),
  },

  label: {
    position: 'absolute',
    pointerEvents: 'none',
    fontSize: theme.fontSizes.xs,
    paddingLeft: theme.spacing.sm,
    paddingTop: `calc(${theme.spacing.sm} / 2)`,
    zIndex: 1,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
  },
  wrapper: {
    position: 'relative',
    marginBottom: rem(30),
  },

  dropzone: {
    borderWidth: rem(1),
    paddingBottom: rem(50),
  },

  icon: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4],
  },

  control2: {
    position: 'absolute',
    width: rem(250),
    left: `calc(50% - ${rem(125)})`,
    bottom: rem(-20),
  },
}));

export function HeroImageRight() {
  

  const { classes } = useStyles();
  return (
    <div className={classes.root} style={{ display: "flex", flexDirection: "column" }}>
      <Container style={{ flex: 1 }}>
        <div className={classes.inner}>
          <div className={classes.content}>
            <DropzoneButton></DropzoneButton>
          </div>
        </div>
      </Container>
    </div>
  );
}

import { TextInput } from '@mantine/core';




import { useRef } from 'react';
import { Group} from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import { IconCloudUpload, IconX, IconDownload } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useSessionStorage } from '@mantine/hooks';
import {useState} from 'react';
import smartContract from '../smartContract/AgreementContract.json';
import contractAddress from '../smartContract/conctractAddress.json';
import { ethers } from 'ethers';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils'


export function DropzoneButton() {

  const { classes, theme } = useStyles();
	const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);

	const changeHandler = (event : any) => {
		setSelectedFile(event);
		setIsFilePicked(true);
	};
  const openRef = useRef<() => void>(null);
  const [buyerAddres, setBuyerAddres] =useState("");
  const [agreementAmount, setAgreementAmount] = useState("0");
  
  const router = useRouter();
  

  async function  createAgreement(){
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

    var aux = await myContractInstance.methods.createAgreement(ethers.utils.parseEther(agreementAmount)).send({
           from: web3.utils.toChecksumAddress(accounts[0]), 
           gas: 0x00, 
           gasPrice: 0x00
        })

  }




  return (
    <div style={{alignContent: 'center', height: "100vh"}}>
    <TextInput mx={100} label="Buyer Wallet" placeholder={buyerAddres} onChange={(e: React.FormEvent<HTMLInputElement>) =>{setBuyerAddres(e.currentTarget.value)}} labelProps={{ style: { color: 'Black' } }}/>
    <TextInput mx={100} mt={'sm'} label="Agreement Amount" placeholder="0" onChange={(e: React.FormEvent<HTMLInputElement>) =>{setAgreementAmount(e.currentTarget.value)}} rightSection={<TextInput variant="unstyled" size="xs" value="ETH" readOnly />} labelProps={{ style: { color: 'black' } }}/>   
    <div className={classes.wrapper} style={{marginLeft: 300, marginRight: 300, marginTop: 50}}>
      <Dropzone
        openRef={openRef}
        onDrop={changeHandler}
        className={classes.dropzone}
        radius="md"
        accept={[MIME_TYPES.pdf]}
        maxSize={30 * 1024 ** 2}
      >
        <div style={{ pointerEvents: 'none' }}>
          <Group position="center">
            <Dropzone.Accept>
              <IconDownload
                size={rem(50)}
                color={theme.colors[theme.primaryColor][6]}
                stroke={1.5}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX size={rem(50)} color={theme.colors.red[6]} stroke={1.5} />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconCloudUpload
                size={rem(50)}
                color={theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black}
                stroke={1.5}
              />
            </Dropzone.Idle>
          </Group>

          <Text ta="center" fw={700} fz="lg" mt="xl">
            <Dropzone.Accept>Drop Agreement Here</Dropzone.Accept>
            <Dropzone.Reject>Pdf file less than 30mb</Dropzone.Reject>
            <Dropzone.Idle>Upload Agreement File</Dropzone.Idle>
          </Text>
          <Text ta="center" fz="sm" mt="xs" c="dimmed">
            Drag&apos;n&apos;drop files here to upload. We can accept only <i>.pdf</i> files that
            are less than 30mb in size.
          </Text>
          <Button className={classes.control2} variant="gradient" gradient={{ from: 'pink', to: 'yellow' }} size="sm" radius="md" onClick={() => openRef.current?.()}>
        Select files
      </Button>
        </div>
       
      </Dropzone>

     
      <Button
              variant="gradient"
              gradient={{ from: 'pink', to: 'yellow' }}
              size="xl"
              ml={43}
              className={classes.control}
              onClick={createAgreement}
              mt={60}
            >
              Create Agreement
      </Button>
    </div>
    </div>

  );
}

export default function CreateAgreement(){
    return (
    <div>
        <HeroImageRight></HeroImageRight>
    </div>
    )
}