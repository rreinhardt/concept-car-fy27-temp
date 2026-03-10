/** Inline SVG icons used throughout the prototype. */

interface IconProps {
  size?: number
  className?: string
}

/** Apollo pinwheel logo — actual brand mark */
export function IconApolloLogo({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 303 303" fill="currentColor" className={className}>
      <path d="M166.362 110.96L166.312 0.721829C161.444 0.251801 156.492 0 151.507 0C139.371 0 127.571 1.44366 116.257 4.12954L149.862 109.987C151.759 115.946 144.507 120.545 139.925 116.298L53.2608 36.1922C40.9738 46.6671 30.3821 59.0725 21.939 72.9551L132.438 131.407C147.831 139.548 166.362 128.385 166.362 110.96Z" />
      <path d="M136.272 192.56L136.322 302.245C141.324 302.748 146.393 303 151.513 303C163.464 303 175.097 301.607 186.259 298.988L152.772 193.534C150.875 187.575 158.126 182.975 162.709 187.222L249.272 267.228C261.609 256.803 272.251 244.431 280.745 230.599L170.195 172.131C154.803 163.989 136.272 175.153 136.272 192.577V192.56Z" />
      <path d="M186.777 140.371L267.045 53.5167C256.571 41.1785 244.167 30.5357 230.285 22.0752L171.67 132.901C163.529 148.295 174.691 166.827 192.115 166.81L302.245 166.76C302.748 161.741 303 156.654 303 151.501C303 139.515 301.607 127.865 298.972 116.685L193.088 150.309C187.129 152.206 182.53 144.954 186.777 140.371Z" />
      <path d="M110.516 136.711L0.721779 136.761C0.251783 141.612 0 146.531 0 151.5C0 163.62 1.42677 175.387 4.11246 186.685L109.526 153.212C115.485 151.315 120.084 158.567 115.837 163.15L36.005 249.534C46.4457 261.822 58.7998 272.431 72.6311 280.875L130.944 170.62C139.085 155.226 127.923 136.694 110.499 136.694L110.516 136.711Z" />
    </svg>
  )
}

export function IconSearch({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function IconSparkle({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M8 1L9.5 6.5L15 8L9.5 9.5L8 15L6.5 9.5L1 8L6.5 6.5L8 1Z" fill="currentColor" />
    </svg>
  )
}

export function IconAssistant({ size = 14, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M7.42171 9.30882C8.13046 9.18685 8.84528 9.20254 9.52778 9.52816L11.6053 10.5791C10.5379 11.9502 8.87339 12.8333 7.0013 12.8333C6.17478 12.8333 5.38893 12.6602 4.67652 12.3503C4.90073 10.5847 6.09159 9.64897 7.42171 9.30882ZM1.61743 4.75154C3.50428 5.03697 4.35863 6.25414 4.7614 7.60327C4.93747 8.47407 4.86815 9.13627 4.43555 9.86993L3.4563 11.6319C2.06536 10.5657 1.16797 8.88795 1.16797 6.99999C1.16797 6.20304 1.32809 5.44353 1.61743 4.75154ZM10.4643 2.30598C11.902 3.36841 12.8346 5.07511 12.8346 6.99999C12.8346 7.77839 12.6806 8.52051 12.404 9.19945C10.4039 8.92126 9.44086 7.48317 9.17743 6.11134C9.074 5.39104 9.13041 4.66716 9.53233 3.99446L10.4643 2.30598ZM7.0013 1.16666C7.75859 1.16666 8.48163 1.31248 9.14552 1.57511C8.85636 3.52964 7.43169 4.62177 6.01407 4.8216C5.45006 4.87421 4.83474 4.85916 4.11141 4.47468L2.31413 3.52676C3.37707 2.09467 5.08083 1.16666 7.0013 1.16666Z" fill="currentColor" />
    </svg>
  )
}

export function IconChevronDown({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconChevronRight({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconChevronLeft({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconCheck({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M3 8L6.5 11.5L13 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconClose({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function IconLock({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 7V5C5 3.34 6.34 2 8 2C9.66 2 11 3.34 11 5V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function IconFilter({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M2 3H14M4 8H12M6 13H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function IconHome({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M2 8L8 2L14 8V14H10V10H6V14H2V8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

export function IconPeople({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M1 14C1 11.24 3.24 9 6 9C8.76 9 11 11.24 11 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="11.5" cy="5.5" r="2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M12 9C13.66 9 15 10.34 15 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export function IconMail({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <rect x="1.5" y="3" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M1.5 4.5L8 9L14.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconInbox({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M2 10L4 4H12L14 10V13H2V10Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M2 10H5L6 11.5H10L11 10H14" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

export function IconSequence({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <rect x="2" y="2" width="5" height="3" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="2" y="7" width="5" height="3" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="2" y="12" width="5" height="3" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <path d="M7 3.5H10V13.5H7" stroke="currentColor" strokeWidth="1.3" />
      <path d="M10 8.5H13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

export function IconChart({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <rect x="2" y="8" width="3" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.3" />
      <rect x="6.5" y="5" width="3" height="9" rx="0.5" stroke="currentColor" strokeWidth="1.3" />
      <rect x="11" y="2" width="3" height="12" rx="0.5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}

export function IconGlobe({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
      <ellipse cx="8" cy="8" rx="3" ry="6" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2 8H14" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}

export function IconPlus({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function IconBriefcase({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <rect x="1.5" y="5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 5V3.5C5 2.67 5.67 2 6.5 2H9.5C10.33 2 11 2.67 11 3.5V5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export function IconBuilding({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <rect x="2" y="2" width="8" height="12" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="10" y="6" width="4" height="8" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="4" y="4" width="2" height="2" rx="0.5" fill="currentColor" />
      <rect x="4" y="8" width="2" height="2" rx="0.5" fill="currentColor" />
      <rect x="7" y="4" width="1.5" height="2" rx="0.5" fill="currentColor" />
      <rect x="7" y="8" width="1.5" height="2" rx="0.5" fill="currentColor" />
    </svg>
  )
}

export function IconSignal({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M3 12C3 9.24 5.24 7 8 7C10.76 7 13 9.24 13 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5 12C5 10.34 6.34 9 8 9C9.66 9 11 10.34 11 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="12" r="1" fill="currentColor" />
    </svg>
  )
}

export function IconTag({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M2 2H8L14 8L8 14L2 8V2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="5.5" cy="5.5" r="1" fill="currentColor" />
    </svg>
  )
}

export function IconStar({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M8 1.5L9.8 5.9L14.5 6.3L10.9 9.5L12 14.1L8 11.6L4 14.1L5.1 9.5L1.5 6.3L6.2 5.9L8 1.5Z" fill="currentColor" />
    </svg>
  )
}

export function IconArrowLeft({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconArrowRight({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconTasks({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.5 8L7.5 10L10.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconWorkflows({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M8 2V6M8 10V14M4 8H2M14 8H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export function IconSettings({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
      <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.892 3.433-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.892-1.64-.901-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.47l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
    </svg>
  )
}

export function IconPhone({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M3 2.5C3 2.22 3.22 2 3.5 2H6L7 5.5L5.5 6.5C6.2 8.14 7.86 9.8 9.5 10.5L10.5 9L14 10V12.5C14 12.78 13.78 13 13.5 13C7.7 13 3 8.3 3 2.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  )
}

export function IconCalendar({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2 6.5H14" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5 1.5V3.5M11 1.5V3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

export function IconChat({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M2 3C2 2.45 2.45 2 3 2H13C13.55 2 14 2.45 14 3V10C14 10.55 13.55 11 13 11H5L2 14V3Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  )
}

export function IconDataEnrich({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 2V4M8 12V14M2 8H4M12 8H14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M4.34 4.34L5.76 5.76M10.24 10.24L11.66 11.66" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

export function IconBookmark({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M3 2.5C3 2.22 3.22 2 3.5 2H12.5C12.78 2 13 2.22 13 2.5V14L8 11L3 14V2.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  )
}

export function IconDollar({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M8 2V14M5 5.5C5 4.12 6.34 3 8 3C9.66 3 11 4.12 11 5.5C11 6.88 9.66 8 8 8C6.34 8 5 9.12 5 10.5C5 11.88 6.34 13 8 13C9.66 13 11 11.88 11 10.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

export function IconFire({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M8 1C8 1 3 6 3 9.5C3 12.54 5.24 14 8 14C10.76 14 13 12.54 13 9.5C13 6 8 1 8 1Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M8 8C8 8 6 10 6 11C6 12.1 6.9 13 8 13C9.1 13 10 12.1 10 11C10 10 8 8 8 8Z" fill="currentColor" opacity="0.3" />
    </svg>
  )
}

export function IconTrending({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M2 12L6 7L9 10L14 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 4H14V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconPanelLeft({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <rect x="1.5" y="2" width="13" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5.5 2V14" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}

export function IconRobot({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <rect x="3" y="5" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 5V3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="8" cy="2" r="1" fill="currentColor" />
      <circle cx="6" cy="9" r="1" fill="currentColor" />
      <circle cx="10" cy="9" r="1" fill="currentColor" />
      <path d="M1 8V11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M15 8V11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

export function IconSpreadsheet({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <rect x="2" y="2" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2 5.5H14" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2 9H14" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5.5 5.5V14" stroke="currentColor" strokeWidth="1.3" />
      <path d="M10 5.5V14" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}

export function IconClock({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 4.5V8L10.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconInfo({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 7V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="5" r="0.75" fill="currentColor" />
    </svg>
  )
}

export function IconPlay({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M5 3L13 8L5 13V3Z" fill="currentColor" />
    </svg>
  )
}

export function IconCoin({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <ellipse cx="8" cy="5" rx="5.5" ry="2.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M2.5 5v3c0 1.38 2.46 2.5 5.5 2.5s5.5-1.12 5.5-2.5V5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M2.5 8v3c0 1.38 2.46 2.5 5.5 2.5s5.5-1.12 5.5-2.5V8" stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  )
}

export function IconDragHandle({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="6" cy="4" r="1" fill="currentColor" />
      <circle cx="10" cy="4" r="1" fill="currentColor" />
      <circle cx="6" cy="8" r="1" fill="currentColor" />
      <circle cx="10" cy="8" r="1" fill="currentColor" />
      <circle cx="6" cy="12" r="1" fill="currentColor" />
      <circle cx="10" cy="12" r="1" fill="currentColor" />
    </svg>
  )
}
