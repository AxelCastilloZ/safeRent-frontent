import { useTranslation } from 'react-i18next';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useAuth } from '../hooks/authHooks';

export default function AuthActions({ onAction }: { onAction?: () => void }) {
  const { t } = useTranslation();
  const { user, hasSession, logout } = useAuth();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const fullName = user ? `${user.name} ${user.surname1}`.trim() : t("navigation:account");
  const initials = user
    ? `${Array.from(user.name.trim())[0] ?? ''}${Array.from(user.surname1.trim())[0] ?? ''}`.toLocaleUpperCase()
    : undefined;

  if (!hasSession) return (
    <>
      <Link to="/login" onClick={onAction} className="rounded-lg px-3 py-2 text-sm font-semibold text-primary hover:bg-slate-100">{t("auth:signIn")}</Link>
      <Link to="/register" onClick={onAction} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark">{t("auth:signUp")}</Link>
    </>
  );

  return (
    <>
      <IconButton aria-label={t('navigation:accountMenu', { name: fullName })} aria-controls={anchor ? 'account-menu' : undefined}
        aria-haspopup="true" aria-expanded={Boolean(anchor)} onClick={(event) => setAnchor(event.currentTarget)}>
        <Avatar sx={{ bgcolor: '#0a2540', width: 40, height: 40, fontSize: 16, fontWeight: 600 }}>{initials}</Avatar>
      </IconButton>
      <Menu id="account-menu" anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}
        slotProps={{ paper: { sx: { mt: 0.75, minWidth: 224, borderRadius: '12px', border: '1px solid #e2e8f0', color: '#0a2540', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' } }, list: { sx: { p: '6px', '& .MuiMenuItem-root': { borderRadius: '8px', px: 1.5, py: 1, fontSize: '14px', '&:hover, &.Mui-focusVisible': { bgcolor: '#f1f5f9' } } } } }}>
        <MenuItem disabled>{fullName}</MenuItem>
        <MenuItem onClick={() => { setAnchor(null); logout(); onAction?.(); }}>{t("navigation:logout")}</MenuItem>
      </Menu>
    </>
  );
}
