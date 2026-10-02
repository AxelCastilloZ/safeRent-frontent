import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useAuth } from '../hooks/authHooks';

export default function AuthActions({ onAction }: { onAction?: () => void }) {
  const { user, hasSession, logout } = useAuth();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const fullName = user ? `${user.name} ${user.surname1}`.trim() : 'Mi cuenta';
  const initials = user
    ? `${Array.from(user.name.trim())[0] ?? ''}${Array.from(user.surname1.trim())[0] ?? ''}`.toLocaleUpperCase()
    : undefined;

  if (!hasSession) return (
    <>
      <Link to="/login" onClick={onAction} className="rounded-lg px-3 py-2 text-sm font-semibold text-primary hover:bg-slate-100">Iniciar sesión</Link>
      <Link to="/register" onClick={onAction} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark">Registrarse</Link>
    </>
  );

  return (
    <>
      <IconButton aria-label={`Abrir menú de ${fullName}`} aria-controls={anchor ? 'account-menu' : undefined}
        aria-haspopup="true" aria-expanded={Boolean(anchor)} onClick={(event) => setAnchor(event.currentTarget)}>
        <Avatar sx={{ bgcolor: '#0a2540', width: 40, height: 40, fontSize: 16, fontWeight: 600 }}>{initials}</Avatar>
      </IconButton>
      <Menu id="account-menu" anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        <MenuItem disabled>{fullName}</MenuItem>
        <MenuItem onClick={() => { setAnchor(null); logout(); onAction?.(); }}>Cerrar sesión</MenuItem>
      </Menu>
    </>
  );
}
