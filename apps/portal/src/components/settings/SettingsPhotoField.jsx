import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useRef } from 'react';
import { Button } from '../design-system';

const PHOTO_SIZE = 96;

const photoCircleFrameSx = (theme) => ({
  width: PHOTO_SIZE,
  height: PHOTO_SIZE,
  flexShrink: 0,
  borderRadius: '50%',
  border: `1px solid ${theme.palette.borderSubtle1}`,
  overflow: 'hidden',
});

export function SettingsPhotoField({ avatarSrc, hasCustomPhoto, onSelectFile, onDeletePhoto }) {
  const theme = useTheme();
  const fileInputRef = useRef(null);

  const openFilePicker = () => fileInputRef.current?.click();

  const handleInputChange = (event) => {
    const file = event.target.files?.[0];
    if (file) onSelectFile(file);
    event.target.value = '';
  };

  return (
    <>
      <Stack direction="row" spacing={2.5} alignItems="center">
        {hasCustomPhoto ? (
          <Box sx={photoCircleFrameSx(theme)}>
            <Avatar src={avatarSrc} alt="" sx={{ width: '100%', height: '100%' }} />
          </Box>
        ) : (
          <Box
            component="button"
            type="button"
            onClick={openFilePicker}
            aria-label="Add photo"
            sx={{
              ...photoCircleFrameSx(theme),
              backgroundColor: theme.palette.surfaceGreySubtle,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 1,
              font: 'inherit',
              '&:hover': {
                backgroundColor: theme.palette.borderSubtle1,
              },
            }}
          >
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 500,
                lineHeight: '20px',
                color: theme.palette.textSecondary2,
                textAlign: 'center',
              }}
            >
              Add Photo
            </Typography>
          </Box>
        )}

        {hasCustomPhoto ? (
          <Stack spacing={1} alignItems="flex-start">
            <Button
              variant="primary"
              onClick={openFilePicker}
              sx={{
                height: 36,
                px: 2,
                minWidth: 140,
                backgroundColor: theme.palette.textPrimary,
                borderColor: theme.palette.textPrimary,
                whiteSpace: 'nowrap',
                '&:hover': {
                  backgroundColor: theme.palette.textPrimary,
                  opacity: 0.92,
                },
              }}
            >
              Change picture
            </Button>
            <Button
              variant="secondaryGrey"
              onClick={onDeletePhoto}
              sx={{ height: 36, px: 2, minWidth: 140, whiteSpace: 'nowrap' }}
            >
              Delete picture
            </Button>
          </Stack>
        ) : null}
      </Stack>
      <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleInputChange} />
    </>
  );
}
