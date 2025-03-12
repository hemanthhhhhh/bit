'use client'
import Image from 'next/image'
import React, { useContext } from 'react'
import { Button } from '../ui/button'
import Colors from '@/app/data/Colors'
import Lookup from '@/app/data/Lookup'
import { ArrowRight, Link } from 'lucide-react'
import { MessagesContext } from '@/context/MessagesContext'
import { UserDetailContext } from '@/context/UserDetailContext'
import SignInDialog from './SignInDialog'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useRouter } from 'next/navigation'

function Hero() {

    const [userInput, setUserInput] = React.useState('')
    const {messages, setMessages} = useContext(MessagesContext)
    const {userDetail, setUserDetail} = useContext(UserDetailContext)
    const [openDialog, setOpenDialog] = React.useState(false)
    const CreateWorkspace = useMutation(api.workspace.CreateWorkSpace)
    const router = useRouter()

    const onGenerate = async(input) => {
        if(!userDetail?.name) {
            setOpenDialog(true)
            return
        }
        setMessages({
            role: 'user',
            content: input 
        })
        const workspaceId = await CreateWorkspace({
            user: userDetail._id,
            messages: [{
              role: 'user',
              content: input
            }]
          })
        console.log(workspaceId)
        router.push('/workspace/'+workspaceId)
    }
  return (
    <div className='flex flex-col items-center mt-36 xl:mt-52 gap-2'>
        <h2 className='font-bold text-4xl'>{Lookup.HERO_HEADING}</h2>
        <p className='text-gray-400 font-medium'>{Lookup.HERO_DESC}</p>
        <div className='p-3 border rounded-xl max-w-xl w-full mt-3'>
        <div className='flex gap-2'>
            <textarea onChange={(event) => setUserInput(event.target.value)} className='outline-none bg-transparent w-full h-32 max-h-56 resize-none' placeholder={Lookup.INPUT_PLACEHOLDER}/>
            {userInput && <ArrowRight onClick={() => onGenerate(userInput)} className='bg-blue-500 p-2 h-10 w-10 rounded-md cursor-pointer'/>}
        </div>
        <div>
            <Link className='h-5 w-5'></Link>
        </div>
        </div>
        <div className='flex mt-8 flex-wrap max-w-2xl items-center justify-center gap-3'>
            {Lookup?.SUGGSTIONS.map((suggestion, index) => <h2 onClick={() => onGenerate(suggestion)} className='p-1 px-2 border rounded-full text-sm text-gray-400 hover:text-white cursor-pointer' key={index}>{suggestion}</h2>)}
        </div>
        <SignInDialog openDialog={openDialog} closeDialog={(v) => setOpenDialog(v)} />
    </div>
  )
}

export default Hero
