import { Container, Grid, Button, rem, createStyles, Title } from "@mantine/core";
import { SrvRecord } from "dns";
import { useRouter } from "next/router";
import { useState } from "react";

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