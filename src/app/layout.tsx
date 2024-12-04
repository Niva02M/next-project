import type { Metadata } from 'next';

import './globals.css';

// PROJECT IMPORTS
import ProviderWrapper from 'store/ProviderWrapper';

if (process.env.NEXT_ENV === 'production') {
  console.log = () => {}; // Disable console.log in production
}

export const metadata: Metadata = {
  title: 'Ebtheme web',
  description:
    'Start your next project with Ebtheme template. It build with Reactjs, Material-UI, Redux, and Hook for faster web development.'
};

// ==============================|| ROOT LAYOUT ||============================== //

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ProviderWrapper>{children}</ProviderWrapper>
      </body>
    </html>
  );
}
