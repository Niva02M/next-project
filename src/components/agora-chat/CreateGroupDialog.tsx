// components/CreateGroupDialog.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Checkbox,
  ListItem,
  ListItemAvatar,
  ListItemText,
  List,
  Chip,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { Avatar } from 'agora-chat-uikit';
import { AgoraUser, UserProfile } from '../../types/chat';

interface CreateGroupDialogProps {
  open: boolean;
  onClose: () => void;
  onCreateGroup: (
    groupName: string,
    description: string,
    members: string[],
  ) => void;
  allUsers: AgoraUser[];
  currentUser: string;
  getUserProfileFromMap: (id: string) => UserProfile;
}

export const CreateGroupDialog: React.FC<CreateGroupDialogProps> = ({
  open,
  onClose,
  onCreateGroup,
  allUsers,
  currentUser,
  getUserProfileFromMap,
}) => {
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreate = () => {
    onCreateGroup(groupName, groupDescription, selectedMembers);
    setGroupName('');
    setGroupDescription('');
    setSelectedMembers([]);
    setSearchQuery('');
  };

  const toggleMemberSelection = (userId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const filteredUsers = allUsers.filter(
    (u) =>
      u.userId !== currentUser &&
      (u.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.nickname?.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Create Group Chat
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Description (Optional)"
          value={groupDescription}
          onChange={(e) => setGroupDescription(e.target.value)}
          margin="normal"
          multiline
          rows={2}
        />

        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
          Select Members ({selectedMembers.length} selected)
        </Typography>

        <TextField
          fullWidth
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          sx={{ mb: 2 }}
        />

        {selectedMembers.length > 0 && (
          <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
            {selectedMembers.map((userId) => {
              const profile = getUserProfileFromMap(userId);
              return (
                <Chip
                  key={userId}
                  label={profile.nickname}
                  onDelete={() => toggleMemberSelection(userId)}
                  avatar={<Avatar src={profile.avatarurl} />}
                />
              );
            })}
          </Box>
        )}

        <List sx={{ maxHeight: 300, overflow: 'auto' }}>
          {filteredUsers.map((u) => (
            <ListItem
              key={u.userId}
              button
              onClick={() => toggleMemberSelection(u.userId)}
            >
              <Checkbox checked={selectedMembers.includes(u.userId)} />
              <ListItemAvatar>
                <Avatar src={u.avatarurl}>
                  {u.nickname?.charAt(0).toUpperCase()}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={u.nickname} secondary={u.userId} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleCreate}
          variant="contained"
          disabled={!groupName.trim() || selectedMembers.length === 0}
        >
          Create Group
        </Button>
      </DialogActions>
    </Dialog>
  );
};
