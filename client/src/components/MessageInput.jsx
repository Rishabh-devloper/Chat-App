import { Image, Send, X } from 'lucide-react'
import React, { useRef, useState } from 'react'
import { useChatStore } from '../store/useChatStore'

const MessageInput = () => {
    const [text, setText] = useState("")
    const [imagePreview, setImagePreview] = useState(null)
    const fileInputRef = useRef(null)
    const { sendMessage } = useChatStore()

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if(!file.type.startsWith('image/')) {
            toast.error('Please select an image file')
            return
        }
        
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
     }

    const removeImage = () => {
        setImagePreview(null)
        if(fileInputRef.current) {
            fileInputRef.current.value = null
        }
     }

    const handleSendImage = async (e) => { 
        e.preventDefault()
        if(!text.trim() && !imagePreview) return;
        try {
            await sendMessage({
                text:text.trim(),
                image:imagePreview
            })
            setText("")
            setImagePreview(null)
            if(fileInputRef.current) {
            fileInputRef.current.value = null
        }

            
        } catch (error) {
            console.error("Failed to send the message", error)
            
        }

    }
    
    return (
        <div className='p-4 w-full'>
            {imagePreview && (
                <div className="mb-3 flex items-center gap-2">
                    <div className="relative">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
                        />
                        <button
                            onClick={removeImage}
                            className="absolute z-10 -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
                            type="button"
                        >
                            <X className="size-3" />
                        </button>
                    </div>
                </div>
            )}
            <form onSubmit={handleSendImage} className="flex gap-2 items-center">
                <div className="flex flex-1 gap-2">
                    <input
                        type="text"
                        className=' w-full input input-bordered rounded-lg input-sm sm:input-md'
                        placeholder='Type a message...'
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        className='hidden'
                        ref={fileInputRef}
                        onChange={handleImageChange}
                    />
                    <button
                        type="button"
                        className={`hidden sm:flex btn btn-circle ${imagePreview ? 'text-emerald-600' : 'text-zinc-400'} `}
                        onClick={()=> fileInputRef.current?.click()}
                    
                    
                    >
                        <Image size={20} />
                    </button>
                </div>
                <button className=" btn btn-sm btn-circle" type='submit' disabled={!text.trim() && !imagePreview}> 
                    <Send size={22}/> 
                </button>

            </form>

        </div>
    )
}

export default MessageInput