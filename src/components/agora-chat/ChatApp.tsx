'use client';
import React, { useState } from 'react';
import {
  useClient,
  Chat,
  ConversationList,
  rootStore,
  Conversation,
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
      console.log('Creating group with:', {
        groupName,
        groupDescription,
        selectedMembers,
      });

      if (!client || !isConnected) {
        alert('Chat client is not connected. Please try again.');
        return;
      }

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

      console.log('Calling createGroup with options:', options);
      const group = await client.createGroup(options);
      console.log('Group created - full response:', group);

      if (!group || !group.data) {
        console.error('Invalid group response:', group);
        alert('Failed to create group. Invalid response from server.');
        setCreateGroupOpen(false);
        return;
      }

      const groupId = group.data.groupid || group.data.id || group.data.groupId;

      if (!groupId) {
        console.error('No group ID found in response:', group);
        alert('Group created but cannot navigate to it.');
        setCreateGroupOpen(false);
        return;
      }

      console.log('Group ID:', groupId);

      setCreateGroupOpen(false);
      const newConversation: Conversation = {
        conversationId: groupId,
        chatType: 'groupChat',
        lastMessage: {},
        unreadCount: 0,
      };

      try {
        rootStore.conversationStore.addConversation(newConversation);
        console.log('Manually added conversation to store');

        rootStore.conversationStore.setCurrentCvs(newConversation);
        alert('Group created successfully!');
      } catch (addError) {
        console.error('Error adding conversation to store:', addError);

        let attempts = 0;
        const maxAttempts = 15;

        const findAndSwitchToGroup = () => {
          attempts++;
          const conversations = rootStore.conversationStore.conversationList;
          console.log(
            'Current conversations:',
            conversations.map((c: any) => ({
              id: c.conversationId,
              type: c.chatType,
            })),
          );

          const groupConversation = conversations.find(
            (c: any) =>
              c.conversationId === groupId && c.chatType === 'groupChat',
          );

          if (groupConversation) {
            console.log('Found group conversation:', groupConversation);
            rootStore.conversationStore.setCurrentCvs(groupConversation);
            alert('Group created successfully!');
          } else if (attempts < maxAttempts) {
            console.log(
              `Attempt ${attempts}: Group conversation not found yet, retrying...`,
            );
            setTimeout(findAndSwitchToGroup, 500);
          } else {
            console.warn(
              'Could not find group conversation after multiple attempts',
            );
            alert(
              'Group created but not visible yet. Please refresh or send a message in the group.',
            );
          }
        };

        setTimeout(findAndSwitchToGroup, 1000);
      }
    } catch (error: any) {
      console.error('Error creating group - full error:', error);
      console.error('Error type:', typeof error);
      console.error('Error keys:', Object.keys(error));

      let errorMessage = 'Unknown error';

      if (error.message) {
        errorMessage = error.message;
      } else if (error.data?.error) {
        errorMessage = error.data.error;
      } else if (error.error_description) {
        errorMessage = error.error_description;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      alert(`Failed to create group: ${errorMessage}`);
      setCreateGroupOpen(false);
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
