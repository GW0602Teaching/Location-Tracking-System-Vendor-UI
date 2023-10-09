import { Vendors } from '@/api/types';
import Map from '../map';
import { useEffect, useState } from 'react';

interface MainProps {
  initVendors: Vendors;
}

export default function Main({ initVendors }: MainProps) {
  const [vendors, setVendors] = useState(initVendors);
  const [markers, setMarkers] = useState<{
    [key: string]: google.maps.Marker;
  }>({});

  return (
    <Map
      markers={markers}
      setMarkers={setMarkers}
      vendors={vendors}
    />
  );
}
