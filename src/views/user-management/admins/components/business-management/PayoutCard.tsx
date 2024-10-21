import { Button, Chip, Stack, Typography } from '@mui/material';
import { PayoutDetailWrapper } from './Payout.styles';

export default function PayoutCard({ detail }: { detail: any }) {
  return (
    <>
      <Stack>
        <Typography variant="h3" mb={2}>
          Payout details
        </Typography>
        <Stack sx={{ overflowX: 'auto' }}>
          <PayoutDetailWrapper key={detail?.accountId}>
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
              <Typography>{detail?.accountId}</Typography>
              <Typography>{detail?.accountStatus}</Typography>
              <Typography>Type: {detail?.accountType}</Typography>
              <Typography>
                Status:
                <Chip
                  label={detail?.verificationStatus}
                  // color={detail?.status !== 'Active' && detail?.status !== null ? 'success' : 'error'}
                  color={'success'}
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
          {detail?.map((bankDetail: any) => (
            <PayoutDetailWrapper key={bankDetail?.id}>
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
                <Typography>{bankDetail?.account_holder_name}</Typography>
                <Typography>Acc no: *****{bankDetail?.last4}</Typography>
                <Typography>BSB: {bankDetail?.routing_number}</Typography>
                <Typography>
                  Status:
                  <Chip
                    label={bankDetail?.status}
                    // color={detail?.status !== 'Active' && detail?.status !== null ? 'success' : 'error'}
                    color={'success'}
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
          ))}
        </Stack>
      </Stack>
      <Button variant="text" sx={{ p: 0, mt: 2 }}>
        Add payout details
      </Button>
    </>
  );
}
