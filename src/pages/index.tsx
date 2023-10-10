import { Vendors, Vendor } from '@/api/types';
import { getVendors } from '@/api/vendors';
import Main from '@/components/main';
import Head from 'next/head';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import type { AttributeValue } from '@aws-sdk/client-dynamodb';

import { random } from 'lodash';

interface HomeProps {
  initVendors: Vendors;
}

export default function Home({ initVendors }: HomeProps) {
  return (
    <>
      <Head>
        <title>Location Tracking System</title>
        <meta
          name="description"
          content="Realtime location tracking system"
        />
        <link rel="icon" href="/public/favicon.ico" sizes="any" />
      </Head>
      <Main initVendors={initVendors} />
    </>
  );
}

export async function getStaticProps() {
  let vendors: Vendors | Error;

  try {
    vendors = await getVendors<Vendors>(14);
  } catch (e) {
    if (e instanceof Error) {
      // Return empty vendors
      vendors = { Items: [], count: 0, lastEvaluatedKey: null };
    } else {
      throw new Error('getVendors unexpected Error');
    }
  }

  vendors.Items = vendors.Items?.map((item, idx) => {
    const res = unmarshall(item as Vendor);
    if (idx % 3 === 0) {
      res.tweets = [
        {
          date: res.updated + '',
          geo: {
            coordinates: {
              lat: 38.8952123 + idx * random(idx / 5),
              long: -77.074949 + idx * random(idx / 5),
            },
            country: 'USA',
            country_code: 'USA',
            full_name: 'USA',
            id: 'USA',
            name: 'USA',
            place_type: 'country',
          },
          id: '231321',
          text: 'string',
          userId: res.twitterId,
          userName: res.name,
        },
      ];
    }
    return res as Vendor;
  });
  vendors.lastEvaluatedKey = vendors.lastEvaluatedKey
    ? (unmarshall(
        vendors.lastEvaluatedKey as unknown as Record<
          string,
          AttributeValue
        >
      ) as unknown as string)
    : null;

  return {
    props: {
      initVendors: vendors,
    },
    revalidate: 60, // revalidate the cache
  };
}
