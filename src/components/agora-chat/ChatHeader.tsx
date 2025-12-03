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
  const [isGroupOwner, setIsGroupOwner] = useState(false);

  useEffect(() => {
    const checkOwnership = async () => {
      if (isGroup && conversationId) {
        try {
          const groupInfo = await client.getGroupInfo({
            groupId: conversationId,
          });
          const owner = groupInfo.data[0]?.owner;
          setIsGroupOwner(owner === currentUserId);
        } catch (error) {
          console.error('Error checking group ownership:', error);
        }
      }
    };

    checkOwnership();
  }, [conversationId, isGroup, client, currentUserId]);
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
    handleClose();

    try {
      if (!client || !client.isOpened()) {
        alert('Chat connection lost. Please refresh the page.');
        return;
      }

      const groupInfo = await client.getGroupInfo({ groupId: conversationId });
      const groupData = groupInfo.data[0];
      const isOwner = groupData?.owner === currentUserId;

      if (isOwner) {
        alert(
          'As the group owner, you must either transfer ownership or delete the group.',
        );
        return;
      }

      const isAdmin = groupData?.affiliations?.some(
        (member: any) =>
          member.member === currentUserId && member.owner === false,
      );

      const confirmMessage = isAdmin
        ? 'You are a group admin. Leaving will remove your admin privileges.\n\nAre you sure you want to leave this group?'
        : 'Are you sure you want to leave this group?';

      if (confirm(confirmMessage)) {
        await client.leaveGroup({ groupId: conversationId });

        console.log('✅ Successfully left group:', conversationId);

        rootStore.conversationStore.deleteConversation({
          conversationId: conversationId,
          chatType: 'groupChat',
        });

        const remainingConversations =
          rootStore.conversationStore.conversationList;
        if (remainingConversations.length > 0) {
          rootStore.conversationStore.setCurrentCvs(remainingConversations[0]);
        } else {
          rootStore.conversationStore.setCurrentCvs({} as any);
        }

        alert('You have left the group successfully');
      }
    } catch (error: any) {
      console.error('❌ Error leaving group:', error);

      let errorMessage = 'Failed to leave group';

      if (error.type === 700) {
        errorMessage =
          'Authentication error. Please refresh the page and try again.';
      } else if (error.type === 603) {
        try {
          const errorData = JSON.parse(error.data);
          errorMessage = errorData.error_description || errorMessage;
        } catch (e) {
          errorMessage = error.message || errorMessage;
        }
      } else if (error.data) {
        try {
          const errorData =
            typeof error.data === 'string'
              ? JSON.parse(error.data)
              : error.data;
          errorMessage =
            errorData.error_description || error.message || errorMessage;
        } catch (e) {
          errorMessage = error.message || errorMessage;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(`Error: ${errorMessage}`);
    }
  };

  const handleDeleteGroup = async () => {
    handleClose();

    if (
      !confirm(
        'Are you sure you want to delete this group? This cannot be undone and will remove all members.',
      )
    ) {
      return;
    }

    try {
      await client.destroyGroup({ groupId: conversationId });
      console.log('✅ Group destroyed:', conversationId);

      rootStore.conversationStore.deleteConversation({
        conversationId: conversationId,
        chatType: 'groupChat',
      });

      const remainingConversations =
        rootStore.conversationStore.conversationList;
      if (remainingConversations.length > 0) {
        rootStore.conversationStore.setCurrentCvs(remainingConversations[0]);
      } else {
        rootStore.conversationStore.setCurrentCvs({} as any);
      }

      alert('Group deleted successfully');
    } catch (error: any) {
      console.error('❌ Error deleting group:', error);
      alert('Failed to delete group');
    }
  };
  const handleVoiceCall = async () => {
    try {
      console.log('📞 Starting call to:', conversationId);

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
            isGroupOwner ? (
              <MenuItem
                onClick={handleDeleteGroup}
                sx={{ color: 'error.main', gap: 1 }}
              >
                <Delete fontSize="small" />
                Delete Group
              </MenuItem>
            ) : (
              <MenuItem
                onClick={handleLeaveGroup}
                sx={{ color: 'error.main', gap: 1 }}
              >
                <ExitToApp fontSize="small" />
                Leave Group
              </MenuItem>
            )
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
