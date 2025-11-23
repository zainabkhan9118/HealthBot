import React, { useState, useContext, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { signin } from '@/api/auth';
import AuthContext from '@/context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, loading } = useContext(AuthContext);
  
  // Get the page user was trying to access before being redirected to login
  const from = location.state?.from?.pathname || '/dashboard';
  
  // Redirect if already authenticated
  if (!loading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await signin({ email, password });
      if (res.success && res.token) {
        login(res.token, { email });
        setSuccess('Welcome back! Redirecting you...');
        setTimeout(() => {
          // Redirect to the page they were trying to access, or dashboard as fallback
          navigate(from, { replace: true });
        }, 1400);
      } else {
        setError(res.message || 'Login failed');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 via-background to-background">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-6 py-10 lg:flex-row lg:items-center">
        <div className="lg:w-1/2 space-y-8">
          <div>
            <p className="text-sm font-semibold tracking-[0.3em] text-primary/80 uppercase">
              Welcome back to MIND
            </p>
            <h1 className="mt-4 text-4xl sm:text-5xl font-bold text-foreground">
              Compassionate support <span className="text-primary">anytime.</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl">
              Access your personalized insights, check-ins, and conversations in one calm space designed for emotional clarity.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Daily Reflections', value: '8K+' },
              { label: 'Guided Sessions', value: '2.4K' },
              { label: 'Mood Entries', value: '95%' }
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-border bg-card/40 p-4">
                <p className="text-2xl font-bold text-primary">{item.value}</p>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:w-1/2">
          <Card className="border border-border/60 shadow-2xl shadow-primary/10 backdrop-blur">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-3xl font-semibold text-foreground">Sign in to continue</CardTitle>
              <CardDescription>
                Step back into your mindful workspace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
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
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-muted-foreground">
                    <input type="checkbox" className="rounded border-border" />
                    Remember me
                  </label>
                  <button type="button" className="text-primary text-sm hover:underline">
                    Forgot password?
                  </button>
                </div>
                {success && <div className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</div>}
                {error && <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>}
                <Button 
                  type="submit" 
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Sign In
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Don’t have an account?{' '}
                  <Link to="/signup" className="text-primary font-semibold hover:underline">
                    Create one now
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            By continuing you agree to the MIND Terms & Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login