import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';
import { login as apiLogin } from '../services/api';

const ASB_ORANGE = '#E85D04';
const ASB_BLUE = '#003366';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function svgDataUri(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function makeLeftIllustration() {
  // Offline-safe SVG that mimics the screenshot's left panel:
  // soft photo-like background + network ring + floating icons + bottom quick links.
  return svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="900" viewBox="0 0 1400 900">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#b8b1ad"/>
      <stop offset="0.35" stop-color="#d6d1ce"/>
      <stop offset="0.75" stop-color="#d9c6bd"/>
      <stop offset="1" stop-color="#b98f78"/>
    </linearGradient>
    <radialGradient id="v" cx="40%" cy="30%" r="70%">
      <stop offset="0" stop-color="rgba(255,255,255,0.55)"/>
      <stop offset="1" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>
    <filter id="blur" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="18"/>
    </filter>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="18" flood-color="rgba(0,0,0,0.18)"/>
    </filter>
  </defs>

  <rect width="1400" height="900" fill="url(#bg)"/>
  <rect width="1400" height="900" fill="url(#v)"/>

  <!-- Soft bokeh blobs -->
  <g filter="url(#blur)" opacity="0.55">
    <circle cx="250" cy="260" r="180" fill="rgba(255,255,255,0.55)"/>
    <circle cx="540" cy="180" r="120" fill="rgba(255,255,255,0.40)"/>
    <circle cx="1040" cy="260" r="220" fill="rgba(255,255,255,0.30)"/>
    <circle cx="960" cy="520" r="260" fill="rgba(255,255,255,0.20)"/>
  </g>

  <!-- Central network ring -->
  <g transform="translate(560 300)" filter="url(#shadow)">
    <circle cx="250" cy="220" r="140" fill="rgba(255,255,255,0.30)"/>
    <circle cx="250" cy="220" r="170" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="2"/>
    <circle cx="250" cy="220" r="210" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>

    <!-- hub -->
    <circle cx="250" cy="220" r="38" fill="rgba(0,0,0,0.12)"/>
    <circle cx="250" cy="220" r="32" fill="rgba(255,255,255,0.65)"/>
    <path d="M238 214 h24 v14 h-24z" fill="${ASB_ORANGE}"/>
    <path d="M244 218 h12 v6 h-12z" fill="#fff"/>

    <!-- nodes + connectors -->
    <g stroke="rgba(255,255,255,0.65)" stroke-width="2" fill="rgba(255,255,255,0.85)">
      <line x1="250" y1="220" x2="80" y2="150"/>
      <circle cx="80" cy="150" r="26"/>
      <text x="80" y="158" text-anchor="middle" font-family="Inter, Arial" font-size="18" fill="rgba(0,0,0,0.6)">🌐</text>

      <line x1="250" y1="220" x2="430" y2="120"/>
      <circle cx="430" cy="120" r="26"/>
      <text x="430" y="128" text-anchor="middle" font-family="Inter, Arial" font-size="18" fill="rgba(0,0,0,0.6)">💳</text>

      <line x1="250" y1="220" x2="520" y2="250"/>
      <circle cx="520" cy="250" r="26"/>
      <text x="520" y="258" text-anchor="middle" font-family="Inter, Arial" font-size="18" fill="rgba(0,0,0,0.6)">📶</text>

      <line x1="250" y1="220" x2="460" y2="380"/>
      <circle cx="460" cy="380" r="26"/>
      <text x="460" y="388" text-anchor="middle" font-family="Inter, Arial" font-size="18" fill="rgba(0,0,0,0.6)">📱</text>

      <line x1="250" y1="220" x2="160" y2="420"/>
      <circle cx="160" cy="420" r="26"/>
      <text x="160" y="428" text-anchor="middle" font-family="Inter, Arial" font-size="18" fill="rgba(0,0,0,0.6)">🧾</text>

      <line x1="250" y1="220" x2="30" y2="300"/>
      <circle cx="30" cy="300" r="26"/>
      <text x="30" y="308" text-anchor="middle" font-family="Inter, Arial" font-size="18" fill="rgba(0,0,0,0.6)">🖥️</text>
    </g>
  </g>

  <!-- Bottom quick links row -->
  <g transform="translate(90 760)">
    <g font-family="Inter, Arial" font-size="14" fill="rgba(0,0,0,0.65)">
      <g transform="translate(0 0)">
        <circle cx="24" cy="24" r="22" fill="rgba(255,255,255,0.75)"/>
        <text x="24" y="30" text-anchor="middle" font-size="18">🏠</text>
        <text x="24" y="68" text-anchor="middle" fill="${ASB_ORANGE}" font-weight="700">Features</text>
      </g>
      <g transform="translate(150 0)">
        <circle cx="24" cy="24" r="22" fill="rgba(255,255,255,0.75)"/>
        <text x="24" y="30" text-anchor="middle" font-size="18">❓</text>
        <text x="24" y="68" text-anchor="middle" fill="${ASB_ORANGE}" font-weight="700">FAQ's</text>
      </g>
      <g transform="translate(300 0)">
        <circle cx="24" cy="24" r="22" fill="rgba(255,255,255,0.75)"/>
        <text x="24" y="30" text-anchor="middle" font-size="18">🛡️</text>
        <text x="24" y="68" text-anchor="middle" fill="${ASB_ORANGE}" font-weight="700">Security</text>
      </g>
      <g transform="translate(470 0)">
        <circle cx="24" cy="24" r="22" fill="rgba(255,255,255,0.75)"/>
        <text x="24" y="30" text-anchor="middle" font-size="18">📝</text>
        <text x="24" y="68" text-anchor="middle" fill="${ASB_ORANGE}" font-weight="700">Open Account</text>
      </g>
      <g transform="translate(670 0)">
        <circle cx="24" cy="24" r="22" fill="rgba(255,255,255,0.75)"/>
        <text x="24" y="30" text-anchor="middle" font-size="18">🎁</text>
        <text x="24" y="68" text-anchor="middle" fill="${ASB_ORANGE}" font-weight="700">Offers</text>
      </g>
      <g transform="translate(820 0)">
        <circle cx="24" cy="24" r="22" fill="rgba(255,255,255,0.75)"/>
        <text x="24" y="30" text-anchor="middle" font-size="18">📍</text>
        <text x="24" y="68" text-anchor="middle" fill="${ASB_ORANGE}" font-weight="700">Locate Us</text>
      </g>
      <g transform="translate(980 0)">
        <circle cx="24" cy="24" r="22" fill="rgba(255,255,255,0.75)"/>
        <text x="24" y="30" text-anchor="middle" font-size="18">🧑‍💼</text>
        <text x="24" y="68" text-anchor="middle" fill="${ASB_ORANGE}" font-weight="700">Help & Support</text>
      </g>
    </g>
  </g>
</svg>
`);
}

export default function LoginPage() {
  const navigate = useNavigate();
  const leftImg = useMemo(() => makeLeftIllustration(), []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

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
    if (!email.trim()) e.email = 'Email is required';
    else if (!EMAIL_REGEX.test(email)) e.email = 'Enter a valid email address';
    if (!password) e.password = 'Password is required';
    if (!audioBlob) e.voice = 'Please record your voice for verification';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;

    setLoading(true);
    try {
      await apiLogin(email, password, audioBlob);
      navigate('/');
    } catch (err) {
      setSubmitError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr]">
        {/* Left visual panel */}
        <div className="relative hidden lg:block">
          <img src={leftImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        </div>

        {/* Right form panel */}
        <div className="flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            <div className="flex items-center gap-3 mb-8">
              <span
                className="inline-flex items-center justify-center w-10 h-10 text-white font-bold text-xl shrink-0 rounded"
                style={{ backgroundColor: ASB_ORANGE }}
              >
                A
              </span>
              <div>
                <p className="font-bold leading-tight" style={{ color: ASB_BLUE }}>
                  myASB
                </p>
                <p className="text-xs text-gray-500">Digital Banking</p>
              </div>
            </div>

            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Welcome!</h1>

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Email</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">✉</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })); }}
                    placeholder="your@email.com"
                    className={`w-full pl-10 pr-3 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })); }}
                    placeholder="Password"
                    className={`w-full pl-10 pr-10 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.password ? 'border-red-500' : 'border-gray-200'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-gray-500 hover:text-gray-700"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Voice verification</label>
                <div className="flex items-center gap-2 flex-wrap">
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
                  <span className="text-xs text-gray-500">
                    {isRecording ? 'Recording...' : hasRecorded ? 'Ready for login' : 'Say your phrase for verification'}
                  </span>
                </div>
                {(voiceError || errors.voice) && (
                  <p className="text-xs text-red-500 mt-1">{voiceError || errors.voice}</p>
                )}
              </div>

              <div className="text-xs text-gray-500">
                <a href="#help" className="hover:underline">
                  Having Trouble Logging In ?
                </a>
              </div>

              {submitError && (
                <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-md">{submitError}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-md text-white font-semibold hover:opacity-95 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ backgroundColor: ASB_ORANGE }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <Link
                to="/signup"
                className="block text-center w-full py-2.5 rounded-md font-semibold border-2 hover:bg-gray-50 transition-colors"
                style={{ borderColor: ASB_BLUE, color: ASB_BLUE }}
              >
                Register Now
              </Link>
            </form>

            <div className="mt-8 flex items-center gap-2 text-xs text-gray-500">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-gray-200">
                ☎
              </span>
              <div>
                <p className="leading-tight">Need Any Help ?</p>
                <p className="leading-tight">
                  Contact Us <span className="font-semibold">111-225-225</span>
                </p>
              </div>
            </div>

            <div className="mt-6 text-xs text-gray-400">
              <Link to="/" className="hover:underline">
                ← Back to ASBank
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

