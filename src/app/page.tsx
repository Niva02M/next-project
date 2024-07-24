// project import
import MinimalLayout from 'layout/MinimalLayout';
import AppBar from 'ui-component/extended/AppBar';
import Homepage from 'views/home';

// ==============================|| HOME PAGE ||============================== //

export default function HomePage() {
  return (
    <MinimalLayout>
      <AppBar />
      <Homepage />
    </MinimalLayout>
  );
}
