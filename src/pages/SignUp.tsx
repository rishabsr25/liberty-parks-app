import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, ArrowLeft, ShieldCheck } from 'lucide-react';
import { supabase } from '@/supabase-client';

export default function SignUp() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Email Verification State
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [enteredCode, setEnteredCode] = useState<string[]>(Array(6).fill(''));
    const [countdown, setCountdown] = useState(60);
    const [isCooldown, setIsCooldown] = useState(false);
    
    const { signUp, verifyOtp } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const isMockMode = !supabase;

    // Countdown Timer logic
    useEffect(() => {
        if (!isCooldown) return;
        
        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    setIsCooldown(false);
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        
        return () => clearInterval(interval);
    }, [isCooldown]);

    const generateOTP = () => {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setVerificationCode(code);
        setEnteredCode(Array(6).fill(''));
        return code;
    };

    const sendVerificationEmail = (code: string) => {
        toast({
            title: 'Verification Code Sent',
            description: `A verification code has been sent to ${email} (Mock Code: ${code})`,
        });
        setCountdown(60);
        setIsCooldown(true);
    };

    const handleEmailSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password || !confirmPassword || !firstName || !lastName) {
            toast({
                title: 'Error',
                description: 'Please fill in all fields',
                variant: 'destructive',
            });
            return;
        }

        if (password !== confirmPassword) {
            toast({
                title: 'Error',
                description: 'Passwords do not match',
                variant: 'destructive',
            });
            return;
        }

        if (password.length < 6) {
            toast({
                title: 'Error',
                description: 'Password must be at least 6 characters',
                variant: 'destructive',
            });
            return;
        }

        if (isMockMode) {
            const code = generateOTP();
            setIsVerifying(true);
            sendVerificationEmail(code);
        } else {
            setLoading(true);
            const { session, error } = await signUp(email, password, firstName, lastName);
            setLoading(false);

            if (error) {
                toast({
                    title: 'Sign Up Failed',
                    description: error.message,
                    variant: 'destructive',
                });
                return;
            }

            // If session is immediately returned, email verification is disabled in Supabase Auth configuration
            if (session) {
                toast({
                    title: 'Success',
                    description: 'Account created successfully! You are now signed in.',
                });
                navigate('/');
                return;
            }

            // Real email code verification needed (sent via Resend SMTP)
            setIsVerifying(true);
            setEnteredCode(Array(6).fill(''));
            toast({
                title: 'Verification Code Sent',
                description: `A 6-digit confirmation code has been sent to ${email}`,
            });
            setCountdown(60);
            setIsCooldown(true);
        }
        
        // Auto focus the first input after state update and render
        setTimeout(() => {
            inputRefs.current[0]?.focus();
        }, 100);
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const codeString = enteredCode.join('');
        if (codeString.length < 6) {
            toast({
                title: 'Invalid Code',
                description: 'Please enter all 6 digits',
                variant: 'destructive',
            });
            return;
        }

        setLoading(true);
        if (isMockMode) {
            if (codeString !== verificationCode) {
                setLoading(false);
                toast({
                    title: 'Incorrect Code',
                    description: 'The verification code is incorrect. Please try again.',
                    variant: 'destructive',
                });
                return;
            }
            
            // Complete sign up locally
            const { error } = await signUp(email, password, firstName, lastName);
            setLoading(false);

            if (error) {
                toast({
                    title: 'Sign Up Failed',
                    description: error.message,
                    variant: 'destructive',
                });
            } else {
                toast({
                    title: 'Account Verified!',
                    description: 'Demo account created successfully. Welcome to Liberty Parks!',
                });
                navigate('/');
            }
        } else {
            // Real Supabase Verify OTP
            const { error } = await verifyOtp(email, codeString);
            setLoading(false);

            if (error) {
                toast({
                    title: 'Verification Failed',
                    description: error.message,
                    variant: 'destructive',
                });
            } else {
                toast({
                    title: 'Account Verified!',
                    description: 'Your account has been verified and created successfully. Welcome to Liberty Parks!',
                });
                navigate('/');
            }
        }
    };

    const handleResendCode = async () => {
        if (isCooldown) return;
        
        if (isMockMode) {
            const code = generateOTP();
            sendVerificationEmail(code);
        } else {
            setLoading(true);
            const { error } = await signUp(email, password, firstName, lastName);
            setLoading(false);

            if (error) {
                toast({
                    title: 'Resend Failed',
                    description: error.message,
                    variant: 'destructive',
                });
            } else {
                toast({
                    title: 'Verification Code Resent',
                    description: `A new verification code has been sent to ${email}`,
                });
                setCountdown(60);
                setIsCooldown(true);
            }
        }

        setTimeout(() => {
            inputRefs.current[0]?.focus();
        }, 100);
    };

    const handleBackToSignUp = () => {
        setIsVerifying(false);
        setEnteredCode(Array(6).fill(''));
    };

    const handleOtpChange = (index: number, value: string) => {
        const cleanValue = value.replace(/[^0-9]/g, '');
        if (!cleanValue) {
            const newCode = [...enteredCode];
            newCode[index] = '';
            setEnteredCode(newCode);
            return;
        }

        const digit = cleanValue[cleanValue.length - 1];
        const newCode = [...enteredCode];
        newCode[index] = digit;
        setEnteredCode(newCode);

        if (index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
            if (!enteredCode[index] && index > 0) {
                const newCode = [...enteredCode];
                newCode[index - 1] = '';
                setEnteredCode(newCode);
                inputRefs.current[index - 1]?.focus();
            } else {
                const newCode = [...enteredCode];
                newCode[index] = '';
                setEnteredCode(newCode);
            }
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').trim();
        if (!/^\d{6}$/.test(pastedData)) return;

        const digits = pastedData.split('');
        setEnteredCode(digits);
        inputRefs.current[5]?.focus();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
            <Card className="w-full max-w-md transition-all duration-300 shadow-xl border-t-4 border-t-primary">
                {!isVerifying ? (
                    <>
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
                            <CardDescription className="text-center">
                                Sign up for a Liberty Parks account
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <form onSubmit={handleEmailSignUp} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input
                                            id="firstName"
                                            type="text"
                                            placeholder="John"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            disabled={loading}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input
                                            id="lastName"
                                            type="text"
                                            placeholder="Doe"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            disabled={loading}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your.email@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={loading}
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
                                        disabled={loading}
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
                                        disabled={loading}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating account...
                                        </>
                                    ) : (
                                        'Sign Up'
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-2">
                            <div className="text-sm text-center text-muted-foreground">
                                Already have an account?{' '}
                                <Link to="/signin" className="text-primary hover:underline font-medium">
                                    Sign in
                                </Link>
                            </div>
                        </CardFooter>
                    </>
                ) : (
                    <>
                        <CardHeader className="space-y-1">
                            <div className="flex justify-center mb-2">
                                <div className="p-3 bg-primary/10 rounded-full text-primary animate-pulse">
                                    <Mail className="h-6 w-6 animate-bounce" />
                                </div>
                            </div>
                            <CardTitle className="text-2xl font-bold text-center">Verify Liberty Parks Account</CardTitle>
                            <CardDescription className="text-center">
                                We've sent a 6-digit verification code to <span className="font-semibold text-foreground">{email}</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Conditional Environment Card */}
                            {isMockMode ? (
                                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-sm flex items-start gap-2.5">
                                    <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-primary">Developer Sandbox Environment</h4>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            Simulated email verification sent.
                                        </p>
                                        <p className="text-sm font-mono mt-1.5 bg-background border rounded px-2 py-1 text-center font-bold tracking-widest text-primary">
                                            {verificationCode.slice(0, 3)} {verificationCode.slice(3)}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-sm flex items-start gap-2.5">
                                    <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-primary">Check Your Email Inbox</h4>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            We have sent a verification code to your email. Please check your inbox and enter the 6 digits below.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleVerifyCode} className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-center block text-sm font-medium">Enter 6-Digit Code</Label>
                                    <div className="flex justify-between gap-2 max-w-xs mx-auto">
                                        {enteredCode.map((digit, index) => (
                                            <Input
                                                key={index}
                                                ref={(el) => (inputRefs.current[index] = el)}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={1}
                                                className="w-10 h-12 text-center text-xl font-bold p-0 rounded-md focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                                value={digit}
                                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                                onPaste={handleOtpPaste}
                                                disabled={loading}
                                                required
                                            />
                                        ))}
                                    </div>
                                </div>

                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Verifying code...
                                        </>
                                    ) : (
                                        'Verify & Create Account'
                                    )}
                                </Button>
                            </form>

                            <div className="text-center text-sm mt-4">
                                <span className="text-muted-foreground">Didn't receive the code? </span>
                                {isCooldown ? (
                                    <span className="text-muted-foreground font-medium">
                                        Resend in {countdown}s
                                    </span>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleResendCode}
                                        className="text-primary hover:underline font-medium transition-colors"
                                        disabled={loading}
                                    >
                                        Resend code
                                    </button>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-2 border-t border-border/50 pt-4">
                            <button
                                type="button"
                                onClick={handleBackToSignUp}
                                className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors py-1 w-full"
                                disabled={loading}
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to registration details
                            </button>
                        </CardFooter>
                    </>
                )}
            </Card>
        </div>
    );
}
