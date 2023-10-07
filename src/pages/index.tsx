import Main from '@/components/main';
import Head from 'next/head';
export default function Home() {
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
      <p>Test</p>
      <Main />
    </>
  );
}
