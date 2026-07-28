import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Anchor, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AuthPage() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast.success('Welcome back, Captain.');
      } else {
        const { error } = await signUp(email, password, name);
        if (error) throw error;
        toast.success('Account created! Check your email to confirm.');
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23002b49' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#002b49] mb-4">
            <Anchor className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#002b49]">Great Loop Planner</h1>
          <p className="text-[#6b7280] mt-1 text-sm">Your voyage planning companion</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg border border-[#e5e7eb] shadow-sm p-8">
          <h2 className="font-serif text-xl font-semibold text-[#002b49] mb-6">
            {mode === 'signin' ? 'Sign In to Your Account' : 'Create Your Account'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-medium text-[#374151] uppercase tracking-wider">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Captain Jane Smith"
                  className="border-[#d1d5db] focus:border-[#002b49] focus:ring-[#002b49]"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium text-[#374151] uppercase tracking-wider">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="captain@example.com"
                required
                className="border-[#d1d5db] focus:border-[#002b49] focus:ring-[#002b49]"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-medium text-[#374151] uppercase tracking-wider">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="border-[#d1d5db] focus:border-[#002b49] focus:ring-[#002b49] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#374151]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#002b49] hover:bg-[#003a63] text-white font-medium py-2.5 mt-2"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {mode === 'signin' ? 'Signing In...' : 'Creating Account...'}</>
              ) : (
                mode === 'signin' ? 'Sign In' : 'Create Account'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#6b7280]">
              {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
              {' '}
              <button
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                className="text-[#002b49] font-medium hover:underline"
              >
                {mode === 'signin' ? 'Create one' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-[#9ca3af] mt-6">
          Great Loop Planner · Plan your voyage with confidence
        </p>
      </div>
    </div>
  );
}

