import { alpha, styled, Tabs } from "@mui/material";

export const TabWrapper = styled(Tabs)(({ theme }) => ({
  flex: 1,
  padding: '16px 0',

  '.MuiTabs-flexContainer': {
    borderBottom: 'none'
  },

  '.MuiTabs-indicator': {
    display: 'none'
  },

  '.MuiTab-root': {
    borderRadius: 2,
    color: theme.palette.grey[800],
    marginBottom: 8,
    gap: 4,
    textAlign: 'left',
    textTransform: 'none',

    '&:last-child': {
      marginBottom: 0
    },

    '&.Mui-selected, &:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.32),
      color: theme.palette.grey[800]
    },

    '&.Mui-selected': {
      borderRight: `2px solid ${theme.palette.primary.main}`
    }
  }
}));