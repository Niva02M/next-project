import { Box, styled } from '@mui/material';

export const TimeRangeWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '50%',

  '.react-datepicker': {
    borderRadius: '0',
    overflow: 'hidden',
    borderColor: theme.palette.primary.main,
    fontFamily: 'inherit',
    width: '100%',

    '&-time__header': {
      color: theme.palette.background.paper
    },

    '&-wrapper': {
      width: '100%'
    },

    '&__input-container': {
      width: '100%',

      input: {
        width: '100%',
        border: `1px solid ${theme.palette.grey[500]}`,
        borderRadius: 0,
        fontFamily: 'inherit',
        fontSize: '16px',
        lineHeight: 'calc(20/16)',
        color: theme.palette.grey[900],
        padding: '15px 14px',
        outline: 'none',

        '&::placeholder': {
          color: theme.palette.grey[400]
        }
      }
    },

    ' &__time-container': {
      width: '100%',

      '.react-datepicker__time': {
        '.react-datepicker__time-box': {
          width: '100%',

          'ul.react-datepicker__time-list': {
            'li.react-datepicker__time-list-item': {
              height: 'auto',
              padding: '7px 10px',

              ' &--selected ': {
                backgroundColor: theme.palette.primary.main,

                '&:hover ': {
                  backgroundColor: theme.palette.secondary.dark
                }
              }
            }
          }
        }
      }
    },

    '&__header': {
      backgroundColor: theme.palette.primary.main,
      borderBottomColor: theme.palette.background.paper,
      borderRadius: 0
    },

    '&__close-icon': {
      '&::after': {
        backgroundColor: theme.palette.grey[500]
      }
    },

    '&__tab-loop': {
      '.MuiStack-root &': {
        marginLeft: 0
      }
    },

    '&__triangle': {
      display: 'none'
    },

    '&-popper.datepicker-popper': {
      top: '52px !important',
      width: '100%',
      transform: 'none !important'
    }
  }
}));
