import React, { useEffect, useState } from 'react';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from '@mui/material';
import { MoreVert, Delete, Phone, ExitToApp } from '@mui/icons-material';
import { Avatar, rootStore, useClient } from 'agora-chat-uikit';
import useSuccErrSnack from 'hooks/useSuccErrSnack';
import {
  DELETE_CHAT,
  DELETE_CHAT_FAILED,
} from 'components/authentication/constants';
import SimpleVoiceCall from './SimpleVoiceCall';
import axios from 'axios';

import { UserProfile } from '../../types/chat';

interface CustomChatHeaderProps {
  conversationId: string;
  chatType?: 'singleChat' | 'groupChat' | 'chatRoom';
  getUserProfileFromMap: (id: string) => UserProfile;
  currentUserId: string;
  currentUserName: string;
  currentUserAvatar?: string;
  onDelete?: () => void;
  openSidebar?: () => void;
}

export default function CustomChatHeader({
  conversationId,
  chatType,
  getUserProfileFromMap,
  currentUserId,
  currentUserName,
  currentUserAvatar,
  onDelete,
}: CustomChatHeaderProps) {
  const theme = useTheme();
  const client = useClient();
  const [groupName, setGroupName] = useState<string>('');
  const [groupMemberCount, setGroupMemberCount] = useState<number>(0);

  const isGroup = chatType === 'groupChat';
  const { errorSnack, successSnack } = useSuccErrSnack();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const open = Boolean(anchorEl);

  // Fetch group details if it's a group chat
  useEffect(() => {
    if (isGroup && conversationId) {
      client
        .getGroupInfo({ groupId: conversationId })
        .then((res: any) => {
          setGroupName(res.data[0]?.name || conversationId);
          setGroupMemberCount(res.data[0]?.affiliations_count || 0);
        })
        .catch((err: any) => {
          console.error('Error fetching group info:', err);
          setGroupName(conversationId);
        });
    }
  }, [conversationId, isGroup, client]);

  const userProfile = getUserProfileFromMap(conversationId);

  const displayName = isGroup
    ? groupName || 'Group Chat'
    : userProfile?.nickname && !userProfile.nickname.match(/^[0-9a-f]{24}$/)
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

  const handleLeaveGroup = async () => {
    if (!window.confirm('Are you sure you want to leave this group?')) {
      handleClose();
      return;
    }

    try {
      // Call API endpoint to leave the group
      const response = await axios.post('/api/agora/group/leave', {
        groupId: conversationId,
      });

      console.log('Left group successfully:', response.data);

      // Remove from local conversation store
      rootStore.conversationStore.deleteConversation({
        conversationId,
        chatType: 'groupChat',
      });

      successSnack('Successfully left the group');
      handleClose();
      onDelete?.();
    } catch (error: any) {
      console.error('Error leaving group:', error);
      const errorMessage =
        error.response?.data?.error || error.message || 'Unknown error';
      errorSnack('Failed to leave group: ' + errorMessage);
      handleClose();
    }
  };

  const handleVoiceCall = async () => {
    try {
      console.log('📞 Starting call to:', conversationId);

      // For groups, use groupId as channel, for single chats use sorted userIds
      const channelName = isGroup
        ? `group_${conversationId}_call`
        : [currentUserId, conversationId].sort().join('_call');

      setCallModalOpen(true);

      const msgId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const msg = {
        id: msgId,
        type: 'txt',
        to: conversationId,
        chatType: isGroup ? 'groupChat' : 'singleChat',
        msg: `📞 Voice Call - Click to join`,
        ext: {
          type: 'VOICE_CALL_INVITE',
          channelName: channelName,
          callerName: currentUserName,
          callerAvatar: currentUserAvatar,
          callerId: currentUserId,
          isGroupCall: isGroup,
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
          gap: 2,
          p: 2,
          borderBottom: '1px solid',
          borderColor: theme.palette.divider,
          bgcolor: theme.palette.background.paper,
        }}
      >
        {isGroup ? (
          <Avatar
            style={{
              backgroundColor: theme.palette.secondary.main,
              width: 44,
              height: 44,
              fontSize: '16px',
              fontWeight: 600,
            }}
          >
            {displayName.charAt(0).toUpperCase() || 'G'}
          </Avatar>
        ) : userProfile?.avatarurl ? (
          <Avatar
            src={userProfile.avatarurl}
            alt={displayName}
            style={{ width: 44, height: 44 }}
          />
        ) : (
          <Avatar
            style={{
              backgroundColor: theme.palette.primary.main,
              width: 44,
              height: 44,
              fontSize: '16px',
              fontWeight: 600,
            }}
          >
            {displayName.charAt(0).toUpperCase()}
          </Avatar>
        )}

        {isGroup ? (
          <Box flex={1}>
            <Typography variant="h6" fontWeight={600} noWrap>
              {groupName || 'Group Chat'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {groupMemberCount > 0 ? `${groupMemberCount} members` : 'Group'}
            </Typography>
          </Box>
        ) : (
          <Box flex={1}>
            <Typography variant="h6" fontWeight={600} noWrap>
              {displayName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Active now
            </Typography>
          </Box>
        )}

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

          <IconButton onClick={handleClick} size="small">
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
          {isGroup ? (
            <MenuItem
              onClick={handleLeaveGroup}
              sx={{ color: 'error.main', gap: 1 }}
            >
              <ExitToApp fontSize="small" />
              Leave Group
            </MenuItem>
          ) : (
            <MenuItem
              onClick={handleDelete}
              sx={{ color: 'error.main', gap: 1 }}
            >
              <Delete fontSize="small" />
              Delete Conversation
            </MenuItem>
          )}
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
        isGroupCall={isGroup}
        channelName={
          isGroup
            ? `group_${conversationId}_call`
            : [currentUserId, conversationId].sort().join('_call')
        }
      />
    </>
  );
}
