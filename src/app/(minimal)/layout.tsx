// PROJECT IMPORTS
import MinimalLayout from 'layout/MinimalLayout';
import AuthGuard from 'utils/route-guard/AuthGuard';

// ================================|| SIMPLE LAYOUT ||================================ //

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <MinimalLayout>{children}</MinimalLayout>
    </AuthGuard>
  );
}
