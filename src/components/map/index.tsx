import { Vendors } from '@/api/types';
import { Status, Wrapper } from '@googlemaps/react-wrapper';
import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import mapStyle from './style';
import { useDeepCompareVendorTweets } from './hooks';

const MapContainer = styled.div`
  height: 100%;
  width: 100%;
  position: fixed;
`;

interface MapProps extends google.maps.MapOptions {
  style?: { [key: string]: string };
  vendors: Vendors;
  markers: { [key: string]: google.maps.Marker };
  setMarkers: React.Dispatch<
    React.SetStateAction<{ [key: string]: google.maps.Marker }>
  >;
}

const Map: React.FC<MapProps> = ({
  style,
  vendors,
  markers,
  setMarkers,
  ...options
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();

  console.log('Map', vendors);

  useEffect(() => {
    if (ref.current && !map) {
      setMap(
        new window.google.maps.Map(ref.current, {
          ...options,
        })
      );
    }
  }, [ref, map, options]);

  useEffect(() => {
    if (map) {
      vendors.Items.forEach((vendor) => {
        if (vendor.tweets.length) {
          const newLat =
            vendor.tweets[vendor.tweets.length - 1].geo.coordinates
              .lat;
          const newLong =
            vendor.tweets[vendor.tweets.length - 1].geo.coordinates
              .long;

          if (markers[vendor.twitterId]) {
            // Update an existing marker
            if (
              markers[vendor.twitterId]?.getPosition()?.lat() !==
                newLat &&
              markers[vendor.twitterId]?.getPosition()?.lng() !==
                newLong
            ) {
              markers[vendor.twitterId].setPosition({
                lat: newLat,
                lng: newLong,
              });
            }
          } else {
            // Create a new marker if no marker exists
            const marker = new google.maps.Marker({
              position: { lat: newLat, lng: newLong },
              title: vendor.twitterId,
              map,
            });

            setMarkers((prev) => {
              return {
                ...prev,
                [vendor.twitterId]: marker,
              };
            });
          }
        }
      });
    }
  }, [map, useDeepCompareVendorTweets(vendors.Items)]);

  return <div ref={ref} style={style} />;
};

interface MapWrapperProps {
  vendors: Vendors;
  markers: { [key: string]: google.maps.Marker };
  setMarkers: React.Dispatch<
    React.SetStateAction<{ [key: string]: google.maps.Marker }>
  >;
}

export default function MapWrapper({
  vendors,
  markers,
  setMarkers,
}: MapWrapperProps) {
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
                  vendors={vendors}
                  markers={markers}
                  setMarkers={setMarkers}
                />
              </MapContainer>
            );
        }
      }}
    />
  );
}
