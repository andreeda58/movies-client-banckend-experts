// src/api/movies.ts
import { AxiosResponse } from 'axios'
import api from './api'
import { Movie, MovieForm, MovieUpdateForm, Paginated } from '../types'

function buildMovieForm(m: MovieForm | MovieUpdateForm): FormData {
  const fd = new FormData()
  fd.append('title', m.title)
  fd.append('description', m.description)
  fd.append('director', m.director)
  fd.append('main_actors', m.main_actors)
  fd.append('release_year', String(m.release_year))
  if ('poster' in m && m.poster) fd.append('poster', m.poster)
  return fd
}

export async function fetchMovies(): Promise<Movie[]> {
  const { data } = await api.get<Paginated<Movie>>('/movies/')
  return data.results
}

export async function fetchMovie(id: number): Promise<Movie> {
  const { data }: AxiosResponse<Movie> = await api.get(`/movies/${id}/`)
  return data
}

export async function createMovie(m: MovieForm): Promise<Movie> {
  const { data } = await api.post<Movie>('movies/', buildMovieForm(m))
  return data
}

export async function updateMovie(id: number, m: MovieUpdateForm): Promise<Movie> {
  const { data } = await api.patch<Movie>(`movies/${id}/`, buildMovieForm(m))
  return data
}

export async function deleteMovie(id: number): Promise<void> {
  await api.delete(`/movies/${id}/`)
}
