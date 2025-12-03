import React from 'react';
import { Box, Typography, Tabs, Tab, useTheme } from '@mui/material';
import { CircleNotifications } from '@mui/icons-material';
import { Avatar } from 'agora-chat-uikit';

interface ConversationHeaderProps {
  currentUser: string;
  userName?: string;
  userImage?: string;
  isConnected: boolean;
  tabValue: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}

export const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  currentUser,
  userName,
  userImage,
  isConnected,
  tabValue,
  onTabChange,
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ padding: { xs: '14px', sm: '20px' } }}>
      <Box display="flex" alignItems="center" gap={1.5}>
        {userImage ? (
          <Avatar
            src={userImage}
            alt={userName || currentUser}
            style={{ width: 44, height: 44 }}
          />
        ) : (
          <Avatar
            style={{
              backgroundColor: theme.palette.primary.main,
              width: 44,
              height: 44,
              fontWeight: 600,
              fontSize: '18px',
            }}
          >
            {currentUser.charAt(0).toUpperCase()}
          </Avatar>
        )}
        <Box flex={1}>
          <Typography variant="h6" fontWeight={600}>
            {userName || currentUser}
          </Typography>
          <Box display="flex" alignItems="center" gap={0.5}>
            <CircleNotifications
              sx={{
                fontSize: 10,
                color: isConnected ? '#4caf50' : '#bdbdbd',
              }}
            />
            <Typography variant="caption" color="text.secondary">
              {isConnected ? 'Online' : 'Connecting...'}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Tabs value={tabValue} onChange={onTabChange} sx={{ mt: 2 }}>
        <Tab label="All" />
        <Tab label="Direct" />
        <Tab label="Groups" />
      </Tabs>
    </Box>
  );
};
