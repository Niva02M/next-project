'use client';
// ==============================|| Admin Profile ||============================== //

import { useEffect, useState } from 'react';
import { Box, Grid, Paper, Tab, Typography } from '@mui/material';
import { TabsProps } from 'types';
import PageTitle from 'components/page-title/PageTitle';
import { tabsOption } from '../constant';
import { TabWrapper } from 'components/tab-wrapper/TabWrapper.styles';
import UserProfile from './UserProfile';
import ChangePassword from './ChangePassword';
import { useQuery } from '@apollo/client';
import { GET_PROFILE_QUERY } from '../graphql/queries';
import { useSession } from 'next-auth/react';

export function TabPanel({ children, value, index, ...other }: TabsProps) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <div>{children}</div>}
    </div>
  );
}

const AdminProfile = () => {
  const [value, setValue] = useState<number>(0);

  const { data, loading } = useQuery(GET_PROFILE_QUERY);
  // const session = useSession();

  // useEffect(() => {
  //   console.log('data ====>', data);
  //   console.log('session ====>', session);
  // })

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
      <PageTitle title="Account settings" />
      <Grid container spacing={2}>
        <Grid item xs={12} lg={2.36}>
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
        <Grid item xs={12} lg={9.64}>
          <Paper sx={{ padding: '20px' }}>
            <Box>
              <TabPanel value={value} index={0}>
                <UserProfile userData={data} loading={loading} />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <ChangePassword />
              </TabPanel>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default AdminProfile;
