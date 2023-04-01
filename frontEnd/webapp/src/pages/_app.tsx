import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head';
import { MantineProvider, Title } from '@mantine/core';
import '../styles/globals.css'
import {
  createStyles,
  Header,
  Group,
  Button,
  Box,
  Burger,
  rem,
} from '@mantine/core';
import { MantineLogo } from '@mantine/ds';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';

const useStyles = createStyles((theme) => ({
  link: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontWeight: 500,
    fontSize: theme.fontSizes.sm,

    [theme.fn.smallerThan('sm')]: {
      height: rem(42),
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    },

    ...theme.fn.hover({
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    }),
  },

  subLink: {
    width: '100%',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    borderRadius: theme.radius.md,

    ...theme.fn.hover({
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
    }),

    '&:active': theme.activeStyles,
  },

  dropdownFooter: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
    margin: `calc(${theme.spacing.md} * -1)`,
    marginTop: theme.spacing.sm,
    padding: `${theme.spacing.md} calc(${theme.spacing.md} * 2)`,
    paddingBottom: theme.spacing.xl,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1]
    }`,
  },

  hiddenMobile: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  hiddenDesktop: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },
}));


export async function api(){

  
  if (window.ethereum) {
    var add;
    try {
      // Solicitar la cuenta del usuario de Metamask
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Obtener la dirección de la billetera del usuario
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      console.log(accounts[0]);
      add = accounts[0];
    } catch (error) {
      console.log(error);
    } finally{
      return add;
    }
  } else {
    console.log('Metamask no detectado');
  }
}

type HeaderMegaMenuProps = {
  label: string;
  fun: () => void;
};


export function HeaderMegaMenu( {label, fun }: HeaderMegaMenuProps) {
  const [drawerOpened, { toggle: toggleDrawer }] = useDisclosure(false);
  const { classes } = useStyles();

  return (
    <div style={{ position: "fixed", top: 0, width: "100%", zIndex: 1 }}>
      <Box pb={0}>
      <Header height={60} px="md">
        <Group position="apart" sx={{ height: '100%' }}>
          <MantineLogo size={30} />

          <Group className={classes.hiddenMobile}>
            <Button onClick={fun} >
              {label}
            </Button>
          </Group>

          <Burger opened={drawerOpened} onClick={toggleDrawer} className={classes.hiddenDesktop} />
        </Group>
      </Header>
    </Box>
    </div>
  );
}
import { useLocalStorage } from '@mantine/hooks';



export default function App({ Component, pageProps }: AppProps) {

  const [address, setAddress] = useLocalStorage<string>({
    key: "address",
    defaultValue: "Connect Wallet"
  }) 

  async function apiManager() {
    const add = await api();
    setAddress(add);
  }

  return (
    <>
      <Head>
        <title>Trust Chain</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <HeaderMegaMenu label={address} fun={apiManager} />
      <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: "light" }}>
        <Component {...pageProps} />
      </MantineProvider>
    </>
  );
}