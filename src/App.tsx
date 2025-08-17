import{createBrowserRouter,RouterProvider,Outlet}from'react-router-dom'
import Navbar from './components/Navbar'
import Movies from './pages/Movies'
import MovieDetail from './pages/MovieDetail'
function Layout(){return(<div className='min-h-screen bg-surface'><Navbar/><Outlet/></div>)}
const router=createBrowserRouter([
    {
        path:'/',element:<Layout/>,
        children:[
            {index:true,element:<Movies/>},
            {path:'movies/:id',element:<MovieDetail/>}]
    }])
export default function App(){return <RouterProvider router={router} future={{v7_startTransition:true}}/>}