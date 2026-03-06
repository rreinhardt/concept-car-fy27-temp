import './Avatar.css'

interface AvatarProps {
  initials: string
  size?: 'sm' | 'md' | 'lg'
  color?: string
  className?: string
}

const COLORS = [
  '#E8D5E0', '#D5DDE8', '#D5E8DB', '#E8E0D5', '#D5D8E8',
  '#E0D5E8', '#D5E8E8', '#E8D5D5',
]

function getColor(initials: string): string {
  const code = initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)
  return COLORS[code % COLORS.length]
}

export default function Avatar({
  initials,
  size = 'md',
  color,
  className = '',
}: AvatarProps) {
  const bg = color || getColor(initials)

  return (
    <div
      className={`avatar avatar-${size} ${className}`}
      style={{ backgroundColor: bg }}
    >
      {initials}
    </div>
  )
}
