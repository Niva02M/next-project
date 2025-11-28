import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  Typography,
  useTheme,
} from '@mui/material';
import { MoreVert, Delete, Phone } from '@mui/icons-material';
import { Avatar, rootStore } from 'agora-chat-uikit';
import useSuccErrSnack from 'hooks/useSuccErrSnack';
import {
  DELETE_CHAT,
  DELETE_CHAT_FAILED,
} from 'components/authentication/constants';
import SimpleVoiceCall from './SimpleVoiceCall';

type UserProfile = {
  nickname: string;
  avatarurl: string;
};

interface CustomChatHeaderProps {
  conversationId: string;
  getUserProfileFromMap: (username: string) => UserProfile;
  currentUserId: string;
  currentUserName: string;
  currentUserAvatar?: string;
  onDelete?: () => void;
  openSidebar?: () => void;
}

export default function CustomChatHeader({
  conversationId,
  getUserProfileFromMap,
  currentUserId,
  currentUserName,
  currentUserAvatar,
  onDelete,
}: CustomChatHeaderProps) {
  const theme = useTheme();
  const { errorSnack, successSnack } = useSuccErrSnack();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const open = Boolean(anchorEl);

  const userProfile = getUserProfileFromMap(conversationId);

  const displayName =
    userProfile?.nickname && !userProfile.nickname.match(/^[0-9a-f]{24}$/)
      ? userProfile.nickname
      : 'Unknown User';
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
        deleteRoam: true,
      });

      rootStore.conversationStore.deleteConversation({
        conversationId,
        chatType: 'singleChat',
      });

      successSnack(DELETE_CHAT);
      handleClose();
      onDelete?.();
    } catch (e) {
      console.log('delete error', e);
      errorSnack(DELETE_CHAT_FAILED);
    }
  };

  const handleVoiceCall = async () => {
    try {
      console.log('📞 Starting call to:', conversationId);

      setCallModalOpen(true);

      const channelName = [currentUserId, conversationId].sort().join('_call');

      const msgId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const msg = {
        id: msgId,
        type: 'txt',
        to: conversationId,
        chatType: 'singleChat',
        msg: `📞 Voice Call - Click to join`,
        ext: {
          type: 'VOICE_CALL_INVITE',
          channelName: channelName,
          callerName: currentUserName,
          callerAvatar: currentUserAvatar,
          callerId: currentUserId,
        },
      };

      console.log('📞 Sending message:', msg);
      const result = await rootStore.client.send(msg);
      console.log('📞 Message sent successfully:', result);
    } catch (error: any) {
      console.error('❌ Failed to send call invitation:', error);
      errorSnack(
        'Failed to initiate call: ' + (error.message || 'Unknown error'),
      );
      setCallModalOpen(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: '16px 20px',
          bgcolor:
            theme.palette.mode === 'dark' ? theme.palette.dark?.dark : '#fff',
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.12)',
        }}
      >
        {avatarUrl ? (
          <Avatar
            src={avatarUrl}
            alt={displayName}
            style={{ width: 40, height: 40 }}
          />
        ) : (
          <Avatar
            style={{
              backgroundColor: theme.palette.primary.main,
              width: 40,
              height: 40,
              fontSize: '16px',
              fontWeight: 600,
            }}
          >
            {displayName.charAt(0).toUpperCase()}
          </Avatar>
        )}

        <Box flex={1} ml={2}>
          <Typography variant="h6" fontWeight={600}>
            {displayName ? (
              displayName
            ) : (
              <Skeleton variant="text" width={120} />
            )}
          </Typography>
        </Box>

        {/* Call button */}
        <Box display="flex" gap={1} alignItems="center">
          <IconButton
            onClick={handleVoiceCall}
            size="small"
            sx={{
              '&:hover': {
                bgcolor: theme.palette.action.hover,
              },
            }}
            aria-label="Voice call"
          >
            <Phone />
          </IconButton>

          <IconButton onClick={handleClick} size="small" sx={{ ml: 1 }}>
            <MoreVert />
          </IconButton>
        </Box>

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
      </Box>

      <SimpleVoiceCall
        open={callModalOpen}
        onClose={() => setCallModalOpen(false)}
        recipientId={conversationId}
        recipientName={displayName}
        recipientAvatar={avatarUrl}
        currentUserId={currentUserId}
        isIncoming={false}
      />
    </>
  );
}
