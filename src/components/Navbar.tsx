import{useState}from'react'
import{Link}from'react-router-dom'
import{useAuth}from'../context/AuthProvider'
export default function Navbar(){
  const{username,login,register,logout}=useAuth()
  const[open,setOpen]=useState(false)
  const[isSignup,setIsSignup]=useState(false)
  const[u,setU]=useState('');const[p,setP]=useState('');const[e,setE]=useState('')
  
  async function submitAuth(ev:React.FormEvent){
    ev.preventDefault();
    if(isSignup)await register({username:u,password:p,email:e||undefined});
    else await login(u,p);setOpen(false);setU('');setP('');setE('')
  }
  return(<header className='bg-surface-2 border-b border-black/40'>
    <div className='max-w-7xl mx-auto px-4 py-3 flex items-center gap-6'>
      <Link to='/' className='text-white/90 font-semibold tracking-wide'>Movies</Link>
      <nav className='hidden sm:flex items-center gap-4 text-sm text-gray-300'>
        <span className='hover:text-white/90 cursor-default'>Dashboard</span>
        <Link to='/' className='hover:text-white/90'>Movies</Link>
      </nav>
      <div className='ml-auto flex items-center gap-3'>
        {username?(<>
          <span className='text-sm text-gray-300'>Welcome, <b className='text-white/90'>{username}</b></span>
          <button className='text-xs border border-white/20 rounded px-3 py-1 hover:bg-white/10' onClick={()=>logout()}>Log out</button>
        </>):(<button className='text-xs border border-white/20 rounded px-3 py-1 hover:bg-white/10' onClick={()=>setOpen(o=>!o)}>{open?'Close':'Login / Sign up'}</button>)}
      </div>
    </div>
    {open&&(<form onSubmit={submitAuth} className='max-w-7xl mx-auto px-4 pb-3 grid gap-2 sm:grid-cols-4'>
      <input className='bg-surface border border-white/10 rounded px-3 py-2' placeholder='Username' value={u} onChange={e=>setU(e.target.value)} required />
      <input className='bg-surface border border-white/10 rounded px-3 py-2' placeholder='Password' type='password' value={p} onChange={e=>setP(e.target.value)} required />
      {isSignup&&<input className='bg-surface border border-white/10 rounded px-3 py-2' placeholder='Email (optional)' type='email' value={e} onChange={e=>setE(e.target.value)} />}
      <div className='flex items-center gap-2'>
        <button className='text-sm border border-white/20 rounded px-3 py-2 hover:bg-white/10'>{isSignup?'Sign up':'Log in'}</button>
        <button type='button' className='text-xs underline text-gray-300' onClick={()=>setIsSignup(s=>!s)}>{isSignup?'Use Log in':'Use Sign up'}</button>
      </div>
    </form>)}
  </header>)
}