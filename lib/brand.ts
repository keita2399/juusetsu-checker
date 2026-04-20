export const BRAND = {
  navy:   '#3577A6',
  navyD:  '#1C4A6E',
  gold:   '#E8B84A',
  sage:   '#6BA368',
  bg:     '#FAFBFC',
  surface:'#FFFFFF',
  soft:   '#F4F6F8',
  border: '#E8ECF0',
  border2:'#D5DBE1',
  ink800: '#1E272F',
  ink700: '#2E3942',
  ink600: '#434F5C',
  ink500: '#5F6B78',
  ink400: '#8792A0',
  risk:   { bg:'#FDECEC', bd:'#F4C5C5', fg:'#B4343A', strong:'#8F2228' },
  watch:  { bg:'#FEF5E3', bd:'#F2DCA3', fg:'#96660E', strong:'#6E4A07' },
  ok:     { bg:'#ECF4EA', bd:'#C4DCBE', fg:'#3D7239', strong:'#2A5527' },
  info:   { bg:'#EEF5FB', bd:'#BED9ED', fg:'#27608A', strong:'#1C4A6E' },
} as const;

export const FONT_SANS = "'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', system-ui, sans-serif";
export const FONT_DISP = "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif";
export const FONT_NUM  = "'Inter', 'Noto Sans JP', system-ui, sans-serif";

export type SignalKind = 'risk' | 'watch' | 'ok' | 'info';
