const sizeStyles = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-20 h-20 text-xl',
};

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  busy: 'bg-red-500',
  away: 'bg-yellow-500',
};

export function Avatar({ src, alt, initials, size = 'md', status, className = '' }) {
  const sizeClass = sizeStyles[size] || sizeStyles.md;

  return (
    <div className={`relative inline-flex items-center justify-center rounded-full shrink-0 ${sizeClass} ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt || 'Avatar'}
          className="w-full h-full rounded-full object-cover border border-(--border-default) bg-(--bg-surface)"
        />
      ) : (
        <div
          className="w-full h-full rounded-full flex items-center justify-center font-bold text-white border border-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.2)]"
          style={{ background: 'oklch(0.58 0.22 var(--accent-hue))' }}
        >
          {initials}
        </div>
      )}
      
      {status && (
        <span
          className={`absolute bottom-[5%] right-[5%] rounded-full border-2 border-(--bg-base) ${statusColors[status] || statusColors.offline}`}
          style={{ width: '25%', height: '25%', minWidth: '8px', minHeight: '8px' }}
        />
      )}
    </div>
  );
}
