import { Vendors } from '@/api/types';
import Map from '../map';
import { useEffect, useState } from 'react';
import Dashboard from '../dashboard';
import styled from 'styled-components';

interface MainProps {
  initVendors: Vendors;
}

const MainStyled = styled.main`
  display: flex;
`;

export default function Main({ initVendors }: MainProps) {
  const [vendors, setVendors] = useState(initVendors);
  const [markers, setMarkers] = useState<{
    [key: string]: google.maps.Marker;
  }>({});

  return (
    <MainStyled>
      <Dashboard vendors={vendors} setVendors={setVendors} />
      <Map
        markers={markers}
        setMarkers={setMarkers}
        vendors={vendors}
      />
    </MainStyled>
  );
}
