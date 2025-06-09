// filepath: c:\Users\CUI\OneDrive\Desktop\fyp\bot\src\pages\Signup.jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate passwords match
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Signup attempt:', { name, email, password });
    // Placeholder for signup logic
    navigate('/dashboard');
  };

  return (
    <div className='min-h-screen w-screen flex items-center justify-center bg-[#E6E6FA]/10'> 
     <div className='flex w-full max-w-sm flex-col gap-6'>
        {/* Logo */}
        <div className="text-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#9B7EDC] to-[#E6E6FA] bg-clip-text text-transparent">MIND</h1>
          <p className="text-sm text-[#9B7EDC] mt-1">Mental Intelligence for Nurturing Dialogue</p>
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