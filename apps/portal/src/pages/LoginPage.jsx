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

/** Artwork for the left panel — swap this single import for a photograph if desired. */
const HERO_ART = bgGradient;

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
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, md: 4 },
        backgroundColor: theme.palette.surfaceGreySubtle,
        backgroundImage: `repeating-linear-gradient(90deg, ${theme.palette.borderSubtle1} 0 1px, transparent 1px 48px)`,
        backgroundSize: '48px 100%',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 1040,
          display: 'flex',
          p: '12px',
          gap: '12px',
          borderRadius: '16px',
          border: `1px solid ${theme.palette.borderSubtle1}`,
          backgroundColor: theme.palette.surfaceWhite,
          boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
        }}
      >
        {/* Left — artwork panel */}
        <Box
          aria-hidden
          sx={{
            display: { xs: 'none', md: 'flex' },
            flex: '0 0 45%',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '12px',
            border: `1px solid ${theme.palette.borderSubtle1}`,
            backgroundColor: '#0F2417',
            alignItems: 'flex-end',
            minHeight: 560,
            p: '32px',
          }}
        >
          <Box
            component="img"
            src={HERO_ART}
            alt=""
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              maxWidth: 'none',
            }}
          />
          <Box
            component="img"
            src={bgCircles}
            alt=""
            sx={{
              position: 'absolute',
              width: 760,
              height: 760,
              left: '50%',
              top: '42%',
              transform: 'translate(-50%, -50%)',
              maxWidth: 'none',
              opacity: 0.9,
            }}
          />

          <Stack spacing="10px" sx={{ position: 'relative' }}>
            <Typography
              sx={{
                fontSize: 28,
                fontWeight: 700,
                lineHeight: '36px',
                color: '#ffffff',
              }}
            >
              Analytics that drive smarter security
            </Typography>
            <Typography
              sx={{
                fontSize: 14,
                lineHeight: '20px',
                color: 'rgba(255, 255, 255, 0.78)',
              }}
            >
              Track invoices, payments, and site reports in one place.
            </Typography>
          </Stack>
        </Box>

        {/* Right — login form */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: { xs: '20px', md: '48px' },
            py: { xs: '32px', md: '48px' },
          }}
        >
          <Stack spacing="32px" sx={{ width: '100%', maxWidth: 400 }}>
            <Box
              component="img"
              src={filtergoWordmark}
              alt="Filtergo"
              sx={{ width: 110, height: 33.5, display: 'block', objectFit: 'contain' }}
            />

            <Stack spacing="4px">
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: 24,
                  lineHeight: '32px',
                  color: theme.palette.textPrimary,
                }}
              >
                Welcome to Customer Portal
              </Typography>
              <Typography
                sx={{
                  fontSize: 14,
                  lineHeight: '20px',
                  color: theme.palette.textSecondary3,
                }}
              >
                Sign in to continue to your account
              </Typography>
            </Stack>

            <Stack spacing={2}>
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

              <Box>
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
        </Box>
      </Box>
    </Box>
  );
}
