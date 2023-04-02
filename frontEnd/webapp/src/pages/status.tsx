import { Badge, Card, Divider, Grid, List, Title, createStyles } from "@mantine/core";
import { title } from "process";

type ListItemProps = {
    title: string,
    colorNum: number
}

type statusVar = {
    id: string,
    status: number
}

type statusArray = {
    values: Array<statusVar>
}

function ListItem({ title, colorNum }: ListItemProps) {
    //0 No status
    //1 Salio
    //2 Llego
    //3 Recibio
    var color = 'white';
    var label = 'no status'
    switch(colorNum){
        case 1: {
            color = 'yellow'
            label = 'Shipped'
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
  
  function MyList({ values }: { values: Array<statusVar> }) {
    return (
      <List>
        {values.map((item) => (
          <ListItem key={item.id} title={item.id} colorNum={item.status}/>
        ))}
      </List>
    );
  }
  

export default function status() {
    const s1: statusVar = { id: "1234", status: 0 };
    const s2: statusVar = { id: "12345", status: 1 };
    const s3: statusVar = { id: "12345", status: 1 };
    const s4: statusVar = { id: "12345", status: 1 };
    const s5: statusVar = { id: "12345", status: 1 };
    const array: Array<statusVar> = [s1, s2, s3, s4, s5];
    return (
      <div style={{overflow : 'hidden'}}>
        <Grid pt={100} grow style={{height: '100vh', overflowY: "hidden"}}>
            <Grid.Col span={4}/>
            <Grid.Col span={4}>
                <Title size={20}>Your agreement statuses</Title>
                <Card mt={30} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #ccc'}}>
                    <div>Agreement ID</div>
                    <div style={{ borderRadius: '12px', padding: '4px 8px' }}>Status</div>
                </Card>
                <MyList values={array} />
            </Grid.Col>
            <Grid.Col span={4}/>
        </Grid>
      </div>
    );
  }