import { Image, Send, X } from 'lucide-react'
import React, { useRef, useState } from 'react'
import { useChatStore } from '../store/useChatStore'
import toast from 'react-hot-toast'

const MessageInput = () => {
    const [text, setText] = useState("")
    const [imagePreview, setImagePreview] = useState(null)
    const [isSending, setIsSending] = useState(false)
    const fileInputRef = useRef(null)
    const { sendMessage } = useChatStore()

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if(!file) return

        if(!file.type.startsWith('image/')) {
            toast.error('Please select an image file')
            return
        }

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB')
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

    const handleSendMessage = async (e) => {
        e.preventDefault()
        if(!text.trim() && !imagePreview) return;

        setIsSending(true)
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
            toast.error("Failed to send message. Please try again.")
        } finally {
            setIsSending(false)
        }
    }
    
    return (
        <div className="p-4 border-t border-base-300 bg-base-100">
            {imagePreview && (
                <div className="relative mb-4">
                    <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-40 rounded-lg"
                    />
                    <button
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1 bg-base-300 rounded-full hover:bg-base-400 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}
            <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                <div className="flex flex-1 gap-2">
                    <input
                        type="text"
                        className="w-full input input-bordered rounded-lg input-sm sm:input-md"
                        placeholder="Type a message..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        disabled={isSending}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        disabled={isSending}
                    />
                    <button
                        type="button"
                        className={`hidden sm:flex btn btn-circle ${imagePreview ? 'text-emerald-600' : 'text-zinc-400'}`}
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isSending}
                    >
                        <Image size={20} />
                    </button>
                </div>
                <button
                    className="btn btn-sm btn-circle"
                    type="submit"
                    disabled={(!text.trim() && !imagePreview) || isSending}
                >
                    <Send size={22} />
                </button>
            </form>
        </div>
    )
}

export default MessageInput