import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { createBrowserRouter, Router, RouterProvider } from 'react-router-dom'
import Home from './components/Home'
import Signup from './components/Signup'
import Login from './components/Login'
import Forgot from './components/Forgot'
import ResetPassword from './components/ResetPassword'
import Terms from './components/Terms'
import Privacy from './components/Privacy'
import VerifyEmail from './components/VerifyEmail'
import ResendVerification from './components/ResendVerification'
import Dashboard from './components/Dashboard'
import PolicyGenerator from './components/PolicyGenerator'
import DisplayPolicies from './components/DisplayPolicies'
import DpaPolicies from './components/DpaPolicies'
import CookiePolicies from './components/CookiePolicies'
import PrivacyPolicies from './components/PrivacyPolicies'
import TosPolicies from './components/TosPolicies'
import AupPolicies from './components/AupPolicies'


function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />
    },
    {
      path: "/signup",
      element: <Signup />

    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/forgot",
      element: <Forgot />
    },
    {
      path: "/reset-password/:uid/:token",
      element: <ResetPassword />
    },
    {
      path:"/terms",
      element: <Terms/>
    },
    {
      path:"/privacy",
      element: <Privacy/>
    },
    {
      path:"/verify_email",
      element: <VerifyEmail/>
    }, 
    {
      path:"/resend-verification",
      element: <ResendVerification/>
    }, 
    {
      path:"/dashboard",
      element: <Dashboard/>
    },
    {
      path:"/policy-generator",
      element: <PolicyGenerator/>
    },
    {
      path:"/display-policies",
      element: <DisplayPolicies/>
    },
    {
      path:"/tos",
      element:<TosPolicies/>
    },
    {
      path:"/cookie",
      element:<CookiePolicies/>
    },
    {
      path:"/dpa",
      element:<DpaPolicies/>
    },
    {
      path:"/privacypolicy",
      element:<PrivacyPolicies/>
    },
    {
      path:"/aup",
      element:<AupPolicies/>
    }
  ])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )

}

export default App
