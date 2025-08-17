import { useEffect, useMemo, useState, ChangeEvent } from 'react'
import { useParams } from 'react-router-dom'
import { fetchMovie, fetchReviews, createReview, updateReview, deleteReviewById, updateMovie } from '../api'
import { Movie, Review, ReviewForm, MovieUpdateForm } from '../types'
import { useAuth } from '../context/AuthProvider'

export default function MovieDetail() {
  const params = useParams()
  const id = Number(params.id)
  const { username } = useAuth()

  const [movie, setMovie] = useState<Movie | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // --- Review form ---
  const [reviewForm, setReviewForm] = useState<ReviewForm>({ rating: 5, comment: '' })
  const myReview = useMemo(() => {
    if (!username) return null
    const list = Array.isArray(reviews) ? reviews : []
    return list.find(r => r.user === username) ?? null
  }, [reviews, username])

  // --- Edit movie (owner only) ---
  const [editOpen, setEditOpen] = useState(false)
  const [editForm, setEditForm] = useState<MovieUpdateForm>({
    title: '', description: '', director: '', main_actors: '', release_year: 2000, poster: null
  })

  async function load() {
    setLoading(true)
    const [m, revs] = await Promise.all([fetchMovie(id), fetchReviews(id)])
    setMovie(m)
    setReviews(revs)
    setLoading(false)
  }
  useEffect(() => { load() }, [id])

  
  useEffect(() => {
    if (movie) {
      setEditForm({
        title: movie.title,
        description: movie.description,
        director: movie.director,
        main_actors: movie.main_actors,
        release_year: movie.release_year ?? 2000,
        poster: null,
      })
    }
  }, [movie])

  
  useEffect(() => {
    if (myReview) setReviewForm({ rating: myReview.rating, comment: myReview.comment })
    else setReviewForm({ rating: 5, comment: '' })
  }, [myReview])

  // --- Review handlers ---
  async function submitReview(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!username) return
    if (myReview) await updateReview(myReview.id, reviewForm)
    else await createReview(id, reviewForm)
    await load()
  }
  async function removeReview() {
    if (!myReview) return
    if (!confirm('Delete your review?')) return
    await deleteReviewById(myReview.id)
    await load()
  }

  // --- Edit movie handlers ---
  function onEditChange<K extends keyof MovieUpdateForm>(k: K, v: MovieUpdateForm[K]) {
    setEditForm(s => ({ ...s, [k]: v }))
  }
  function onPosterChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null
    onEditChange('poster', f)
  }
  async function submitEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!movie) return
    await updateMovie(movie.id, editForm)
    await load()
    setEditOpen(false)
  }

  if (loading || !movie) return <div className="max-w-5xl mx-auto px-4 py-6">Loading…</div>

  const isOwner = username && movie.owner && username === movie.owner

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 grid gap-6">
      <div className="grid grid-cols-1 md:grid-cols-[260px,1fr] gap-6">
        <div className="aspect-[2/3] rounded-md overflow-hidden bg-black/40 ring-1 ring-white/5">
          {movie.poster ? (
            <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full grid place-items-center text-sm text-gray-500">No poster</div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold text-white/90">{movie.title}</h2>
            {isOwner && (
              <button
                className="text-xs border border-white/20 rounded px-3 py-1 hover:bg-white/10"
                onClick={() => setEditOpen(o => !o)}
              >
                {editOpen ? 'Cancel' : 'Edit'}
              </button>
            )}
          </div>
          <p className="text-sm text-gray-400">{movie.director} • {movie.release_year}</p>
          <p className="text-sm text-gray-300"><b>Actors:</b> {movie.main_actors}</p>
          <p className="mt-3 text-gray-200">{movie.description}</p>
          <div className="mt-2 text-sm text-gray-400">
            <b>Avg rating:</b> {movie.average_rating ?? '-'} • <b>Reviews:</b> {movie.reviews_count}
          </div>

          {/* EDIT FORM (owner) */}
          {isOwner && editOpen && (
            <form onSubmit={submitEdit} className="mt-3 bg-surface-2 border border-white/10 rounded-xl p-3 grid gap-2 md:grid-cols-3">
              <input
                className="bg-surface border border-white/10 rounded px-3 py-2"
                placeholder="Title *"
                value={editForm.title}
                onChange={e => onEditChange('title', e.target.value)}
                required
              />
              <input
                className="bg-surface border border-white/10 rounded px-3 py-2 md:col-span-2"
                placeholder="Description *"
                value={editForm.description}
                onChange={e => onEditChange('description', e.target.value)}
                required
              />
              <input
                className="bg-surface border border-white/10 rounded px-3 py-2"
                placeholder="Director *"
                value={editForm.director}
                onChange={e => onEditChange('director', e.target.value)}
                required
              />
              <input
                className="bg-surface border border-white/10 rounded px-3 py-2 md:col-span-2"
                placeholder="Main actors (comma-separated) *"
                value={editForm.main_actors}
                onChange={e => onEditChange('main_actors', e.target.value)}
                required
              />
              <input
                type="number"
                min={1888}
                max={9999}
                className="bg-surface border border-white/10 rounded px-3 py-2"
                placeholder="Release year *"
                value={editForm.release_year}
                onChange={e => onEditChange('release_year', Number(e.target.value))}
                required
              />
              <input
                type="file"
                accept="image/*"
                className="md:col-span-2 text-sm text-gray-300"
                onChange={onPosterChange}
              />
              <div className="md:col-span-3">
                <button className="text-sm border border-white/20 rounded px-3 py-2 hover:bg-white/10">Save changes</button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* REVIEWS */}
    <section className="grid gap-3">
  <h3 className="text-lg font-semibold text-white/90">Reviews</h3>

  {username ? (
    <form
      onSubmit={submitReview}
      className="bg-surface-2 border border-white/10 rounded-xl p-3 grid gap-2 md:grid-cols-[160px,1fr,auto]"
    >
      <select
        className="bg-surface border border-white/10 rounded px-3 py-2 text-lg md:text-xl"
        value={reviewForm.rating}
        onChange={e => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
        required
      >
        <option value={5}>★★★★★ 5</option>
        <option value={4}>★★★★☆ 4</option>
        <option value={3}>★★★☆☆ 3</option>
        <option value={2}>★★☆☆☆ 2</option>
        <option value={1}>★☆☆☆☆ 1</option>
      </select>

      <input
        className="bg-surface border border-white/10 rounded px-3 py-2"
        placeholder="Your comment"
        value={reviewForm.comment}
        onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
        required
      />

      <div className="flex gap-2 items-center">
        <button className="text-sm border border-white/20 rounded px-3 py-2 hover:bg-white/10">
          {myReview ? 'Update' : 'Publish'}
        </button>
        {myReview && (
          <button
            type="button"
            className="text-sm border border-white/20 rounded px-3 py-2 hover:bg-white/10"
            onClick={removeReview}
          >
            Delete
          </button>
        )}
      </div>
    </form>
  ) : (
    <div className="text-sm text-gray-400">Log in to add your review.</div>
  )}

  <div className="grid gap-2">
    {reviews.length === 0 && (
      <div className="text-sm text-gray-500">No reviews yet.</div>
    )}

    {(Array.isArray(reviews) ? reviews : []).map(r => (
      <div key={r.id} className="bg-surface-2 border border-white/10 rounded-lg p-2">
        
        <div className="text-sm text-gray-400 flex items-center justify-between min-h-[48px]">
          <span>
            <b className="text-white/80">{r.user}</b> • {new Date(r.created_at).toLocaleString()}
          </span>
          
          <span className="text-yellow-300 text-2xl md:text-3xl leading-[1.1] whitespace-nowrap shrink-0">
            {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
          </span>
        </div>

        <p className="mt-1 text-gray-200">{r.comment}</p>
      </div>
    ))}
  </div>
</section>
    </div>
  )
}
