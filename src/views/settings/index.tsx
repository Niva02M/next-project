'use client';
import { Box, CircularProgress, Grid, Paper, Tab, Typography } from '@mui/material';
import PageTitle from 'components/page-title/PageTitle';
import { TabWrapper } from 'components/tab-wrapper/TabWrapper.styles';
import React, { useEffect, useState } from 'react';
import { TabPanel } from 'views/user-management/admins/view';
import EditSettings from './EditSettings';
import { settingsTabOption } from './constant';
import Payment from './payment';
import { usePathname, useRouter } from 'next/navigation';
import AlignCenter from 'components/align-center/AlignCenter';

export default function Settings() {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Sync tab state with URL
  useEffect(() => {
    const currentTab = settingsTabOption.findIndex((tab) => tab.url === pathname);
    if (currentTab !== -1) {
      setValue(currentTab);
      setLoading(false);
    }
  }, [pathname]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setLoading(true);
    setValue(newValue);
    router.push(settingsTabOption[newValue].url);
  };

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`
    };
  }
  return (
    <>
      <PageTitle title="Settings" />
      <Grid container spacing={2}>
        <Grid item xs={12} lg={2.36}>
          <Paper>
            <TabWrapper value={value} onChange={handleChange} orientation="vertical" variant="scrollable">
              {settingsTabOption.map((tab, index) => (
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
          <Paper>
            {loading ? (
              <AlignCenter>
                <CircularProgress />
              </AlignCenter>
            ) : (
              <Box>
                <TabPanel value={value} index={0}>
                  <EditSettings />
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <Payment />
                </TabPanel>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
