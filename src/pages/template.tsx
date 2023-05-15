import type { ReactElement } from 'react';
import Layout from '../components/layout';
// import NestedLayout from '../components/nested-layout';
import type { NextPageWithLayout } from './_app';
 
const Dashboard: NextPageWithLayout = () => {
  return <p>Template Page</p>;
};
 
Dashboard.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      {page}
    </Layout>
  );
};
 
export default Dashboard;