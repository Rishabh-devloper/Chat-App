import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { Camera, Mail, User } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { authUser, updateProfile, isLoading } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState('')

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      return toast.error('Please select an image file');
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return toast.error('Image size should be less than 5MB');
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image);
      try {
        await updateProfile({ profilePic: base64Image });
      } catch (error) {
        console.error('Failed to update profile:', error);
        setSelectedImage('');
      }
    };
  }
  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className=" font-semibold text-2xl">Profile</h1>
            <p className="mt2">Your Profile Information</p>
          </div>

          {/* Profile Picture */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img src={selectedImage || authUser?.profilePic || "/avatar.png"} alt=" profile" className="w-24 h-24 rounded-full object-cover" />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 rounded-full p-1 cursor-pointer
                transition-all hover:bg-base-200 ${isLoading ? "animate-pulse pointer-events-none" : ""}`}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={isLoading}
                />

              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isLoading ? "Uploading..." : "Click to change your profile picture"}
            </p>

          </div>
          {/* User Information */}
          <div className="space-y-6">
            <div className="spce-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4 " />
                Full Name

              </div>
              <input
                type="text"
                className="input input-bordered w-full"
                value={authUser?.fullName || ''}
                readOnly
              />
            </div>
            <div className="spce-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4 " />
                Email

              </div>
              <input
                type="text"
                className="input input-bordered w-full"
                value={authUser?.email || ''}
                readOnly
              />
            </div>
          </div>
          <div className=" mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="font-medium text-lg mb-4">
              Account Information
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2  border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser?.createdAt?.split('T')[0] || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}

export default ProfilePage