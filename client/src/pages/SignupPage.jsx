import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, Loader, Loader2, Lock, Mail, MessageSquare, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Link, Navigate } from 'react-router-dom';
import AuthImagePattern from '../components/AuthImagePattern';
import toast from 'react-hot-toast';

const SignupPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: ''
    });
    const { signup, isSigningUp } = useAuthStore();
    const navigate = useNavigate();
    const { authUser } = useAuthStore();
    useEffect(() => {
        if (authUser) navigate('/');
    }, [authUser]);
    

    // Reset form data on component mount
    useEffect(() => {
        setFormData({
            fullName: '',
            email: '',
            password: ''
        });
    }, []);

    const validateForm = () => {
        if(!formData.fullName.trim()) return toast.error("Full Name is required");
        if(!formData.email.trim()) return toast.error("Email is required");
        if(!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Email is invalid");

        if(!formData.password.trim()) return toast.error("Password is required");
        if(formData.password.length < 6) return toast.error("Password must be at least 6 characters long");
        return true

    }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = validateForm();
    if (success === true) {
        try {
            await signup(formData); // Ensure this is awaited
        navigate('/');
        } catch (error) {
            console.error("Signup failed:", error); // Log any unexpected errors
        }
    }
};

    return (
        <div className='min-h-screen grid lg:grid-cols-2'>
            {/* Left side */}
            <div className="flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center mb-8">
                        <div className="flex flex-col items-center gap-2 group">
                            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <MessageSquare className=" size-6 text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold mt-2">Create Account</h1>
                            <p className=" text-base-content/60">Get started with Your free Account</p>
                        </div>
                    </div>
                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                        <div className="form-control">
                            <label className='label'>
                                <span className="label-text font-medium">Full Name</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center z-10 pointer-events-none">
                                    <User className="text-base-content/40 size-5" />
                                </div>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    placeholder="John Doe"
                                    className="input input-bordered w-full pl-10"
                                    autoComplete="off" // Disable browser autofill
                                />
                            </div>
                        </div>
                        <div className="form-control">
                            <label className='label'>
                                <span className="label-text font-medium">Email</span>
                            </label>
                            <div className="relative">
                                <div className="absolute flex items-center inset-y-0 left-0 pl-3 z-10 pointer-events-none">
                                    <Mail className="text-base-content/40 size-5" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="@example.com"
                                    className="input input-bordered w-full pl-10"
                                    autoComplete="off" // Disable browser autofill
                                />
                            </div>
                        </div>
                        <div className="form-control">
                            <label className='label'>
                                <span className="label-text font-medium">Password</span>
                            </label>
                            <div className="relative">
                                <div className="absolute flex items-center inset-y-0 left-0 pl-3 z-10 pointer-events-none">
                                    <Lock className="text-base-content/40 size-5" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="********"
                                    className="input input-bordered w-full pl-10"
                                    autoComplete="off" // Disable browser autofill
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {
                                        showPassword ? (
                                            <EyeOff className="text-base-content/40 size-5" />
                                        ) : (
                                            <Eye className="text-base-content/40 size-5" />
                                        )
                                    }
                                </button>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
                            {isSigningUp 
                            ? (
                                <>
                            <Loader2 className="animate-spin size-5" />
                            Loading....
                            
                            </> 
                            )
                            : (
                                'Create Account'
                            )
                            }
                        </button>
                    </form>
                    <div className="text-center mt-4">
                        <p className="text-base-content/60">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary font-medium hover:underline">
                                Log in
                            </Link>
                        </p>
                        </div>
                </div>
            </div>
            {/* Right side */}
            <AuthImagePattern
            title={"Join our community"}
            subtitle={"Connect with Friends , share moments and stay in touch with your loved ones."}
            
            />
        </div>
    );
};

export default SignupPage;