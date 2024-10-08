import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import { PayoutDetailWrapper } from './Payout.styles';

export default function PayoutCard({ detail }: { detail: any }) {
  return (
    <Stack>
      <Typography variant="h3" mb={2}>
        Payout details
      </Typography>
      <Box sx={{ overflowX: 'auto' }}>
        <PayoutDetailWrapper>
          <Stack
            flexDirection="row"
            flex={1}
            alignItems="center"
            sx={{
              '.MuiTypography-root': {
                flex: 1
              }
            }}
          >
            <Typography>{detail?.bankDetail?.accountName}</Typography>
            <Typography>Acc no: {detail?.bankDetail?.accountNumber}</Typography>
            <Typography>BSB: {detail?.bankDetail?.routingNumber}</Typography>
            <Typography>
              Status:
              <Chip
                label={detail?.status === null ? 'Inactive' : detail?.status}
                color={detail?.status !== 'Active' && detail?.status !== null ? 'success' : 'error'}
                size="small"
              />
            </Typography>
          </Stack>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => {
              // setOpenModalDeleteCard(true);
            }}
          >
            Remove
          </Button>
        </PayoutDetailWrapper>
      </Box>
    </Stack>
  );
}
