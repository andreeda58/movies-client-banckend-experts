// src/api/reviews.ts
import { AxiosResponse } from 'axios'
import api from './api'
import { Review, ReviewForm, Paginated } from '../types'

export async function createReview(movieId: number, form: ReviewForm): Promise<Review> {
  const { data }: AxiosResponse<Review> = await api.post(`/movies/${movieId}/reviews/`, form)
  return data
}

export async function updateReview(reviewId: number, form: ReviewForm): Promise<Review> {
  const { data }: AxiosResponse<Review> = await api.patch(`/reviews/${reviewId}/`, form)
  return data
}

export async function deleteReviewById(reviewId: number): Promise<void> {
  await api.delete(`/reviews/${reviewId}/`)
}

export async function fetchReviews(movieId: number): Promise<Review[]> {
  const { data } = await api.get<Review[] | Paginated<Review>>(`movies/${movieId}/reviews/`)
  if (Array.isArray(data)) return data
  if (data && Array.isArray((data as Paginated<Review>).results)) {
    return (data as Paginated<Review>).results
  }
  console.warn('Unexpected /reviews/ payload:', data)
  return []
}
