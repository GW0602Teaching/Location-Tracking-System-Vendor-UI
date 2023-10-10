import { Vendor, Vendors } from '@/api/types';
import { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import Tile from './tile';
import { unmarshall } from '@aws-sdk/util-dynamodb';

interface DashboardProps {
  vendors: Vendors;
  setVendors: Dispatch<SetStateAction<Vendors>>;
}

const DashboardStyled = styled.div`
  width: 400px;
  overflow: auto;
  z-index: 2;
  background-color: white;
`;

export default function Dashboard({
  vendors,
  setVendors,
}: DashboardProps) {
  const item = vendors.Items[0];

  return (
    <DashboardStyled>
      <Tile
        imgUrl={item.image}
        name={item.name}
        geo={item.tweets[0].geo}
      />
    </DashboardStyled>
  );
}
