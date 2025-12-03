import React, { useEffect, useState } from 'react';
import { Box, Typography, Skeleton, useTheme, alpha } from '@mui/material';
import { Avatar, rootStore, useClient } from 'agora-chat-uikit';
import { UserProfile } from '../../types/chat';

interface ConversationItemProps {
  conversation: any;
  getUserProfileFromMap: (id: string) => UserProfile;
  onClick: (conversation: any) => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  getUserProfileFromMap,
  onClick,
}) => {
  const theme = useTheme();
  const client = useClient();
  const isGroup = conversation.chatType === 'groupChat';
  const [groupName, setGroupName] = useState<string>('');

  useEffect(() => {
    if (isGroup && conversation.conversationId) {
      client
        .getGroupInfo({ groupId: conversation.conversationId })
        .then((res: any) => {
          const fetchedName = res.data[0]?.name || conversation.conversationId;
          setGroupName(fetchedName);
        })
        .catch((err: any) => {
          console.error('Error fetching group info:', err);
          setGroupName(conversation.conversationId);
        });
    }
  }, [conversation.conversationId, isGroup, client]);

  if (isGroup) {
    const displayGroupName = groupName || conversation.name || 'Group Chat';

    return (
      <Box
        onClick={() => onClick(conversation)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          p: 2,
          cursor: 'pointer',
          bgcolor:
            rootStore.conversationStore.currentCvs?.conversationId ===
            conversation.conversationId
              ? alpha(theme.palette.primary.main, 0.08)
              : 'transparent',
          '&:hover': {
            bgcolor: alpha(theme.palette.primary.main, 0.08),
          },
        }}
      >
        <Avatar
          style={{
            backgroundColor: theme.palette.secondary.main,
            width: 44,
            height: 44,
            fontSize: '16px',
            fontWeight: 600,
          }}
        >
          {displayGroupName.charAt(0).toUpperCase() || 'G'}
        </Avatar>

        <Box flex={1} minWidth={0}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={0.5}
          >
            <Typography variant="body1" fontWeight={600} noWrap>
              {displayGroupName}
            </Typography>
            {conversation.unreadCount > 0 && (
              <Box
                sx={{
                  minWidth: 20,
                  height: 20,
                  borderRadius: '10px',
                  bgcolor: theme.palette.error.main,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 600,
                  px: 0.5,
                }}
              >
                {conversation.unreadCount}
              </Box>
            )}
          </Box>
          {conversation.lastMessage && (
            <Typography variant="body2" color="text.secondary" noWrap>
              {conversation.lastMessage.msg || '[Message]'}
            </Typography>
          )}
        </Box>
      </Box>
    );
  }

  const profile = getUserProfileFromMap(conversation.conversationId);
  const isOnline = conversation.isOnline === true;
  const displayName =
    profile.nickname && !profile.nickname.match(/^[0-9a-f]{24}$/)
      ? profile.nickname
      : null;

  const lastMessagePreview = (() => {
    if (!conversation.lastMessage) return 'Start chatting';
    const { type, msg } = conversation.lastMessage;
    if (type === 'txt') return msg || '';
    if (type) return `[${type}]`;
    return 'Start a new Conversation ...';
  })();

  return (
    <Box
      onClick={() => onClick(conversation)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        p: 2,
        cursor: 'pointer',
        bgcolor:
          rootStore.conversationStore.currentCvs?.conversationId ===
          conversation.conversationId
            ? alpha(theme.palette.primary.main, 0.08)
            : 'transparent',
        '&:hover': {
          bgcolor: alpha(theme.palette.primary.main, 0.08),
        },
      }}
    >
      <Box position="relative" width={44} height={44}>
        {profile.avatarurl ? (
          <Avatar
            src={profile.avatarurl}
            alt={profile.nickname}
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
            {profile.nickname.charAt(0).toUpperCase()}
          </Avatar>
        )}

        <Box
          sx={{
            position: 'absolute',
            bottom: 2,
            right: 2,
            width: 10,
            height: 10,
            borderRadius: '50%',
            bgcolor: isOnline ? '#2ecc71' : '#bdc3c7',
            border: '2px solid white',
          }}
        />
      </Box>

      <Box flex={1} minWidth={0}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={0.5}
        >
          <Typography variant="body1" fontWeight={600} noWrap>
            {displayName ? (
              displayName
            ) : (
              <Skeleton variant="text" width={120} />
            )}
          </Typography>
          {conversation.unreadCount > 0 && (
            <Box
              sx={{
                minWidth: 20,
                height: 20,
                borderRadius: '10px',
                bgcolor: theme.palette.error.main,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 600,
                px: 0.5,
              }}
            >
              {conversation.unreadCount}
            </Box>
          )}
        </Box>
        {conversation.lastMessage && (
          <Typography variant="body2" color="text.secondary" noWrap>
            {lastMessagePreview}
          </Typography>
        )}
      </Box>
    </Box>
  );
};
