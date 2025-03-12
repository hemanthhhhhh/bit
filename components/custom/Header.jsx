'use client'
import React, { useContext, useState } from 'react'
import Image from 'next/image'
import { Button } from '../ui/button'
import Colors from '@/app/data/Colors'
import { UserDetailContext } from '@/context/UserDetailContext'
import SignInDialog from './SignInDialog'
import { LucideDownload, Rocket } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { ActionContext } from '@/context/ActionContext'

function Header() {
    const {userDetail, setUserDetail} = useContext(UserDetailContext)
    const [openLoginDialog,setOpenLoginDialog]=useState(false);
    const {action, setAction}=useContext(ActionContext);
    const path=usePathname();

    const onActionBtn=(action)=>{
        setAction({
            actionType:action,
            timeStamps:Date.now()
        })
    }

    return (
        <div className="p-4 flex justify-between items-center">
            <Image src={'/logo.png'} alt="logo" width={60} height={60} />
            {!userDetail ? <div className='flex gap-5'>
                <Button variant='ghost'>Sign in</Button>
                <Button className='text-white' style={{ backgroundColor: Colors.BLUE }}>Get Started</Button>
            </div> :
            path?.includes('workspace')&&
            <div className='flex gap-2 items-center'>
              <Button variant="ghost" onClick={()=>onActionBtn('export')} ><LucideDownload/> Export</Button>
              <Button className="bg-blue-500 text-white hover:bg-blue-600"
              onClick={()=>onActionBtn('deploy')}><Rocket/>  Deploy </Button>
           
            </div>
            }
              {userDetail&& <Image src={userDetail?.picture} alt='user' width={30} height={30}
             className='rounded-full w-[30px] cursor-pointer'
             />}
      
             <SignInDialog openDialog={openLoginDialog}  closeDialog={setOpenLoginDialog} />
        </div>

    )
}

export default Header
