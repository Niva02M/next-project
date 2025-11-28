import React, { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  IconButton,
  Typography,
  Avatar,
  useTheme,
  Button,
} from '@mui/material';
import { CallEnd, Mic, MicOff } from '@mui/icons-material';
import AgoraRTC, {
  IAgoraRTCClient,
  IMicrophoneAudioTrack,
} from 'agora-rtc-sdk-ng';
import axios from 'axios';

interface SimpleVoiceCallProps {
  open: boolean;
  onClose: () => void;
  recipientId: string;
  recipientName: string;
  recipientAvatar?: string;
  currentUserId: string;
  isIncoming?: boolean;
}

export default function SimpleVoiceCall({
  open,
  onClose,
  recipientId,
  recipientName,
  recipientAvatar,
  currentUserId,
  isIncoming = false,
}: SimpleVoiceCallProps) {
  const theme = useTheme();
  const [client, setClient] = useState<IAgoraRTCClient | null>(null);
  const [localAudioTrack, setLocalAudioTrack] =
    useState<IMicrophoneAudioTrack | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [remoteUserCount, setRemoteUserCount] = useState(0);
  const [callDuration, setCallDuration] = useState(0);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Channel name: use sorted IDs to ensure both users join same channel
  const channelName = [currentUserId, recipientId].sort().join('_call');

  const joinCall = async () => {
    try {
      setIsConnecting(true);

      console.log('🎤 Joining call channel:', channelName);

      // Get RTC token from server
      const tokenResponse = await axios.post('/api/agora/rtc-token', {
        userId: currentUserId,
        channel: channelName,
      });

      const { rtcToken, appId } = tokenResponse.data;
      console.log('✅ Got RTC token, appId:', appId);

      if (!appId || !rtcToken) {
        throw new Error('Failed to get RTC token from server');
      }

      // Create Agora RTC client
      const agoraClient = AgoraRTC.createClient({
        mode: 'rtc',
        codec: 'vp8',
      });

      // Set up event listeners
      agoraClient.on('user-joined', (user) => {
        console.log('👤 User joined:', user.uid);
      });

      agoraClient.on('user-published', async (user, mediaType) => {
        try {
          console.log('👤 User published:', user.uid, 'media:', mediaType);
          await agoraClient.subscribe(user, mediaType);

          if (mediaType === 'audio') {
            setRemoteUserCount((prev) => prev + 1);
            user.audioTrack?.play();
            console.log('🔊 Playing remote audio from:', user.uid);
          }
        } catch (err) {
          console.error('❌ Error subscribing to user:', err);
        }
      });

      agoraClient.on('user-unpublished', (user, mediaType) => {
        console.log('👤 User unpublished:', user.uid, mediaType);
        if (mediaType === 'audio') {
          setRemoteUserCount((prev) => Math.max(0, prev - 1));
        }
      });

      agoraClient.on('user-left', (user) => {
        console.log('👤 User left:', user.uid);
        setRemoteUserCount((prev) => Math.max(0, prev - 1));
      });

      setClient(agoraClient);

      // Join the channel - use 0 as UID (token was generated with uid=0)
      const joinedUid = await agoraClient.join(appId, channelName, rtcToken, 0);
      console.log('✅ Joined channel with UID:', joinedUid);

      // Create and publish audio track
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      setLocalAudioTrack(audioTrack);

      await agoraClient.publish([audioTrack]);
      console.log('✅ Published audio track');

      setIsConnected(true);
      setIsConnecting(false);

      // Start call timer
      callTimerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } catch (error: any) {
      console.error('❌ Failed to join call:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      setIsConnecting(false);

      let errorMsg = 'Failed to join call';
      if (error.code === 'INVALID_PARAMS') {
        errorMsg = 'Invalid app configuration';
      } else if (error.code === 'INVALID_OPERATION') {
        errorMsg = 'Token expired or invalid';
      } else if (error.message) {
        errorMsg = error.message;
      }

      alert(errorMsg);
      onClose();
    }
  };

  const endCall = async () => {
    try {
      console.log('📞 Ending call...');

      // Stop timer
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }

      // Stop and close audio track
      if (localAudioTrack) {
        localAudioTrack.stop();
        localAudioTrack.close();
      }

      // Leave channel
      if (client) {
        await client.unpublish();
        await client.leave();
        client.removeAllListeners();
      }

      console.log('✅ Call ended');
      onClose();
    } catch (error) {
      console.error('Error ending call:', error);
      onClose();
    }
  };

  const toggleAudio = () => {
    if (localAudioTrack) {
      if (isAudioMuted) {
        localAudioTrack.setEnabled(true);
      } else {
        localAudioTrack.setEnabled(false);
      }
      setIsAudioMuted(!isAudioMuted);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Auto-join if outgoing call
  useEffect(() => {
    if (open && !isIncoming) {
      joinCall();
    }
  }, [open]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
      if (localAudioTrack) {
        localAudioTrack.stop();
        localAudioTrack.close();
      }
      if (client) {
        client.leave().catch(console.error);
        client.removeAllListeners();
      }
    };
  }, []);

  return (
    <Dialog
      open={open}
      onClose={endCall}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: theme.palette.background.paper,
          borderRadius: 3,
          minHeight: '400px',
        },
      }}
    >
      <DialogContent sx={{ p: 4, textAlign: 'center' }}>
        {/* Incoming Call - Not Connected Yet */}
        {isIncoming && !isConnected && !isConnecting && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={3}
          >
            <Typography variant="h6" color="text.secondary">
              Incoming Voice Call
            </Typography>

            <Avatar
              src={recipientAvatar}
              sx={{
                width: 100,
                height: 100,
                bgcolor: theme.palette.primary.main,
                fontSize: '40px',
              }}
            >
              {recipientName.charAt(0).toUpperCase()}
            </Avatar>

            <Typography variant="h5" fontWeight={600}>
              {recipientName}
            </Typography>

            <Box display="flex" gap={2} mt={2}>
              <Button
                variant="contained"
                color="error"
                onClick={onClose}
                startIcon={<CallEnd />}
              >
                Decline
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={joinCall}
                startIcon={<Mic />}
              >
                Accept
              </Button>
            </Box>
          </Box>
        )}

        {/* Connecting */}
        {isConnecting && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={3}
          >
            <Avatar
              src={recipientAvatar}
              sx={{
                width: 100,
                height: 100,
                bgcolor: theme.palette.primary.main,
                fontSize: '40px',
              }}
            >
              {recipientName.charAt(0).toUpperCase()}
            </Avatar>

            <Typography variant="h5" fontWeight={600}>
              {recipientName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Connecting...
            </Typography>

            <IconButton
              onClick={endCall}
              sx={{
                width: 60,
                height: 60,
                bgcolor: theme.palette.error.main,
                color: 'white',
                '&:hover': { bgcolor: theme.palette.error.dark },
                mt: 2,
              }}
            >
              <CallEnd />
            </IconButton>
          </Box>
        )}

        {/* Connected */}
        {isConnected && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={3}
          >
            <Avatar
              src={recipientAvatar}
              sx={{
                width: 100,
                height: 100,
                bgcolor: theme.palette.primary.main,
                fontSize: '40px',
              }}
            >
              {recipientName.charAt(0).toUpperCase()}
            </Avatar>

            <Box textAlign="center">
              <Typography variant="h5" fontWeight={600}>
                {recipientName}
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                {formatDuration(callDuration)}
              </Typography>
              <Typography
                variant="caption"
                color={remoteUserCount > 0 ? 'success.main' : 'text.secondary'}
              >
                {remoteUserCount > 0
                  ? '● Connected'
                  : '○ Waiting for other user...'}
              </Typography>
            </Box>

            <Box display="flex" gap={2} mt={2}>
              <IconButton
                onClick={toggleAudio}
                sx={{
                  width: 60,
                  height: 60,
                  bgcolor: isAudioMuted
                    ? theme.palette.error.main
                    : theme.palette.action.hover,
                  color: isAudioMuted ? 'white' : 'inherit',
                  '&:hover': {
                    bgcolor: isAudioMuted
                      ? theme.palette.error.dark
                      : theme.palette.action.selected,
                  },
                }}
              >
                {isAudioMuted ? <MicOff /> : <Mic />}
              </IconButton>
              <IconButton
                onClick={endCall}
                sx={{
                  width: 60,
                  height: 60,
                  bgcolor: theme.palette.error.main,
                  color: 'white',
                  '&:hover': { bgcolor: theme.palette.error.dark },
                }}
              >
                <CallEnd />
              </IconButton>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
