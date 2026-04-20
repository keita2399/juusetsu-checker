'use client';
import React from 'react';
import { BRAND, FONT_SANS, FONT_DISP, FONT_NUM, SignalKind } from '@/lib/brand';
import { Icon, ICONS, IconName } from './Icon';

// ── SignalPill ─────────────────────────────────────────────────────
interface SignalPillProps { kind?: SignalKind; children: React.ReactNode; size?: 'sm' | 'md'; }
export function SignalPill({ kind = 'risk', children, size = 'md' }: SignalPillProps) {
  const s = BRAND[kind];
  const emoji = { risk:'🔴', watch:'🟡', ok:'✅', info:'📝' }[kind];
  const padY = size === 'sm' ? 3 : 5;
  const padX = size === 'sm' ? 9 : 11;
  const fs   = size === 'sm' ? 12 : 13;
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:6,
      padding:`${padY}px ${padX}px`, borderRadius:999,
      background:s.bg, color:s.fg,
      fontFamily:FONT_SANS, fontSize:fs, fontWeight:700, lineHeight:1,
      whiteSpace:'nowrap',
    }}>
      <span aria-hidden style={{fontSize: fs+1, lineHeight:1}}>{emoji}</span>
      {children}
    </span>
  );
}

// ── Button ─────────────────────────────────────────────────────────
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  onClick?: () => void;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  disabled?: boolean;
}
export function Button({ children, variant = 'primary', size = 'md', fullWidth, onClick, leading, trailing, disabled }: ButtonProps) {
  const sizes = {
    sm: { padding:'8px 14px', fontSize:13, borderRadius:8 },
    md: { padding:'12px 18px', fontSize:15, borderRadius:10 },
    lg: { padding:'16px 22px', fontSize:16, borderRadius:12 },
    xl: { padding:'18px 26px', fontSize:17, borderRadius:14 },
  };
  const variants: Record<string, React.CSSProperties> = {
    primary:   { background:BRAND.navy, color:'#fff', boxShadow:'0 2px 4px rgba(15,42,59,0.1)' },
    secondary: { background:'#fff', color:BRAND.navy, border:`1.5px solid ${BRAND.border2}` },
    ghost:     { background:'transparent', color:BRAND.navy },
    danger:    { background:BRAND.risk.fg, color:'#fff' },
  };
  return (
    <button onClick={disabled ? undefined : onClick} style={{
      fontFamily:FONT_SANS, fontWeight:700,
      display:'inline-flex', alignItems:'center', justifyContent:'center', gap:10,
      border:0, cursor: disabled ? 'not-allowed' : 'pointer',
      transition:'all .15s ease-out',
      width: fullWidth ? '100%' : undefined,
      opacity: disabled ? 0.4 : 1,
      ...sizes[size],
      ...variants[variant],
    }}>
      {leading}{children}{trailing}
    </button>
  );
}

// ── Card ───────────────────────────────────────────────────────────
interface CardProps { children: React.ReactNode; style?: React.CSSProperties; onClick?: () => void; padding?: number; }
export function Card({ children, style = {}, onClick, padding = 18 }: CardProps) {
  return (
    <div onClick={onClick} style={{
      background:'#fff', border:`1px solid ${BRAND.border}`, borderRadius:12,
      padding, boxShadow:'0 2px 4px rgba(15,42,59,0.06),0 1px 2px rgba(15,42,59,0.04)',
      cursor: onClick ? 'pointer' : 'default', transition:'all .18s ease-out',
      ...style,
    }}>{children}</div>
  );
}

// ── AppBar ─────────────────────────────────────────────────────────
interface AppBarProps { title: string; subtitle?: string; leading?: React.ReactNode; trailing?: React.ReactNode; }
export function AppBar({ title, subtitle, leading, trailing }: AppBarProps) {
  return (
    <div style={{
      padding:'16px 16px 10px', display:'flex', alignItems:'center', gap:10,
      background:'rgba(255,255,255,0.92)', backdropFilter:'blur(10px)',
      borderBottom:`1px solid ${BRAND.border}`, position:'sticky', top:0, zIndex:5,
    }}>
      {leading}
      <div style={{flex:1, minWidth:0}}>
        <div style={{fontFamily:FONT_DISP, fontSize:17, fontWeight:700, color:BRAND.ink800, lineHeight:1.3}}>{title}</div>
        {subtitle && <div style={{fontSize:11, color:BRAND.ink400, marginTop:2}}>{subtitle}</div>}
      </div>
      {trailing}
    </div>
  );
}

// ── IconBtn ────────────────────────────────────────────────────────
interface IconBtnProps { icon: IconName; onClick?: () => void; style?: React.CSSProperties; }
export function IconBtn({ icon, onClick, style = {} }: IconBtnProps) {
  return (
    <button onClick={onClick} style={{
      width:36, height:36, borderRadius:999, background:BRAND.soft, border:0, cursor:'pointer',
      display:'flex', alignItems:'center', justifyContent:'center', color:BRAND.ink700,
      ...style,
    }}>
      <Icon d={ICONS[icon]} size={20}/>
    </button>
  );
}

// ── SectionHead ────────────────────────────────────────────────────
interface SectionHeadProps { icon: string | readonly string[]; children: React.ReactNode; }
export function SectionHead({ icon, children }: SectionHeadProps) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, margin:'22px 4px 10px', color:BRAND.ink500 }}>
      <Icon d={icon} size={16} stroke={BRAND.ink500}/>
      <div style={{fontFamily:FONT_DISP, fontSize:13, fontWeight:700, letterSpacing:'.02em'}}>{children}</div>
    </div>
  );
}
