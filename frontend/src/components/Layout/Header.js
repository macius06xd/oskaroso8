import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Menu as MenuIcon,
  CalendarToday,
  Person,
  AdminPanelSettings,
  EventNote,
  Logout,
  Login,
  PersonAdd,
  Home,
} from '@mui/icons-material';

import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
    navigate('/');
  };

  const navigateTo = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    handleMenuClose();
  };

  const menuItems = [
    { label: 'Strona główna', path: '/', icon: <Home /> },
    { label: 'Kalendarz', path: '/calendar', icon: <CalendarToday /> },
    ...(user ? [
      { label: 'Moje rezerwacje', path: '/my-reservations', icon: <EventNote /> },
      { label: 'Profil', path: '/profile', icon: <Person /> },
      ...(user.role === 'admin' ? [
        { label: 'Panel admina', path: '/admin', icon: <AdminPanelSettings /> },
      ] : []),
    ] : [
      { label: 'Logowanie', path: '/login', icon: <Login /> },
      { label: 'Rejestracja', path: '/register', icon: <PersonAdd /> },
    ]),
  ];

  const isActive = (path) => location.pathname === path;

  if (isMobile) {
    return (
      <>
        <AppBar position="sticky" elevation={2}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setMobileMenuOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, cursor: 'pointer' }}
              onClick={() => navigate('/')}
            >
              Kalendarz Rezerwacji
            </Typography>

            {user && (
              <IconButton
                size="small"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar
                  sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}
                >
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </Avatar>
              </IconButton>
            )}
          </Toolbar>
        </AppBar>

        {/* Mobile Drawer */}
        <Drawer
          anchor="left"
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        >
          <Box sx={{ width: 250 }}>
            <List>
              {menuItems.map((item) => (
                <ListItem
                  button
                  key={item.path}
                  onClick={() => navigateTo(item.path)}
                  selected={isActive(item.path)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItem>
              ))}
              {user && (
                <>
                  <Divider />
                  <ListItem button onClick={handleLogout}>
                    <ListItemIcon><Logout /></ListItemIcon>
                    <ListItemText primary="Wyloguj" />
                  </ListItem>
                </>
              )}
            </List>
          </Box>
        </Drawer>
      </>
    );
  }

  return (
    <AppBar position="sticky" elevation={2}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ cursor: 'pointer', mr: 4 }}
          onClick={() => navigate('/')}
        >
          Kalendarz Rezerwacji
        </Typography>

        <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
          <Button
            color="inherit"
            onClick={() => navigate('/')}
            sx={{
              backgroundColor: isActive('/') ? 'rgba(255,255,255,0.1)' : 'transparent',
            }}
          >
            Strona główna
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/calendar')}
            sx={{
              backgroundColor: isActive('/calendar') ? 'rgba(255,255,255,0.1)' : 'transparent',
            }}
          >
            Kalendarz
          </Button>
          
          {user && (
            <>
              <Button
                color="inherit"
                onClick={() => navigate('/my-reservations')}
                sx={{
                  backgroundColor: isActive('/my-reservations') ? 'rgba(255,255,255,0.1)' : 'transparent',
                }}
              >
                Moje rezerwacje
              </Button>
              
              {user.role === 'admin' && (
                <Button
                  color="inherit"
                  onClick={() => navigate('/admin')}
                  sx={{
                    backgroundColor: isActive('/admin') ? 'rgba(255,255,255,0.1)' : 'transparent',
                  }}
                >
                  Panel admina
                </Button>
              )}
            </>
          )}
        </Box>

        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              Witaj, {user.firstName}!
            </Typography>
            <IconButton
              size="small"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar
                sx={{ width: 36, height: 36, bgcolor: 'secondary.main' }}
              >
                {user.firstName?.[0]}{user.lastName?.[0]}
              </Avatar>
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              color="inherit"
              onClick={() => navigate('/login')}
              variant={isActive('/login') ? 'outlined' : 'text'}
            >
              Logowanie
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/register')}
              variant={isActive('/register') ? 'outlined' : 'text'}
            >
              Rejestracja
            </Button>
          </Box>
        )}

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={() => navigateTo('/profile')}>
            <Person sx={{ mr: 1 }} />
            Profil
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <Logout sx={{ mr: 1 }} />
            Wyloguj
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
