// filepath: c:\Users\CUI\OneDrive\Desktop\fyp\bot\src\pages\Signup.jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { signup } from '@/api/auth';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  
  const validateEmail = (email) => {
    return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    // Frontend validation
    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    try {
      const res = await signup({ name, email, password });
      if (res.success) {
        setSuccess('Registration successful! Please log in.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(res.message || res.error || 'Signup failed');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div className='min-h-screen w-screen flex items-center justify-center bg-[#E6E6FA]/10'> 
     <div className='flex w-full max-w-sm flex-col gap-6'>
        {/* Logo */}
        <div className="text-center mb-2">
          <h1 className="text-4xl font-extrabold text-[#7C5DC7] drop-shadow-sm tracking-wide">
            MIND
          </h1>
          <p className="text-base text-[#7C5DC7] mt-2 font-medium tracking-tight opacity-80">
            Mental Intelligence for Nurturing Dialogue
          </p>
        </div>
        
        {/* Form */}
        <Card className="border border-[#E6E6FA]/50 shadow-lg">
          <CardHeader className='text-center'>
            <CardTitle className='text-2xl text-[#7C5DC7]'>Create Account</CardTitle>
            <CardDescription>Sign up to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              {success && <div className="text-green-600 text-sm text-center">{success}</div>}
              {error && <div className="text-red-500 text-sm text-center">{error}</div>}
              <Button 
                type="submit" 
                className="w-full bg-[#9B7EDC] hover:bg-[#8B6AD1] text-white"
              >
                Sign Up
              </Button>
              <div className="text-center text-sm">
                <span className="text-[#7C5DC7]/70">Already have an account? </span>
                <a 
                  href="#" 
                  onClick={(e) => {e.preventDefault(); navigate('/login');}}
                  className="text-[#9B7EDC] hover:underline font-medium"
                >
                  Sign in
                </a>
              </div>            
            </form>
          </CardContent>
        </Card>
        
        <div className="text-center text-sm text-[#7C5DC7]/70">
          <p>By signing up, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </div>
    </div>
  )
}

export default Signup