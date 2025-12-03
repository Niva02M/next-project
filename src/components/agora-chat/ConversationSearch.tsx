import React, { useState } from 'react';
import { Box, Typography, IconButton, useTheme, alpha } from '@mui/material';
import { GroupAdd } from '@mui/icons-material';
import { Avatar, rootStore, Message } from 'agora-chat-uikit';
import { AgoraUser } from '../../types/chat';

interface ConversationSearchProps {
  allUsers: AgoraUser[];
  onCreateGroupClick: () => void;
}

export const ConversationSearch: React.FC<ConversationSearchProps> = ({
  allUsers,
  onCreateGroupClick,
}) => {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [matches, setMatches] = useState<any[]>([]);

  const handleSelect = (user: any) => {
    const conversation = {
      chatType: 'singleChat' as const,
      conversationId: user.userId,
      name: user.nickname || user.userId,
      lastMessage: {} as Message,
      unreadCount: 0,
    };
    //@ts-ignore
    rootStore?.conversationStore?.addConversation(conversation);
    //@ts-ignore
    rootStore?.conversationStore?.setCurrentCvs(conversation);

    setQuery('');
    setMatches([]);
  };

  return (
    <Box sx={{ p: 2, position: 'relative', width: '100%' }}>
      <Box display="flex" gap={1} alignItems="center">
        <input
          placeholder="Search by username or name..."
          value={query}
          style={{
            flex: 1,
            padding: '10px 12px',
            border: '1px solid #ddd',
            borderRadius: '12px',
            fontSize: '14px',
            outline: 'none',
          }}
          onChange={(e) => {
            const value = e.target.value;
            setQuery(value);

            if (!value.trim()) {
              setMatches([]);
              return;
            }

            const filtered = allUsers.filter((u) => {
              const q = value.toLowerCase();
              return (
                u.userId.toLowerCase().includes(q) ||
                u.nickname?.toLowerCase().includes(q)
              );
            });

            setMatches(filtered);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const value = query.trim();
              if (!value) return;

              const foundUser = allUsers.find(
                (u) =>
                  u.userId.toLowerCase().includes(value.toLowerCase()) ||
                  u.nickname?.toLowerCase().includes(value.toLowerCase()),
              );

              const targetId = foundUser?.userId || value;
              const targetName = foundUser?.nickname || value;

              const conversation = {
                chatType: 'singleChat' as const,
                conversationId: targetId,
                name: targetName,
                lastMessage: {} as Message,
                unreadCount: 0,
              };
              //@ts-ignore
              rootStore.conversationStore.addConversation(conversation);
              //@ts-ignore
              rootStore.conversationStore.setCurrentCvs(conversation);

              setQuery('');
              setMatches([]);
            }
          }}
        />
        <IconButton
          onClick={onCreateGroupClick}
          sx={{
            bgcolor: theme.palette.primary.main,
            color: 'white',
            '&:hover': { bgcolor: theme.palette.primary.dark },
          }}
        >
          <GroupAdd />
        </IconButton>
      </Box>

      {matches.length > 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: '68px',
            left: 0,
            right: 0,
            width: '100%',
            background: '#fff',
            borderRadius: '8px',
            maxHeight: '200px',
            overflowY: 'auto',
            zIndex: 20,
            boxShadow: theme.shadows[4],
          }}
        >
          {matches.map((u) => (
            <Box
              key={u.userId}
              sx={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                padding: '8px 12px',
                cursor: 'pointer',
                borderBottom: '1px solid #f1f1f1',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                },
              }}
              onClick={() => handleSelect(u)}
            >
              <Avatar
                src={u.avatarurl}
                alt={u.nickname}
                style={{ width: 44, height: 44 }}
              />
              <Box>
                <Typography variant="body1" fontWeight={600} noWrap>
                  {u.nickname ? `${u.nickname} ` : u.userId}
                </Typography>
                <Typography
                  variant="subtitle1"
                  fontWeight={200}
                  noWrap
                  fontSize={12}
                >
                  {u.userId}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};
