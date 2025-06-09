
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
    // Placeholder for login logic
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
            <CardTitle className='text-2xl text-[#7C5DC7]'>Welcome Back</CardTitle>
            <CardDescription>Sign in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
              <Button 
                type="submit" 
                className="w-full bg-[#9B7EDC] hover:bg-[#8B6AD1] text-white"
              >
                Sign In
              </Button>
              <div className="text-center text-sm">
                <span className="text-[#7C5DC7]/70">Don't have an account? </span>
                <a 
                  href="#" 
                  onClick={(e) => {e.preventDefault(); navigate('/signup');}}
                  className="text-[#9B7EDC] hover:underline font-medium"
                >
                  Sign up
                </a>
              </div>            
              </form>
          </CardContent>
        </Card>
        
        <div className="text-center text-sm text-[#7C5DC7]/70">
          <p>By continuing, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </div>
    </div>
  )
}

export default Login