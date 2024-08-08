'use client';
// ==============================|| Admin Profile ||============================== //

import { useState } from 'react';
import { Avatar, Box, FormControl, Grid, InputLabel, Paper, Tab, TextField, Typography } from '@mui/material';
import { TabsProps } from 'types';
import PageTitle from 'components/page-title/PageTitle';
import { tabsOption } from '../constant';
import { TabWrapper } from 'components/tab-wrapper/TabWrapper.styles';

export function TabPanel({ children, value, index, ...other }: TabsProps) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <div>{children}</div>}
    </div>
  );
}

const AdminProfile = () => {
  const [value, setValue] = useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`
    };
  }

  return (
    <>
      <PageTitle title="Admin Profile" />
      <Grid container spacing={2}>
        <Grid item xs={12} lg={2.41}>
          <Paper>
            <TabWrapper value={value} onChange={handleChange} orientation="vertical" variant="scrollable">
              {tabsOption.map((tab, index) => (
                <Tab
                  key={index}
                  label={
                    <Grid container direction="column">
                      <Typography variant="subtitle1" color="inherit">
                        {tab.label}
                      </Typography>
                    </Grid>
                  }
                  {...a11yProps(index)}
                />
              ))}
            </TabWrapper>
          </Paper>
        </Grid>
        <Grid item xs={12} lg={9.59}>
          <Paper sx={{ padding: '20px' }}>
            <Box>
              <TabPanel value={value} index={0}>
                {/* <UserProfile adminId={adminId!} isView={isView} /> */}
                <Grid container spacing={2.5}>
                  <Grid item xs={12}>
                    <Avatar></Avatar>
                    <Typography>Change profile picture</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>First name</InputLabel>
                      <TextField
                        // fullWidth
                        placeholder="First name"
                        // onChange={handleChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>First name</InputLabel>
                      <TextField
                        // fullWidth
                        placeholder="First name"
                        // onChange={handleChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>First name</InputLabel>
                      <TextField
                        fullWidth
                        placeholder="First name"
                        // onChange={handleChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>First name</InputLabel>
                      <TextField
                        // fullWidth
                        placeholder="First name"
                        // onChange={handleChange}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </TabPanel>
              <TabPanel value={value} index={1}>
                {/* <Security adminId={adminId!} /> */}
                <>Security</>
              </TabPanel>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default AdminProfile;
