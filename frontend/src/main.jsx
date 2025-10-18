import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import App from './App.jsx'
import UploadPost from './components/upload.jsx'
import SignIn from './authentication/Sign-in.jsx'
import Profile from './authentication/Profile.jsx'
import Login from './authentication/Login.jsx'
import EditProfile from './authentication/Edit-profile.jsx'
import Comments from './components/comments.jsx'
import MakeComment from './components/make-comment.jsx'

const route = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/upload", element: <UploadPost /> },
  { path: "/sign-in", element: <SignIn /> },
  { path: "/login", element: <Login /> },
  { path: "/profile/:id?", element: <Profile /> },
  { path: "/edit-profile", element: <EditProfile /> },
  { path: "/comments/:postId", element: <Comments /> },
  { path: "/make-comment/:postId", element: <MakeComment /> }

])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={route} />
  </StrictMode>,
)
