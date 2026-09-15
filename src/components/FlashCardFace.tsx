import React from 'react'

interface FlashCardFaceProps {
  content: string
  variant: 'front' | 'back'
  label: string
  hint?: string
  onClick?: () => void
  style?: React.CSSProperties
}

export default function FlashCardFace({
  content,
  variant,
  label,
  hint,
  onClick,
  style
}: FlashCardFaceProps) {
  const isFront = variant === 'front'

  const wrapperClass = isFront
    ? 'col-start-1 row-start-1 backface-hidden bg-[var(--color-ivory)] rounded-[32px] shadow-[0_12px_36px_rgba(28,43,69,0.07)] border border-gray-200/90 flex flex-col items-center p-6 sm:p-8 pt-16 pb-16 text-center select-none overflow-hidden'
    : 'col-start-1 row-start-1 backface-hidden bg-white rounded-[32px] shadow-[0_12px_36px_rgba(28,43,69,0.07)] border-2 border-[var(--color-gold)] flex flex-col items-center p-6 sm:p-8 pt-16 pb-16 text-center select-none overflow-hidden'

  const labelClass = isFront
    ? 'absolute top-6 text-xs font-bold uppercase tracking-widest text-[var(--color-navy)]/35'
    : 'absolute top-6 text-xs font-bold uppercase tracking-widest text-[var(--color-gold)]'

  const isLong = content.length > 120

  const contentBaseClass = 'font-serif leading-snug tracking-tight whitespace-pre-line w-full text-[var(--color-navy)]'
  
  const contentSpecificClass = isFront
    ? `font-bold ${isLong ? 'text-left text-lg sm:text-xl' : 'text-center text-xl sm:text-2xl md:text-3xl'}`
    : `font-semibold ${isLong ? 'text-left text-base sm:text-lg' : 'text-center text-lg sm:text-xl md:text-2xl'}`

  const hintWrapperClass = isFront
    ? 'absolute bottom-6 text-[var(--color-graphite)] text-xs sm:text-sm font-semibold opacity-60 flex items-center gap-1.5 bg-white/60 px-3.5 py-1.5 rounded-full border border-gray-200/60 shadow-xs'
    : 'absolute bottom-6 text-[var(--color-graphite)] text-xs sm:text-sm font-semibold opacity-60 flex items-center gap-1.5 bg-gray-50 px-3.5 py-1.5 rounded-full border border-gray-200/60 shadow-xs'

  return (
    <div className={wrapperClass} style={style} onClick={onClick}>
      <span className={labelClass}>
        {label}
      </span>
      
      <div className="flex-1 flex flex-col justify-center items-center w-full min-h-0 overflow-y-auto custom-scrollbar py-2">
        {isFront ? (
          <h3 className={`${contentBaseClass} ${contentSpecificClass}`}>
            {content}
          </h3>
        ) : (
          <p className={`${contentBaseClass} ${contentSpecificClass}`}>
            {content}
          </p>
        )}
      </div>

      {hint && (
        <div className={hintWrapperClass}>
          <span>{hint}</span>
        </div>
      )}
    </div>
  )
}
