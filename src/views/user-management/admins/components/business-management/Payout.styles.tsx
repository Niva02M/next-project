import { Stack, styled } from '@mui/material';

export const PayoutDetailWrapper = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '8px',
  padding: '16px',
  gap: 20,
  minWidth: 640,
  minHeight: 74,
  marginBottom: 20,
  '.MuiFormControlLabel-root': {
    flex: 1,
    margin: 0,
    '.MuiStack-root': {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 20,
      '>:not(style)~:not(style)': {
        marginTop: 0
      }
    }
  }
}));
