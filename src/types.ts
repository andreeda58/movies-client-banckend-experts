export interface Movie{ 
  id:number; 
  title:string; 
  description:string; 
  poster:string|null; 
  director:string; 
  main_actors:string; 
  release_year:number; 
  average_rating:number|null; 
  reviews_count:number; 
  owner?:string; 
  created_at?:string; 
  updated_at?:string; }

export interface Review{ 
  id:number; 
  user:string; 
  rating:number; 
  comment:string; 
  created_at:string; }
  
export interface MovieForm{ 
  title:string; 
  description:string; 
  director:string; 
  main_actors:string; 
  release_year:number; 
  poster:File; }

export interface ReviewForm{ 
  rating:number; 
  comment:string; }

export interface AuthLoginResponse{ 
  token:string; 
  user_id:number; 
  username:string; }

export interface AuthRegisterResponse{ 
  token:string; 
  username:string; 
  message?:string; }

export interface AuthContextValue{ 
  username:string|null; 
  token:string|null; 
  login:(u:string,p:string)=>Promise<void>; 
  register:(f:{username:string;password:string;email?:string})=>Promise<void>; 
  logout:()=>Promise<void>; }
// src/types.ts
export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface MovieUpdateForm {
  title: string;
  description: string;
  director: string;
  main_actors: string;
  release_year: number;
  poster?: File | null; // opcional al editar
}
