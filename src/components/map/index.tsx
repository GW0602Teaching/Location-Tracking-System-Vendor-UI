import { Vendors } from '@/api/types';
import { Status, Wrapper } from '@googlemaps/react-wrapper';
import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import mapStyle from './style';

const MapContainer = styled.div`
  height: 100%;
  width: 100%;
  position: fixed;
`;

interface MapProps extends google.maps.MapOptions {
  style?: { [key: string]: string };
  // vendors: Vendors;
  // markers: { [key: string]: google.maps.Marker };
  // setMarkers?: React.Dispatch<
  //   React.SetStateAction<{ [key: string]: google.maps.Marker }>
  // >;
}

const Map: React.FC<MapProps> = ({
  style,
  // vendors,
  // markers,
  // setMarkers,
  ...options
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();

  useEffect(() => {
    if (ref.current && !map) {
      setMap(
        new window.google.maps.Map(ref.current, {
          ...options,
        })
      );
    }
  }, [ref, map, options]);

  return <div ref={ref} style={style} />;
};

export default function MapWrapper() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';
  return (
    <Wrapper
      apiKey={apiKey}
      render={(status: Status) => {
        console.log(status);
        switch (status) {
          case Status.LOADING:
            return <p>loading</p>;
          case Status.FAILURE:
            return <p>failed</p>;
          case Status.SUCCESS:
            return (
              <MapContainer>
                <Map
                  styles={mapStyle}
                  style={{ height: '100%', position: 'static' }}
                  zoom={13}
                  center={{
                    // DC
                    lat: 38.9072,
                    lng: -77.036,
                  }}
                  disableDefaultUI
                />
              </MapContainer>
            );
        }
      }}
    />
  );
}
