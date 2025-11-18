import React, { useState } from 'react';
import { Box, IconButton, Menu, MenuItem, Typography, useTheme } from '@mui/material';
import { MoreVert, Delete } from '@mui/icons-material';
import { Avatar, rootStore } from 'agora-chat-uikit';
import useSuccErrSnack from 'hooks/useSuccErrSnack';
import { DELETE_CHAT, DELETE_CHAT_FAILED } from 'components/authentication/constants';

type UserProfile = {
  nickname: string;
  avatarurl: string;
};

interface CustomChatHeaderProps {
  conversationId: string;
  getUserProfileFromMap: (username: string) => UserProfile;
  onDelete?: () => void;
  openSidebar?: () => void;
}

export default function CustomChatHeader({ conversationId, getUserProfileFromMap, onDelete, openSidebar }: CustomChatHeaderProps) {
  const theme = useTheme();
  const { errorSnack, successSnack } = useSuccErrSnack();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const userProfile = getUserProfileFromMap(conversationId);

  const displayName = userProfile?.nickname || conversationId || 'Unknown User';
  const avatarUrl = userProfile?.avatarurl || '';

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    try {
      await rootStore.client.deleteConversation({
        channel: conversationId,
        chatType: 'singleChat',
        deleteMessages: true,
        deleteRoam: true
      });

      rootStore.conversationStore.deleteConversation({
        conversationId,
        chatType: 'singleChat'
      });

      successSnack(DELETE_CHAT);
      handleClose();
      onDelete?.();
    } catch (e) {
      console.log('delete error', e);
      errorSnack(DELETE_CHAT_FAILED);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px 20px',
        bgcolor: theme.palette.mode === 'dark' ? theme.palette.dark?.dark : '#fff',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.12)'
      }}
      // style={{ backgroundColor: '#1C1F26' }}
    >
      {avatarUrl ? (
        <Avatar src={avatarUrl} alt={displayName} style={{ width: 40, height: 40 }} />
      ) : (
        <Avatar
          style={{
            backgroundColor: theme.palette.primary.main,
            width: 40,
            height: 40,
            fontSize: '16px',
            fontWeight: 600
          }}
        >
          {displayName.charAt(0).toUpperCase()}
        </Avatar>
      )}

      <Box flex={1} ml={2}>
        <Typography variant="h6" fontWeight={600}>
          {displayName}
        </Typography>
      </Box>

      <IconButton onClick={handleClick} size="small" sx={{ ml: 1 }}>
        <MoreVert />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main', gap: 1 }}>
          <Delete fontSize="small" />
          Delete Conversation
        </MenuItem>
      </Menu>
      <Box onClick={openSidebar} sx={{ cursor: 'pointer', display: { xs: 'block', sm: 'none' }, ml: 1 }}>
        <Typography variant="body2">Chats</Typography>
      </Box>
    </Box>
  );
}
