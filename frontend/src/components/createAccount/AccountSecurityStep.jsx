import React, { useState, useEffect } from 'react';
import { useVoiceRecorder } from '../../hooks/useVoiceRecorder';

const ASB_BLUE = '#003366';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AccountSecurityStep({ data, onChange, onBack, onNext }) {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const {
    isRecording,
    audioBlob,
    error: voiceError,
    startRecording,
    stopRecording,
    hasRecorded,
  } = useVoiceRecorder();

  const validate = () => {
    const e = {};
    if (!data.accountTitle?.trim()) e.accountTitle = 'Account title is required';
    if (!data.email?.trim()) e.email = 'Email is required';
    else if (!EMAIL_REGEX.test(data.email)) e.email = 'Enter a valid email address';
    if (!data.password) e.password = 'Password is required';
    else if (data.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (!hasRecorded) e.voice = 'Please record your voice for verification';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    onNext();
  };

  useEffect(() => {
    if (audioBlob) {
      onChange({ ...data, audioBlob, voiceRecorded: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioBlob]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <p className="text-gray-600 mb-6">Set your account title, login credentials and optional voice verification.</p>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Account Title</label>
          <input
            type="text"
            value={data.accountTitle || ''}
            onChange={(e) => { onChange({ ...data, accountTitle: e.target.value }); setErrors((p) => ({ ...p, accountTitle: '' })); }}
            placeholder="Full name as on account"
            className={`w-full px-3 py-1.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-offset-0 focus:ring-[#003366] ${errors.accountTitle ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.accountTitle && <p className="text-xs text-red-500 mt-1">{errors.accountTitle}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            value={data.email || ''}
            onChange={(e) => { onChange({ ...data, email: e.target.value }); setErrors((p) => ({ ...p, email: '' })); }}
            placeholder="your@email.com"
            className={`w-full px-3 py-1.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-offset-0 focus:ring-[#003366] ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <input
            type={showPassword ? 'text' : 'password'}
            value={data.password || ''}
            onChange={(e) => { onChange({ ...data, password: e.target.value }); setErrors((p) => ({ ...p, password: '' })); }}
            placeholder="••••••••"
            className={`w-full px-3 py-1.5 pr-10 border rounded-md focus:outline-none focus:ring-1 focus:ring-offset-0 focus:ring-[#003366] ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Record voice <span className="text-gray-500 font-normal">(additional security layer)</span>
          </label>
          <p className="text-xs text-gray-500 mb-2">Say a phrase you will use to verify your identity at login.</p>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md font-medium text-sm border-2 transition-colors"
              style={{
                backgroundColor: isRecording ? '#dc2626' : hasRecorded ? 'rgba(34,197,94,0.15)' : 'rgba(0,51,102,0.08)',
                color: isRecording ? '#fff' : hasRecorded ? '#16a34a' : ASB_BLUE,
                borderColor: isRecording ? '#dc2626' : hasRecorded ? '#16a34a' : 'rgba(0,51,102,0.3)',
              }}
            >
              {isRecording ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  Stop recording
                </>
              ) : hasRecorded ? (
                <>✓ Voice recorded – Record again</>
              ) : (
                <>🎤 Record voice</>
              )}
            </button>
            {(hasRecorded || isRecording) && (
              <span className="text-xs text-gray-500">
                {isRecording ? 'Recording...' : 'Voice sample saved for verification'}
              </span>
            )}
          </div>
          {(voiceError || errors.voice) && <p className="text-xs text-red-500 mt-1">{voiceError || errors.voice}</p>}
        </div>
      </div>

      <div className="flex gap-4 mt-10">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-1.5 rounded-md font-semibold border-2 bg-white"
          style={{ borderColor: ASB_BLUE, color: ASB_BLUE }}
        >
          BACK
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="px-6 py-1.5 rounded-md font-semibold text-white"
          style={{ backgroundColor: ASB_BLUE }}
        >
          NEXT
        </button>
      </div>
    </div>
  );
}
