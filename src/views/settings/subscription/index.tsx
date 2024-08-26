import { Box, Divider, FormControlLabel, Radio, Typography } from '@mui/material'
import React from 'react'
import MainCard from 'ui-component/cards/MainCard'

export default function Subscription() {
  return (
    <MainCard>
      <Typography variant="h2">Subscription settings</Typography>
      <Divider sx={{ my: 3 }} />
      <Typography variant="h3">Payment details</Typography>
      <Box>
        <FormControlLabel value="female" control={<Radio />} label="Female" />
      </Box>
    </MainCard>
  );
}
