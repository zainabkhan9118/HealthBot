import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '@/api/auth';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  
  const validateEmail = (email) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
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
        setSuccess('Registration successful! Redirecting to login…');
        setTimeout(() => {
          navigate('/login');
        }, 1700);
      } else {
        setError(res.message || res.error || 'Signup failed');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  const valueProps = [
    'Daily check-in reminders',
    'Personalized coping strategies',
    'Progress insights & journaling'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-6 py-10 lg:flex-row lg:items-center">
        <div className="lg:w-1/2 space-y-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/80">Join MIND</p>
            <h1 className="mt-4 text-4xl sm:text-5xl font-bold text-foreground">
              Build calm routines with an<br />
              <span className="text-primary">intelligent companion.</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl">
              Create your secure account to unlock reflective journaling, guided prompts, and supportive AI conversations tailored to your emotional goals.
            </p>
          </div>
          <div className="grid gap-4">
            {valueProps.map((prop) => (
              <div key={prop} className="flex items-start gap-3 rounded-xl border border-border bg-card/50 p-4">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">✓</span>
                <p className="text-sm text-muted-foreground">{prop}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:w-1/2">
          <Card className="border border-border/60 shadow-2xl shadow-primary/10 backdrop-blur">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-3xl font-semibold">Create your account</CardTitle>
              <CardDescription>Get started in less than two minutes</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    type="text" 
                    placeholder="Amelia Rivers"
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
                    placeholder="you@example.com"
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
                    placeholder="Create a strong password"
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
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                {success && <div className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</div>}
                {error && <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>}
                <Button 
                  type="submit" 
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Create Account
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary font-semibold hover:underline">
                    Sign in instead
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            By signing up you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup