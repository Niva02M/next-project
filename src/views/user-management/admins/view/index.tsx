import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
// material-ui
import { Box, Grid, Tab, Tabs, Typography } from '@mui/material';
import PersonOutlineTwoToneIcon from '@mui/icons-material/PersonOutlineTwoTone';
import VpnKeyTwoToneIcon from '@mui/icons-material/VpnKeyTwoTone';

// project imports
import UserProfile from './AdminProfile';
import Security from './Security';
import TabPanel from 'components/tabpanel/TabPanel';
import MainCard from 'ui-component/cards/MainCard';

// assets
import { gridSpacing } from 'store/constant';

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

// tabs option
const tabsOption = [
    {
        label: 'User Profile',
        icon: <PersonOutlineTwoToneIcon />
    },
    {
        label: 'Password Settings',
        icon: <VpnKeyTwoToneIcon />
    }
];

// ==============================|| Admin Profile ||============================== //

const AdminProfile = () => {
    const { id: adminId } = useParams();
    const locationUrl = useLocation();
    const isView = locationUrl.pathname.includes('/admin/view');
    const [value, setValue] = React.useState<number>(0);

    const filteredTabsOption = isView ? tabsOption.filter((tab) => tab.label !== 'Password Settings') : tabsOption;

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <MainCard title="Admin user profile" className="user-setting">
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12} lg={2.78} display={'flex'}>
                    <Tabs className="profile-tab" value={value} onChange={handleChange} orientation="vertical" variant="scrollable">
                        {filteredTabsOption.map((tab, index) => (
                            <Tab
                                key={index}
                                icon={tab.icon}
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
                    </Tabs>
                </Grid>
                <Grid item xs={12} lg={8.55}>
                    <Box>
                        <TabPanel value={value} index={0}>
                            <UserProfile adminId={adminId!} isView={isView} />
                        </TabPanel>
                        {!isView && (
                            <TabPanel value={value} index={1}>
                                <Security adminId={adminId!} />
                            </TabPanel>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default AdminProfile;
