import axios, { AxiosResponse } from 'axios'
import { AuthLoginResponse, AuthRegisterResponse, Movie, MovieForm, Review, ReviewForm, Paginated,MovieUpdateForm  } from './types'
export async function fetchMovies(): Promise<Movie[]> {
    const { data } = await api.get<Paginated<Movie>>('/movies/');
    return data.results;                
}
export async function createMovie(m: MovieForm): Promise<Movie> {
  const fd = new FormData()
  fd.append('title', m.title)
  fd.append('description', m.description)
  fd.append('director', m.director)
  fd.append('main_actors', m.main_actors)
  fd.append('release_year', String(m.release_year))
  fd.append('poster', m.poster)              

  
  const { data } = await api.post('movies/', fd)
  return data
}
export const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE })
api.interceptors.request.use(c => { const t = localStorage.getItem('token'); if (t) c.headers.Authorization = `Token ${t}`; return c })
api.interceptors.response.use(r => r, e => { console.error('API error:', e.response?.status, e.response?.data); return Promise.reject(e) })
export async function login(username: string, password: string): Promise<AuthLoginResponse> { const { data }: AxiosResponse<AuthLoginResponse> = await api.post('/auth/login/', { username, password }); localStorage.setItem('token', data.token); localStorage.setItem('username', data.username); return data }
export async function registerUser(form: { username: string; password: string; email?: string }): Promise<AuthRegisterResponse> { const { data }: AxiosResponse<AuthRegisterResponse> = await api.post('/auth/register/', form); localStorage.setItem('token', data.token); localStorage.setItem('username', data.username); return data }
export async function logout(): Promise<void> { try { await api.post('/auth/logout/') } catch { } localStorage.removeItem('token'); localStorage.removeItem('username') }
export async function fetchMovie(id: number): Promise<Movie> { const { data }: AxiosResponse<Movie> = await api.get(`/movies/${id}/`); return data }
export async function deleteMovie(id: number): Promise<void> { await api.delete(`/movies/${id}/`) }
export async function createReview(movieId: number, form: ReviewForm): Promise<Review> { const { data }: AxiosResponse<Review> = await api.post(`/movies/${movieId}/reviews/`, form); return data }
export async function updateReview(reviewId: number, form: ReviewForm): Promise<Review> { const { data }: AxiosResponse<Review> = await api.patch(`/reviews/${reviewId}/`, form); return data }
export async function deleteReviewById(reviewId: number): Promise<void> { await api.delete(`/reviews/${reviewId}/`) }
export async function fetchReviews(movieId: number): Promise<Review[]> {
    const { data } = await api.get<Review[] | Paginated<Review>>(
        `movies/${movieId}/reviews/`   // ojo: sin "/" inicial
    );
    if (Array.isArray(data)) return data;
    if (data && Array.isArray((data as Paginated<Review>).results)) {
        return (data as Paginated<Review>).results;
    }
    console.warn('Unexpected /reviews/ payload:', data);
    return [];
}

export async function updateMovie(id: number, m: MovieUpdateForm): Promise<Movie> {
  const fd = new FormData()
  fd.append('title', m.title)
  fd.append('description', m.description)
  fd.append('director', m.director)
  fd.append('main_actors', m.main_actors)
  fd.append('release_year', String(m.release_year))
  if (m.poster) fd.append('poster', m.poster) 

  
  const { data } = await api.patch<Movie>(`movies/${id}/`, fd)
  return data
}