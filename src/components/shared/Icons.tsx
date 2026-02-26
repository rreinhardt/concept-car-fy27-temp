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
