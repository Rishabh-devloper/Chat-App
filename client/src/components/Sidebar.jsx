import React, { useEffect, useState } from 'react'
import { useChatStore } from '../store/useChatStore'
import SidebarSkeleton from './skelton/SidebarSkelton'
import { User } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'

const Sidebar = () => {
    const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore()
    const {onlineUsers} = useAuthStore()
    const [showOnlyOnline , setShowOnlyOnline] = useState(false)

    useEffect(() => {
        getUsers()
    }, [getUsers])
    const filteredUsers = showOnlyOnline ? users.filter(user => onlineUsers.includes(user._id)) : users;

    if (isUsersLoading) return <SidebarSkeleton />
    return (
        <aside className='h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200 ' >
            <div className="border-b border-base-300 w-full p-5">
                <div className="flex items-center gap-2">
                    <User className='w-6 h-6' />
                    <span className="font-medium hidden lg:block">Contacts</span>

                </div>
                <div className=" mt-3 hidden lg:flex items-center gap-2">
                    <label className=' cursor-pointer flex items-center gap-2'>
                        <input
                            type="checkbox"
                            className=" checkbox checkbox-sm"
                            checked={showOnlyOnline}
                            onChange={(e) => setShowOnlyOnline(e.target.checked)}
                        />
                        <span className='text-sm'>Show Online Only</span>
                    </label>
                    <span className='text-xs text-zinc-500'>({ onlineUsers.length - 1 } Online)</span>
                </div>
                </div>
                <div className="overflow-y-auto  w-full py-3">
                    {filteredUsers.map((user) => (
                        <button
                            key={user._id}
                            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors  ${selectedUser === user._id ? 'bg-base-300 ring-1 ring-base-300' : ''}`}
                            onClick={() => setSelectedUser(user)}
                        >
                            <div className="relative mx-auto lg:mx-0">
                                <img src={user.profilePic || "./avatar.png"} alt="" className='size-12 rounded-full object-cover' />
                                {
                                    onlineUsers.includes(user._id) && <span className="absolute size-3 bg-green-500 rounded-full right-0 bottom-0 ring-2 ring-zinc-900"></span>
                                }
                            </div>
                            <div className="hidden lg:block text-left min-w-0">
                                <div className="font-medium truncate">
                                    {user.fullName}
                                </div>
                                <div className="text-sm text-zinc-400">
                                    {
                                        onlineUsers.includes(user._id) ? 'Online' : 'Offline'
                                    }
                                </div>
                            </div>
                        </button>
                    ))
                    }
                    {filteredUsers.length === 0 && (
                        <div className="text-center text-zinc-500 py-4">
                            No Online users found
                        </div>
                    )}
                </div>

            


        </aside>
    )
}

export default Sidebar