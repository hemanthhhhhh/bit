'use client'
import React, { useEffect, useState } from 'react'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { MessagesContext } from '@/context/MessagesContext'
import { UserDetailContext } from '@/context/UserDetailContext'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { useConvex } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { ActionContext } from '@/context/ActionContext'
import { useRouter } from 'next/navigation'

function Provider({ children }) {
  const [messages, setMessages] = useState()
  const [userDetail, setUserDetail] = useState()
  const [action, setAction] = useState()
  const router = useRouter()

  const convex = useConvex()

  useEffect(() => {
    IsAuthenticated()
  }, [])

  const IsAuthenticated = async () => {
    if (typeof window !== undefined) {
      const user = JSON.parse(localStorage.getItem('user'))
      if(!user) {
        router.push('/')
        return
      }
      const result = await convex.query(api.users.GetUser, {
        email: user?.email
      })
      setUserDetail(result)
      console.log(result)
    }
  }
  return (
    <div>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_KEY}>
        <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
          <MessagesContext.Provider value={{ messages, setMessages }}>
            <ActionContext.Provider value={{action, setAction}}>
              <NextThemesProvider attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange>
                {children}
              </NextThemesProvider>
            </ActionContext.Provider>
          </MessagesContext.Provider>
        </UserDetailContext.Provider>
      </GoogleOAuthProvider>
    </div>
  )
}

export default Provider
