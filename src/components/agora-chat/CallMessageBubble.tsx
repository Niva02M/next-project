import React, { useState } from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { Phone } from '@mui/icons-material';
import SimpleVoiceCall from './SimpleVoiceCall';

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
  const [callModalOpen, setCallModalOpen] = useState(false);

  // Safety check
  if (!message) {
    console.error('❌ Message is undefined in CallMessageBubble');
    return null;
  }

  const isIncoming = message.from !== currentUserId;
  const callerId = message.ext?.callerId || message.from;
  const callerProfile = getUserProfileFromMap(callerId);

  const handleJoinCall = () => {
    console.log('🎯 Join Call button clicked!');
    console.log('📞 Opening modal for:', callerId);
    console.log('📞 Caller profile:', callerProfile);
    setCallModalOpen(true);
  };

  console.log(
    '📋 CallMessageBubble render - isIncoming:',
    isIncoming,
    'callModalOpen:',
    callModalOpen,
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
          <Phone sx={{ color: theme.palette.primary.main }} />
          <Typography variant="body2" fontWeight={600}>
            {isIncoming ? 'Incoming Voice Call' : 'Outgoing Voice Call'}
          </Typography>
        </Box>

        {isIncoming ? (
          <Button
            variant="contained"
            color="success"
            size="small"
            startIcon={<Phone />}
            onClick={handleJoinCall}
            fullWidth
          >
            Join Call
          </Button>
        ) : (
          <Typography variant="caption" color="text.secondary">
            Waiting for {callerProfile?.nickname || 'user'} to join...
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
          recipientId={callerId}
          recipientName={callerProfile?.nickname || callerId}
          recipientAvatar={callerProfile?.avatarurl || ''}
          currentUserId={currentUserId}
          isIncoming={true}
        />
      )}
    </>
  );
}
