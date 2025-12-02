'use client';
import React, { useState } from 'react';
import {
  useClient,
  Chat,
  ConversationList,
  rootStore,
  Message,
} from 'agora-chat-uikit';
import {
  Box,
  CircularProgress,
  Alert,
  Typography,
  useTheme,
  Drawer,
} from '@mui/material';
import 'agora-chat-uikit/style.css';
import { ChatBubbleOutline } from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import ChatItem from './ChatItem';
import CustomChatHeader from './ChatHeader';
import { useChatConnection } from '../../hooks/useChatConnection';
import { useChatUsers } from '../../hooks/useChatUsers';
import { ConversationSearch } from './ConversationSearch';
import { ConversationHeader } from './ConversationHeader';
import { ConversationItem } from './ConversationItem';
import { CreateGroupDialog } from './CreateGroupDialog';

export default function ChatApp({ currentUser }: { currentUser: string }) {
  const theme = useTheme();
  const [openSidebar, setOpenSidebar] = useState(false);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const { data: session } = useSession();
  const user = session?.user;
  if (!session?.user) return null;

  const client = useClient();
  const { loading, error, isConnected } = useChatConnection(currentUser);
  const { allUsers, getUserProfileFromMap } = useChatUsers();

  const handleItemClick = (conversation: any) => {
    rootStore.conversationStore.setCurrentCvs(conversation);
  };

  const handleCreateGroup = async (
    groupName: string,
    groupDescription: string,
    selectedMembers: string[],
  ) => {
    try {
      const options = {
        data: {
          groupname: groupName,
          desc: groupDescription,
          members: selectedMembers,
          public: false,
          approval: false,
          allowinvites: true,
          inviteNeedConfirm: false,
        },
      };

      const group = await client.createGroup(options);
      console.log('Group created:', group);

      // Don't manually create conversation - Agora creates it automatically
      // Just switch to the new group conversation
      const groupId = group.data.groupid;

      // Wait a bit for Agora to create the conversation
      setTimeout(() => {
        const conversations = rootStore.conversationStore.conversationList;
        const groupConversation = conversations.find(
          (c: any) => c.conversationId === groupId,
        );

        if (groupConversation) {
          rootStore.conversationStore.setCurrentCvs(groupConversation);
        }
      }, 500);

      setCreateGroupOpen(false);
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Failed to create group. Please try again.');
    }
  };

  const customRenderSearch = () => (
    <ConversationSearch
      allUsers={allUsers}
      onCreateGroupClick={() => setCreateGroupOpen(true)}
    />
  );

  const customRenderItem = (conversation: any) => (
    <ConversationItem
      conversation={conversation}
      getUserProfileFromMap={getUserProfileFromMap}
      onClick={handleItemClick}
    />
  );

  const customRenderConversationHeader = () => (
    <ConversationHeader
      currentUser={currentUser}
      userName={user?.name}
      userImage={user?.image}
      isConnected={isConnected}
      tabValue={tabValue}
      onTabChange={(e, newValue) => setTabValue(newValue)}
    />
  );

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
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
    <>
      <Box
        sx={{ display: 'flex', height: { xs: '78vh', lg: '84vh', xl: '88vh' } }}
      >
        <Box
          sx={{
            width: { sm: '280px', md: '320px' },
            height: '100%',
            display: { xs: 'none', sm: 'block' },
            borderRight: '1px solid',
            borderColor: theme.palette.divider,
          }}
        >
          <ConversationList
            presence={true}
            renderHeader={customRenderConversationHeader}
            renderSearch={customRenderSearch}
            renderItem={customRenderItem}
            onItemClick={handleItemClick}
          />
        </Box>

        <Drawer
          anchor="left"
          open={openSidebar}
          onClose={() => setOpenSidebar(false)}
          sx={{ display: { xs: 'block', sm: 'none' } }}
        >
          <Box sx={{ width: 280 }}>
            <ConversationList
              renderHeader={customRenderConversationHeader}
              renderSearch={customRenderSearch}
              renderItem={customRenderItem}
              onItemClick={(c) => {
                handleItemClick(c);
                setOpenSidebar(false);
              }}
            />
          </Box>
        </Drawer>

        <Box sx={{ flex: 1, height: 'auto' }}>
          <Box
            onClick={() => setOpenSidebar(true)}
            sx={{
              marginBottom: 1,
              display: { xs: 'flex', sm: 'none' },
              alignItems: 'center',
              gap: 1,
              width: '110px',
              justifyContent: 'center',
              border: '1px solid',
              borderColor: theme.palette.grey[400],
              backgroundColor: theme.palette.background.paper,
              padding: '6px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              marginLeft: 'auto',
            }}
          >
            <ChatBubbleOutline fontSize="small" />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Chats
            </Typography>
          </Box>

          <Chat
            renderHeader={(msg) => {
              const currentConversation =
                rootStore.conversationStore.currentCvs;
              if (!currentConversation) return null;

              return (
                <CustomChatHeader
                  conversationId={currentConversation.conversationId}
                  chatType={currentConversation.chatType}
                  getUserProfileFromMap={getUserProfileFromMap}
                  currentUserId={currentUser}
                  currentUserName={user?.name || currentUser}
                  currentUserAvatar={user?.image}
                />
              );
            }}
            messageListProps={{
              renderMessage: (msg: any) => {
                if (msg.type === 'cmd') return null;
                return (
                  <ChatItem
                    msg={msg}
                    currentUser={currentUser}
                    getUserProfileFromMap={getUserProfileFromMap}
                  />
                );
              },
            }}
          />
        </Box>
      </Box>

      <CreateGroupDialog
        open={createGroupOpen}
        onClose={() => setCreateGroupOpen(false)}
        onCreateGroup={handleCreateGroup}
        allUsers={allUsers}
        currentUser={currentUser}
        getUserProfileFromMap={getUserProfileFromMap}
      />
    </>
  );
}
