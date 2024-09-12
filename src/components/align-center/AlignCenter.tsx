import { Stack } from '@mui/material';
import { ReactNode } from 'react';

interface AlignCenterProps {
  children: ReactNode;
}

export default function AlignCenter({ children }: AlignCenterProps) {
  return (
    <Stack justifyContent="center" alignItems="center" minHeight={250} height="100%" width="100%">
      {children}
    </Stack>
  );
}
