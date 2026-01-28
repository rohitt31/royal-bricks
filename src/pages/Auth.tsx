import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const loginSchema = z.object({
  email: z.string().trim().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin, isLoading: authLoading, signIn } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      navigate('/admin');
    }
  }, [user, isAdmin, authLoading, navigate]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validated = loginSchema.parse(formData);
      setIsSubmitting(true);

      const { error } = await signIn(validated.email, validated.password);

      if (error) {
        toast({
          title: 'Login Failed',
          description: error.message === 'Invalid login credentials' || error.message.includes('Invalid credentials')
            ? 'Invalid email or password'
            : error.message,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Welcome Back!',
        description: 'You have successfully logged in.',
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((e) => {
          if (e.path[0]) {
            fieldErrors[e.path[0] as string] = e.message;
          }
        });
        setErrors(fieldErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-red-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white border-2 border-orange-100 rounded-2xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 flex items-center justify-center shadow-lg">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-display text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Royal Bricks Admin
            </h1>
            <p className="text-sm text-slate-600 mt-2 font-medium">
              Sign in to access your dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-semibold">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="akuph95@gmail.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="border-2 border-orange-100 focus:border-orange-400 transition-colors"
              />
              {errors.email && (
                <p className="text-sm text-red-600 font-medium">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 font-semibold">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="border-2 border-orange-100 focus:border-orange-400 transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 font-medium">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-gradient-to-r from-orange-600 via-orange-500 to-red-600 hover:from-orange-700 hover:via-orange-600 hover:to-red-700 text-white font-bold shadow-lg hover:shadow-xl transition-all text-base py-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-slate-600 hover:text-orange-600 font-medium transition-colors"
            >
              ← Back to website
            </a>
          </div>

          <div className="mt-6 pt-6 border-t border-orange-100">
            <p className="text-xs text-center text-slate-500">
              Admin access only. Contact administrator for credentials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
