import { useMemo, useState } from 'react'
import { Movie } from '../types'
import { Link } from 'react-router-dom'

export interface MovieCardProps { movie: Movie }

export default function MovieCard({ movie }: MovieCardProps) {

  const [fit, setFit] = useState<'cover' | 'contain'>('contain')

  
  const API_ORIGIN = useMemo(
    () =>
      (import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000/api')
        .replace(/\/+$/, '')
        .replace(/\/api$/, ''),
    []
  )
  const src =
    movie.poster && !movie.poster.startsWith('http')
      ? API_ORIGIN + movie.poster
      : movie.poster || ''

  return (
    <Link to={`/movies/${movie.id}`} className="group block">
      <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-black/60 ring-1 ring-white/10">
        {src ? (
          <img
            src={src}
            alt={movie.title}
            loading="lazy"
            decoding="async"
            onLoad={(e) => {
              const img = e.currentTarget
              const ar = img.naturalWidth / img.naturalHeight
              
              setFit(ar < 0.75 ? 'cover' : 'contain')
            }}
            onError={(e) => {
              
              e.currentTarget.src =
                'data:image/svg+xml;utf8,' +
                encodeURIComponent(
                  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 450"><rect width="100%" height="100%" fill="#111"/><text x="50%" y="50%" fill="#888" font-family="sans-serif" font-size="16" text-anchor="middle">No poster</text></svg>`
                )
            }}
            className={`w-full h-full object-center transition-transform duration-300 group-hover:scale-[1.03] ${
              fit === 'cover' ? 'object-cover' : 'object-contain'
            }`}
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-sm text-gray-500">
            No poster
          </div>
        )}
      </div>
      <div className="mt-2 text-xs text-gray-300 line-clamp-1">{movie.title}</div>
    </Link>
  )
}