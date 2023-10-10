import { Vendor, Vendors } from '@/api/types';
import { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import Tile from './tile';
import Loader from './loader';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getVendors } from '@/api/vendors';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import type { AttributeValue } from '@aws-sdk/client-dynamodb';
import _ from 'lodash';

interface DashboardProps {
  vendors: Vendors;
  setVendors: Dispatch<SetStateAction<Vendors>>;
}

const DashboardStyled = styled.div`
  width: 300px;
  height: 800px;
  overflow: auto;
  z-index: 2;
  background-color: white;
`;

export default function Dashboard({
  vendors,
  setVendors,
}: DashboardProps) {
  const next = async () => {
    try {
      // create a tmp vendors state, gonna be override by the api
      console.log('next');
      const updatedVendors: Vendors = {
        Items: [...vendors.Items],
        count: 0,
        lastEvaluatedKey: null,
      };

      const res = (await getVendors<Vendors | Error>(
        1,
        vendors.lastEvaluatedKey ?? undefined
      )) as Vendors;

      res.Items = res.Items.map((item) => unmarshall(item) as Vendor);
      res.Items.forEach((newVendor: Vendor) => {
        updatedVendors.Items.push(newVendor);
      });
      res.lastEvaluatedKey = res.lastEvaluatedKey
        ? (unmarshall(
            res.lastEvaluatedKey as unknown as Record<
              string,
              AttributeValue
            >
          ) as unknown as string)
        : null;

      updatedVendors.count = vendors.count + res.count;
      updatedVendors.lastEvaluatedKey = res.lastEvaluatedKey;
      console.log('next', updatedVendors);
      setVendors(updatedVendors);
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
      } else {
        throw new Error('getVendors unexpected error');
      }
    }
  };
  console.log(vendors);

  return (
    <DashboardStyled id="scrollableDiv">
      <InfiniteScroll
        dataLength={vendors.Items.length}
        next={next}
        hasMore={!!vendors.lastEvaluatedKey}
        scrollableTarget="scrollableDiv"
        loader={<Loader />}
      >
        {vendors.Items.map((vendor) => (
          <Tile
            key={vendor.twitterId}
            imgUrl={vendor.image}
            name={vendor.name}
            geo={vendor.tweets[vendor.tweets.length - 1]?.geo}
          />
        ))}
      </InfiniteScroll>
    </DashboardStyled>
  );
}
