import React, { useState } from 'react';

const ASB_BLUE = '#003366';

export default function AccountSecurityStep({ data, onChange, onBack, onNext }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceRecorded, setVoiceRecorded] = useState(false);

  const toggleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      setVoiceRecorded(true);
      onChange({ ...data, voiceRecorded: true });
    } else {
      setIsRecording(true);
      setVoiceRecorded(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <p className="text-gray-600 mb-6">Set your account title, login credentials and optional voice verification.</p>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Account Title</label>
          <input
            type="text"
            value={data.accountTitle || ''}
            onChange={(e) => onChange({ ...data, accountTitle: e.target.value })}
            placeholder="Full name as on account"
            className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-offset-0 focus:ring-[#003366]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            value={data.email || ''}
            onChange={(e) => onChange({ ...data, email: e.target.value })}
            placeholder="your@email.com"
            className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-offset-0 focus:ring-[#003366]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={data.password || ''}
              onChange={(e) => onChange({ ...data, password: e.target.value })}
              placeholder="••••••••"
              className="w-full px-3 py-1.5 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-offset-0 focus:ring-[#003366]"
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
          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={toggleRecord}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md font-medium text-sm border-2 transition-colors"
              style={{
                backgroundColor: isRecording ? '#dc2626' : 'rgba(0,51,102,0.08)',
                color: isRecording ? '#fff' : ASB_BLUE,
                borderColor: isRecording ? '#dc2626' : 'rgba(0,51,102,0.3)',
              }}
            >
              {isRecording ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  Stop recording
                </>
              ) : voiceRecorded ? (
                <>✓ Voice recorded – Record again</>
              ) : (
                <>🎤 Record voice</>
              )}
            </button>
            {(voiceRecorded || isRecording) && (
              <span className="text-xs text-gray-500">
                {isRecording ? 'Recording...' : 'Voice sample saved for verification'}
              </span>
            )}
          </div>
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
          onClick={onNext}
          className="px-6 py-1.5 rounded-md font-semibold text-white"
          style={{ backgroundColor: ASB_BLUE }}
        >
          NEXT
        </button>
      </div>
    </div>
  );
}
