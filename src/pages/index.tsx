import { Vendors } from '@/api/types';
import { getVendors } from '@/api/vendors';
import Main from '@/components/main';
import Head from 'next/head';

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
    vendors = await getVendors<Vendors>(10);
  } catch (e) {
    if (e instanceof Error) {
      // Return empty vendors
      vendors = { Items: [], count: 0, lastEvaluatedKey: null };
    } else {
      throw new Error('getVendors unexpected Error');
    }
  }

  return {
    props: {
      initVendors: vendors,
    },
    revalidate: 60, // revalidate the cache
  };
}
