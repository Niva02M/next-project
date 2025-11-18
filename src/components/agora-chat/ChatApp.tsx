'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useClient, Chat, ConversationList, rootStore, Avatar } from 'agora-chat-uikit';
import { Box, CircularProgress, Alert, Typography, useTheme, alpha, Drawer } from '@mui/material';
import 'agora-chat-uikit/style.css';
import { CircleNotifications } from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import ChatItem from './ChatItem';
import CustomChatHeader from './ChatHeader';

interface AgoraUser {
  userId: string;
  type: string;
  created: number;
  modified: number;
  username: string;
  activated: boolean;
  nickname?: string;
  avatarurl?: string;
}

type UserProfile = {
  nickname: string;
  avatarurl: string;
};

export default function ChatApp({ currentUser }: { currentUser: string }) {
  const theme = useTheme();
  const [openSidebar, setOpenSidebar] = useState(false);

  const { data: session } = useSession();
  const user = session?.user;
  if (!session?.user) return null;

  const client = useClient();
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [allUsers, setAllUsers] = useState<AgoraUser[]>([]);
  const [userProfilesMap, setUserProfilesMap] = useState<Map<string, UserProfile>>(new Map());

  useEffect(() => {
    axios
      .post('/api/agora/token', { userId: currentUser })
      .then((res) => {
        setToken(res.data.token);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Token error:', err.response?.data || err.message);
        setError('Failed to authenticate. Please try again.');
        setLoading(false);
      });
  }, [currentUser]);

  useEffect(() => {
    if (!client || !token) return;
    client
      .open({ user: currentUser, accessToken: token })
      .then(() => {
        setIsConnected(true);
      })
      .catch((err: unknown) => {
        console.error('Connection error:', err);
        setError('Failed to connect to chat service.');
      });
  }, [client, token, currentUser]);

  const fetchUsersWithProfiles = async () => {
    const res = await axios.get('/api/agora/users');
    const userList = res.data.entities || [];

    const users = [];
    const profilesMap = new Map();

    for (const u of userList) {
      let meta;
      try {
        const metaRes = await axios.get(`/api/agora/get-user?userId=${u.username}`);
        meta = metaRes.data.data;
      } catch {
        meta = null;
      }

      const userProfile = {
        nickname: meta?.nickname || u.username,
        avatarurl: meta?.avatarurl || ''
      };

      const fullUser = {
        userId: u.username,
        type: u.type,
        created: u.created,
        modified: u.modified,
        activated: u.activated,
        username: u.username,
        ...userProfile
      };

      users.push(fullUser);
      profilesMap.set(u.username, userProfile);
    }

    setUserProfilesMap(profilesMap);
    return users;
  };

  useEffect(() => {
    fetchUsersWithProfiles().then(setAllUsers);
  }, []);

  const getUserProfileFromMap = (id: string): UserProfile => {
    return userProfilesMap.get(id) || { nickname: id, avatarurl: '' };
  };

  const handleItemClick = (conversation: any) => {
    rootStore.conversationStore.setCurrentCvs(conversation);
  };
  const customRenderSearch = () => {
    const [query, setQuery] = useState('');
    const [matches, setMatches] = useState<any[]>([]);

    const handleSelect = (user: any) => {
      const conversation = {
        chatType: 'singleChat' as const,
        conversationId: user.userId,
        name: user.nickname || user.userId,
        lastMessage: null,
        unreadCount: 0
      };

      rootStore.conversationStore.addConversation(conversation);
      rootStore.conversationStore.setCurrentCvs(conversation);

      setQuery('');
      setMatches([]);
    };

    return (
      <Box sx={{ p: 2, position: 'relative', width: '100%' }}>
        <input
          placeholder="Search by username or name..."
          value={query}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #ddd',
            borderRadius: '12px',
            fontSize: '14px',
            outline: 'none'
            // backgroundColor: '#1C1F26',
            // color: '#fff'
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
              return u.userId.toLowerCase().includes(q) || u.nickname?.toLowerCase().includes(q);
            });

            setMatches(filtered);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const value = query.trim();
              if (!value) return;

              const foundUser = allUsers.find(
                (u) => u.userId.toLowerCase().includes(value.toLowerCase()) || u.nickname?.toLowerCase().includes(value.toLowerCase())
              );

              const targetId = foundUser?.userId || value;
              const targetName = foundUser?.nickname || value;

              const conversation = {
                chatType: 'singleChat' as const,
                conversationId: targetId,
                name: targetName,
                lastMessage: null,
                unreadCount: 0
              };

              rootStore.conversationStore.addConversation(conversation);
              rootStore.conversationStore.setCurrentCvs(conversation);

              setQuery('');
              setMatches([]);
            }
          }}
        />

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
              zIndex: 20
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
                  borderBottom: '1px solid #f1f1f1'
                }}
                onClick={() => handleSelect(u)}
              >
                {' '}
                <Avatar src={u.avatarurl} alt={u.nickname} style={{ width: 44, height: 44 }} />{' '}
                <Box>
                  <Typography variant="body1" fontWeight={600} noWrap>
                    {u.nickname ? `${u.nickname} ` : u.userId}
                  </Typography>{' '}
                  <Typography variant="subtitle1" fontWeight={200} noWrap fontSize={12}>
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

  const customRenderItem = (conversation: any) => {
    const profile = getUserProfileFromMap(conversation.conversationId);

    return (
      <Box
        onClick={() => handleItemClick(conversation)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          p: 2,
          cursor: 'pointer',
          bgcolor:
            rootStore.conversationStore.currentCvs?.conversationId === conversation.conversationId
              ? alpha(theme.palette.primary.main, 0.08)
              : 'transparent',
          '&:hover': {
            bgcolor: alpha(theme.palette.primary.main, 0.08)
          }
          // color: '#fff'
        }}
      >
        {profile.avatarurl ? (
          <Avatar src={profile.avatarurl} alt={profile.nickname} style={{ width: 44, height: 44 }} />
        ) : (
          <Avatar
            style={{
              backgroundColor: theme.palette.primary.main,
              width: 44,
              height: 44,
              fontSize: '16px',
              fontWeight: 600
            }}
          >
            {profile.nickname.charAt(0).toUpperCase()}
          </Avatar>
        )}

        <Box flex={1} minWidth={0}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
            <Typography variant="body1" fontWeight={600} noWrap>
              {profile.nickname}
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
                  px: 0.5
                }}
              >
                {conversation.unreadCount}
              </Box>
            )}
          </Box>
          {conversation.lastMessage && (
            <Typography variant="body2" color="text.secondary" noWrap>
              {conversation.lastMessage.type === 'txt' ? conversation.lastMessage.msg : `[${conversation.lastMessage.type}]`}
            </Typography>
          )}
        </Box>
      </Box>
    );
  };

  const customRenderConversationHeader = () => (
    <Box
      sx={{
        padding: { xs: '14px', sm: '20px' }
        // color: '#fff'
      }}
      // style={{ backgroundColor: '#1C1F26', color: '#fff', borderTopLeftRadius: '24px' }}
    >
      <Box display="flex" alignItems="center" gap={1.5}>
        {user?.image ? (
          <Avatar src={user.image} alt={user?.name || currentUser} style={{ width: 44, height: 44 }} />
        ) : (
          <Avatar
            style={{
              backgroundColor: theme.palette.primary.main,
              width: 44,
              height: 44,
              fontWeight: 600,
              fontSize: '18px'
            }}
          >
            {currentUser.charAt(0).toUpperCase()}
          </Avatar>
        )}
        <Box flex={1}>
          <Typography variant="h6" fontWeight={600}>
            {user?.name || currentUser}
          </Typography>
          <Box display="flex" alignItems="center" gap={0.5}>
            <CircleNotifications
              sx={{
                fontSize: 10,
                color: isConnected ? '#4caf50' : '#bdbdbd'
              }}
            />
            <Typography variant="caption" color="text.secondary">
              {isConnected ? 'Online' : 'Connecting...'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        height: '88vh'
      }}
    >
      {' '}
      <Box
        sx={{
          width: { sm: '280px', md: '320px' },
          height: '100%',
          display: { xs: 'none', sm: 'block' },
          borderRight: '1px solid',
          borderColor: theme.palette.divider
        }}
      >
        <ConversationList
          renderHeader={customRenderConversationHeader}
          renderSearch={customRenderSearch}
          renderItem={customRenderItem}
          onItemClick={handleItemClick}
          // style={{ backgroundColor: '#1C1F26' }}
        />
      </Box>
      <Drawer anchor="left" open={openSidebar} onClose={() => setOpenSidebar(false)} sx={{ display: { xs: 'block', sm: 'none' } }}>
        <Box sx={{ width: 280 }}>
          <ConversationList
            renderHeader={customRenderConversationHeader}
            renderSearch={customRenderSearch}
            renderItem={customRenderItem}
            onItemClick={(c) => {
              handleItemClick(c);
              setOpenSidebar(false);
            }}
            // style={{ backgroundColor: '#1C1F26' }}
          />
        </Box>
      </Drawer>
      <Box
        sx={{
          flex: 1,
          height: 'auto'
        }}
      >
        <Chat
          renderHeader={() => {
            const currentConversation = rootStore.conversationStore.currentCvs;
            if (!currentConversation) return null;

            return (
              <CustomChatHeader
                conversationId={currentConversation.conversationId}
                getUserProfileFromMap={getUserProfileFromMap}
                openSidebar={() => setOpenSidebar(true)}
              />
            );
          }}
          messageListProps={{
            renderMessage: (msg: any) => {
              if (msg.type === 'cmd') return null;
              return <ChatItem msg={msg} currentUser={currentUser} getUserProfileFromMap={getUserProfileFromMap} />;
            }
          }}
          // renderMessageInput={() => {
          //   const c = rootStore.conversationStore.currentCvs;
          //   if (!c) return null;

          //   return <CustomMessageInput conversationId={c.conversationId} />;
          // }}
        />
      </Box>
    </Box>
  );
}
