'use client';
export default function SignInButton() {
    return (<div className="flex flex-col items-center gap-3 mt-4">
      <button onClick={() => window.location.href = '/api/auth/signin'} className="btn animate-pulse-slow">
        <span className="mr-2">🔐</span>Sign in to Participate
      </button>
      <span className="text-sm text-gray-500 italic">Join our community of innovators</span>
    </div>);
}
