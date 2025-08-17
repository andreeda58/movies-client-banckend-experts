import{useEffect,useState,FormEvent,ChangeEvent}from'react'
import{fetchMovies,createMovie,deleteMovie}from'../api'
import{Movie,MovieForm}from'../types'
import MovieCard from '../components/MovieCard'
import{useAuth}from'../context/AuthProvider'
export default function Movies(){
  const[movies,setMovies]=useState<Movie[]>([])
  const[showForm,setShowForm]=useState(false)
  const{username}=useAuth()
  const[form,setForm]=useState<MovieForm>({title:'',description:'',director:'',main_actors:'',release_year:2000,poster:undefined as unknown as File})
  async function load(){setMovies(await fetchMovies())}
  useEffect(()=>{load()},[])
  function onChange(k:keyof MovieForm,v:any){setForm(s=>({...s,[k]:v}))}
  function handlePoster(e:ChangeEvent<HTMLInputElement>){const f=e.target.files?.[0];if(f)onChange('poster',f)}
  async function onCreate(e:FormEvent<HTMLFormElement>){e.preventDefault();await createMovie(form);setShowForm(false);setForm({title:'',description:'',director:'',main_actors:'',release_year:2000,poster:undefined as unknown as File});load()}
  async function onDelete(id:number){if(!confirm('Delete this movie?'))return;await deleteMovie(id);load()}
  return(<div className='max-w-7xl mx-auto px-4 py-6'>
    <div className='flex items-center justify-between mb-4'>
      <h1 className='text-lg font-semibold text-white/90'>Movies</h1>
      {username&&<button className='text-xs border border-white/20 rounded px-3 py-1 hover:bg-white/10' onClick={()=>setShowForm(s=>!s)}>{showForm?'Close':'Add movie'}</button>}
    </div>
    {showForm&&(<form onSubmit={onCreate} className='mb-6 grid gap-3 md:grid-cols-3 bg-surface-2 border border-white/10 rounded-xl p-3'>
      <input className='bg-surface border border-white/10 rounded px-3 py-2' placeholder='Title *' value={form.title} onChange={e=>onChange('title',e.target.value)} required/>
      <input className='bg-surface border border-white/10 rounded px-3 py-2 md:col-span-2' placeholder='Description *' value={form.description} onChange={e=>onChange('description',e.target.value)} required/>
      <input className='bg-surface border border-white/10 rounded px-3 py-2' placeholder='Director *' value={form.director} onChange={e=>onChange('director',e.target.value)} required/>
      <input className='bg-surface border border-white/10 rounded px-3 py-2 md:col-span-2' placeholder='Main actors (comma-separated) *' value={form.main_actors} onChange={e=>onChange('main_actors',e.target.value)} required/>
      <input type='number' min={1888} max={9999} className='bg-surface border border-white/10 rounded px-3 py-2' placeholder='Release year *' value={form.release_year} onChange={e=>onChange('release_year',Number(e.target.value))} required/>
      <input type='file' accept='image/*' className='md:col-span-2 text-sm text-gray-300' onChange={handlePoster} required/>
      <div className='md:col-span-3'><button className='text-sm border border-white/20 rounded px-3 py-2 hover:bg-white/10'>Create</button></div>
    </form>)}
    <div className='grid gap-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'>
      {movies.map(m=>(<div key={m.id}><MovieCard movie={m}/>{username&&<div className='mt-1'><button className='text-[11px] text-red-300/90 hover:text-red-200/90' onClick={()=>onDelete(m.id)}>Delete</button></div>}</div>))}
    </div>
  </div>)}
