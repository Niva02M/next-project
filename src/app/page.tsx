// project import
import MinimalLayout from 'layout/MinimalLayout';
import Login from 'views/authentication/login';

// ==============================|| HOME PAGE ||============================== //

export default function HomePage() {
  return (
    <MinimalLayout>
      <Login />
    </MinimalLayout>
  );
}
