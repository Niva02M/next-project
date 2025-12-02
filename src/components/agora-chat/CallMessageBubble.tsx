import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { Phone, Group } from '@mui/icons-material';
import SimpleVoiceCall from './SimpleVoiceCall';
import { useClient } from 'agora-chat-uikit';

type UserProfile = {
  nickname?: string;
  avatarurl?: string;
};

interface CallMessageBubbleProps {
  message: any;
  currentUserId: string;
  getUserProfileFromMap: (id: string) => UserProfile | undefined;
}

export default function CallMessageBubble({
  message,
  currentUserId,
  getUserProfileFromMap,
}: CallMessageBubbleProps) {
  const theme = useTheme();
  const client = useClient();
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [groupName, setGroupName] = useState<string>('');

  if (!message) {
    console.error('❌ Message is undefined in CallMessageBubble');
    return null;
  }

  const isIncoming = message.from !== currentUserId;
  const callerId = message.ext?.callerId || message.from;
  const callerProfile = getUserProfileFromMap(callerId);

  // Extract call details from message extension
  const channelName = message.ext?.channelName;
  const isGroupCall = message.ext?.isGroupCall || false;
  const callerName =
    message.ext?.callerName || callerProfile?.nickname || callerId;
  const callerAvatar =
    message.ext?.callerAvatar || callerProfile?.avatarurl || '';
  const groupId = isGroupCall ? message.to : null;

  // Fetch group name if it's a group call
  useEffect(() => {
    if (isGroupCall && groupId) {
      client
        .getGroupInfo({ groupId })
        .then((res: any) => {
          const fetchedName = res.data[0]?.name || groupId;
          setGroupName(fetchedName);
        })
        .catch((err: any) => {
          console.error('Error fetching group info:', err);
          setGroupName(groupId);
        });
    }
  }, [isGroupCall, groupId, client]);

  const handleJoinCall = () => {
    console.log('🎯 Join Call button clicked!');
    console.log('📞 Channel Name:', channelName);
    console.log('📞 Is Group Call:', isGroupCall);
    console.log('📞 Group Name:', groupName);
    setCallModalOpen(true);
  };

  // Get display name - for group calls, show group name
  const displayName = isGroupCall ? groupName || 'Group Call' : callerName;

  console.log(
    '📋 CallMessageBubble render - isIncoming:',
    isIncoming,
    'isGroupCall:',
    isGroupCall,
    'displayName:',
    displayName,
  );

  return (
    <>
      <Box
        sx={{
          display: 'inline-flex',
          flexDirection: 'column',
          gap: 1,
          p: 2,
          bgcolor: isIncoming
            ? theme.palette.primary.light
            : theme.palette.grey[200],
          borderRadius: 2,
          maxWidth: '280px',
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          {isGroupCall ? (
            <Group sx={{ color: theme.palette.primary.main }} />
          ) : (
            <Phone sx={{ color: theme.palette.primary.main }} />
          )}
          <Typography variant="body2" fontWeight={600}>
            {isIncoming
              ? isGroupCall
                ? 'Incoming Group Call'
                : 'Incoming Voice Call'
              : isGroupCall
                ? 'Outgoing Group Call'
                : 'Outgoing Voice Call'}
          </Typography>
        </Box>

        {isGroupCall && displayName !== 'Group Call' && (
          <Typography variant="caption" color="text.secondary">
            {displayName}
          </Typography>
        )}

        {isIncoming ? (
          <Button
            variant="contained"
            color="success"
            size="small"
            startIcon={isGroupCall ? <Group /> : <Phone />}
            onClick={handleJoinCall}
            fullWidth
          >
            Join {isGroupCall ? 'Group ' : ''}Call
          </Button>
        ) : (
          <Typography variant="caption" color="text.secondary">
            {isGroupCall ? 'Group call started' : `Call started `}
          </Typography>
        )}
      </Box>

      {callModalOpen && (
        <SimpleVoiceCall
          open={callModalOpen}
          onClose={() => {
            console.log('🔴 Closing call modal');
            setCallModalOpen(false);
          }}
          recipientId={isGroupCall ? groupId : callerId}
          recipientName={displayName}
          recipientAvatar={callerAvatar}
          currentUserId={currentUserId}
          isIncoming={true}
          isGroupCall={isGroupCall}
          channelName={channelName}
        />
      )}
    </>
  );
}
