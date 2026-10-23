import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import { useRef } from 'react';

const PHOTO_SIZE = 72;

export function SettingsPhotoField({
  avatarSrc,
  displayName,
  roleLabel = 'Admin',
  onSelectFile,
}) {
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
      <Stack direction="row" spacing={2} alignItems="center">
        <Box sx={{ position: 'relative', width: PHOTO_SIZE, height: PHOTO_SIZE, flexShrink: 0 }}>
          <Avatar
            src={avatarSrc}
            alt={displayName}
            sx={{
              width: PHOTO_SIZE,
              height: PHOTO_SIZE,
              border: `1px solid ${theme.palette.borderSubtle1}`,
            }}
          />
          <IconButton
            size="small"
            aria-label="Change photo"
            onClick={openFilePicker}
            sx={{
              position: 'absolute',
              right: -4,
              bottom: -4,
              width: 28,
              height: 28,
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.common.white,
              border: `2px solid ${theme.palette.surfaceWhite}`,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark ?? theme.palette.primary.main,
              },
            }}
          >
            <PhotoCameraOutlinedIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>

        <Stack spacing={0.25} alignItems="flex-start">
          <Typography sx={{ fontSize: 16, fontWeight: 600, lineHeight: '24px', color: theme.palette.textPrimary }}>
            {displayName || 'User'}
          </Typography>
          <Typography sx={{ fontSize: 14, lineHeight: '20px', color: theme.palette.textSecondary3 }}>{roleLabel}</Typography>
          <Box
            component="button"
            type="button"
            onClick={openFilePicker}
            sx={{
              mt: 0.5,
              border: 0,
              background: 'none',
              p: 0,
              cursor: 'pointer',
              font: 'inherit',
              fontSize: 14,
              fontWeight: 500,
              lineHeight: '20px',
              color: theme.palette.textBrand,
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Change photo
          </Box>
        </Stack>
      </Stack>
      <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleInputChange} />
    </>
  );
}
