'use client'
import Colors from '@/app/data/Colors'
import Lookup from '@/app/data/Lookup'
import Prompt from '@/app/data/Prompt'
import { MessagesContext } from '@/context/MessagesContext'
import { UserDetailContext } from '@/context/UserDetailContext'
import { api } from '@/convex/_generated/api'
import axios from 'axios'
import { useConvex, useMutation } from 'convex/react'
import { ArrowRight, Link, Loader2Icon } from 'lucide-react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'

function ChatView() {
    const { id } = useParams()
    const convex = useConvex()
    const { messages, setMessages } = useContext(MessagesContext)
    const [userInput, setUserInput] = useState()
    const { userDetail, setUserDetail } = useContext(UserDetailContext)
    const [loading, setLoading] = useState(false)
    const UpdateMessages = useMutation(api.workspace.UpdateMessages)

    useEffect(() => {
        id && GetWorkspaceData()
    }, [id])


    const GetWorkspaceData = async () => {
        const result = await convex.query(api.workspace.GetWorkspace, {
            workspaceId: id
        })
        setMessages(result?.messages)
        console.log(result)
    }

    useEffect(() => {
        if(messages?.length > 0) {
          const role = messages[messages?.length - 1].role
          if(role === 'user') {
            GetAiResponse()
          }
        }
      },[messages])

    const GetAiResponse = async() => {
        setLoading(true)
        const PROMPT = JSON.stringify(messages)+Prompt.CHAT_PROMPT 
        const result = await axios.post('/api/ai-chat', {
          prompt:PROMPT
        })
        console.log(result.data.result)
        const aiResp = {
            role: 'ai',
            content: result.data.result
        }
        setMessages(prev => [...prev, aiResp])

        await UpdateMessages({
            messages: [...messages, aiResp],
            workspaceId: id
        })
        setLoading(false)
      }

      const onGenerate = (input) => {
        setMessages(prev => [...prev, {
          role: 'user',
          content: input
        }])
        setUserInput('')
      }

    return (
        <div  className='relative h-[85vh] flex flex-col'>
            <div className='flex-1 overflow-y-scroll'>
                {messages?.map((msg, ind) => (
                    <div key={ind} className='p-3 rounded-lg mb-2 leading-7 flex gap-2 items-start' style={{ backgroundColor: Colors.CHAT_BACKGROUND }}>
                        {msg?.role == 'user' && <Image src={userDetail?.picture} className='rounded-full' alt='userimage' width={35} height={35} />}
                        <h2>{msg.content}</h2>
                    </div>
                ))}
                {loading && <div className='p-3 rounded-lg mb-2 leading-7 flex gap-2 items-center' style={{backgroundColor: Colors.CHAT_BACKGROUND}}>
                    <Loader2Icon className='animate-spin'/>
                    <h2>Generating response...</h2>
                </div>}
            </div>

            <div className='p-5 border rounded-xl max-w-2xl w-full mt-3' style={{ backgroundColor: Colors.BACKGROUND }}>
                <div className='flex gap-2'>
                    <textarea value={userInput } onChange={(event) => setUserInput(event.target.value)} placeholder={Lookup.INPUT_PLACEHOLDER} className='bg-transparent w-full outline-none h-32 max-h-56 resize-none' />
                    {userInput && <ArrowRight onClick={() => onGenerate(userInput)} className='bg-blue-500 p-2 h-10 w-10 rounded-md cursor-pointer' />}
                </div>
                <div>
                    <Link className='h-5 w-5' />
                </div>
            </div>
        </div>
    )
}

export default ChatView

