'use client';
// ==============================|| Admin Profile ||============================== //

import { useEffect, useState } from 'react';
import { Box, CircularProgress, Grid, Paper, Tab, Typography } from '@mui/material';
import { TabsProps } from 'types';
import PageTitle from 'components/page-title/PageTitle';
import { tabsOption } from '../constant';
import { TabWrapper } from 'components/tab-wrapper/TabWrapper.styles';
import UserProfile from './UserProfile';
import ChangePassword from './ChangePassword';
import BankSetupPage from '../components/business-management/bankSetup';
import { useRouter, usePathname } from 'next/navigation';
import AlignCenter from 'components/align-center/AlignCenter';

export function TabPanel({ children, value, index, ...other }: TabsProps) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <div>{children}</div>}
    </div>
  );
}

const AdminProfile = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`
    };
  }

  // Sync tab state with URL
  useEffect(() => {
    const currentTab = tabsOption.findIndex((tab) => tab.url === pathname);
    if (currentTab !== -1) {
      setValue(currentTab);
      setLoading(false);
    }
  }, [pathname]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setLoading(true);
    setValue(newValue);
    router.push(tabsOption[newValue].url);
  };

  {
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
              {loading ? (
                <AlignCenter>
                  <CircularProgress />
                </AlignCenter>
              ) : (
                <Box>
                  <TabPanel value={value} index={0}>
                    <UserProfile />
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    <ChangePassword />
                  </TabPanel>
                  <TabPanel value={value} index={2}>
                    <BankSetupPage />
                  </TabPanel>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </>
    );
  }
};

export default AdminProfile;
