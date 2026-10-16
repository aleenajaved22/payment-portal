import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Button, TextField } from '../components/design-system';
import bgCircles from '../assets/login/bg-circles.svg';
import bgGradient from '../assets/login/bg-gradient.svg';
import filtergoWordmark from '../assets/login/filtergo-wordmark.svg';
import iconEye from '../assets/login/icon-eye.svg';
import iconLock from '../assets/login/icon-lock.svg';
import iconMail from '../assets/login/icon-mail.svg';

const FILTERGO_GREEN = '#2DA511';
const FILTERGO_GREEN_HOVER = '#25910E';

const inputIconSx = { width: 20, height: 20, display: 'block' };

function LoginField({ label, helperText, children }) {
  const theme = useTheme();

  return (
    <Box sx={{ width: '100%' }}>
      <Typography
        component="label"
        sx={{
          display: 'block',
          mb: '6px',
          fontSize: 14,
          lineHeight: '20px',
          color: theme.palette.textSecondary3,
        }}
      >
        {label}
      </Typography>
      {children}
      {helperText ? (
        <Typography sx={{ mt: '6px', fontSize: 12, color: theme.palette.textAlert }}>{helperText}</Typography>
      ) : null}
    </Box>
  );
}

export function LoginPage() {
  const theme = useTheme();
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  if (isAuthenticated) {
    const redirectTo = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};

    if (!email.trim()) {
      nextErrors.email = 'Email is required';
    }
    if (!password.trim()) {
      nextErrors.password = 'Password is required';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    login(email);
    navigate('/dashboard', { replace: true });
  };

  const inputRootSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      backgroundColor: theme.palette.surfaceWhite,
      px: '14px',
      py: '10px',
      '& fieldset': {
        borderColor: theme.palette.borderSubtle1,
      },
      '&:hover fieldset': {
        borderColor: theme.palette.borderSubtle2,
      },
      '&.Mui-focused fieldset': {
        borderColor: FILTERGO_GREEN,
      },
    },
    '& .MuiOutlinedInput-input': {
      fontSize: 16,
      lineHeight: '24px',
      letterSpacing: '0.5px',
      py: 0,
      px: 0,
      '&::placeholder': {
        color: theme.palette.textPlaceholderField,
        opacity: 1,
      },
    },
    '& .MuiInputLabel-root': {
      display: 'none',
    },
  };

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        backgroundColor: theme.palette.surfaceWhite,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Box
        component="img"
        src={bgGradient}
        alt=""
        aria-hidden
        sx={{
          position: 'absolute',
          width: 1560,
          height: 974,
          left: -66,
          top: -438,
          maxWidth: 'none',
          pointerEvents: 'none',
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          pointerEvents: 'none',
        }}
      />
      <Box
        component="img"
        src={bgCircles}
        alt=""
        aria-hidden
        sx={{
          position: 'absolute',
          width: 1300,
          height: 1300,
          left: '50%',
          top: 270,
          transform: 'translateX(-50%)',
          maxWidth: 'none',
          pointerEvents: 'none',
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(217, 217, 217, 0.01)',
          boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
          pointerEvents: 'none',
        }}
      />

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 490,
          p: '40px',
          borderRadius: '20px',
          border: '0.5px solid rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          backgroundImage:
            'linear-gradient(135.84deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.5) 98.77%)',
          boxShadow: '0px 4px 120px 0px rgba(1, 19, 48, 0.08)',
        }}
      >
        <Stack spacing="40px" alignItems="center">
          <Box
            component="img"
            src={filtergoWordmark}
            alt="Filtergo"
            sx={{ width: 120, height: 36.5, display: 'block', objectFit: 'contain' }}
          />

          <Stack spacing="36px" sx={{ width: '100%' }}>
            <Stack spacing="36px" alignItems="center" sx={{ width: '100%' }}>
              <Stack spacing="4px" alignItems="center" textAlign="center">
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: 24,
                    lineHeight: '36px',
                    color: theme.palette.textPrimary,
                  }}
                >
                  Welcome to Customer Portal
                </Typography>
                <Typography
                  sx={{
                    fontSize: 14,
                    lineHeight: '20px',
                    color: theme.palette.textSecondary2,
                  }}
                >
                  Sign in to access your invoices and reports.
                </Typography>
              </Stack>

              <Stack spacing={2} sx={{ width: '100%' }}>
                <LoginField label="Email" helperText={errors.email}>
                  <TextField
                    type="email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={Boolean(errors.email)}
                    placeholder="example@filter-go.com"
                    fullWidth
                    autoComplete="email"
                    sx={inputRootSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ mr: 1 }}>
                          <Box component="img" src={iconMail} alt="" sx={inputIconSx} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </LoginField>

                <Box sx={{ width: '100%' }}>
                  <LoginField label="Password" helperText={errors.password}>
                    <TextField
                      type={showPassword ? 'text' : 'password'}
                      variant="outlined"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      error={Boolean(errors.password)}
                      placeholder="********"
                      fullWidth
                      autoComplete="current-password"
                      sx={inputRootSx}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start" sx={{ mr: 1 }}>
                            <Box component="img" src={iconLock} alt="" sx={inputIconSx} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              type="button"
                              edge="end"
                              onClick={() => setShowPassword((prev) => !prev)}
                              sx={{ p: 0.5 }}
                              aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                              <Box component="img" src={iconEye} alt="" sx={{ width: 16, height: 16, display: 'block' }} />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </LoginField>
                  <Link
                    href="#"
                    underline="none"
                    onClick={(e) => e.preventDefault()}
                    sx={{
                      display: 'block',
                      mt: '6px',
                      textAlign: 'right',
                      fontSize: 14,
                      lineHeight: '20px',
                      color: FILTERGO_GREEN,
                    }}
                  >
                    Forgot Password?
                  </Link>
                </Box>
              </Stack>
            </Stack>

            <Button
              variant="primary"
              type="submit"
              fullWidth
              sx={{
                height: 40,
                backgroundColor: FILTERGO_GREEN,
                borderColor: FILTERGO_GREEN,
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: FILTERGO_GREEN_HOVER,
                  borderColor: FILTERGO_GREEN_HOVER,
                },
                '&:active': {
                  backgroundColor: FILTERGO_GREEN,
                  borderColor: FILTERGO_GREEN,
                },
              }}
            >
              Login
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
