import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import Root from './pages/Root';
import Error from './pages/Error';
import Posts from './pages/Posts';
import NewPost from './pages/NewPost';
import UpdatePost from './pages/UpdatePost';
import Supernova from './pages/Supernova';
import BlackHole from './pages/BlackHole';
import Login from './pages/Login';
import Signup from './pages/Signup';
import {ContextProvider} from './store/context';

const router = createBrowserRouter([
  {path: '/', element: <Root/>, errorElement: <Error/>, children: [
    {index: true, element: <Posts/>},
    {path: '/post/new', element: <NewPost/>},
    {path: '/post/:postId', element: <UpdatePost/>},
    {path: '/supernova', element: <Supernova/>},
    {path: '/blackhole', element: <BlackHole/>},
    {path: '/login', element: <Login/>},
    {path: '/signup', element: <Signup/>},
  ]}
]);

export default function App() {
  return (
    <ContextProvider>
      <RouterProvider router={router}/>
    </ContextProvider>
  );
}