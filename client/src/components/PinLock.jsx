import { useState } from 'react';

const PIN_KEY = 'zhust-app-pin';

const hashPin = async (value) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);

  if (window.crypto?.subtle) {
    const hash = await window.crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  }

  let fallback = 5381;
  for (let index = 0; index < value.length; index += 1) {
    fallback = ((fallback << 5) + fallback) + value.charCodeAt(index);
  }

  return (fallback >>> 0).toString(16);
};

const readStoredPin = () => {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.localStorage.getItem(PIN_KEY) || '';
};

export default function PinLock({ children }) {
  const [storedPinHash, setStoredPinHash] = useState(() => readStoredPin());
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [enterPin, setEnterPin] = useState('');
  const [message, setMessage] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!storedPinHash) {
      if (newPin.length < 4) {
        setMessage('PIN must be at least 4 digits.');
        return;
      }

      if (newPin !== confirmPin) {
        setMessage('PINs do not match.');
        return;
      }

      const hash = await hashPin(newPin);
      window.localStorage.setItem(PIN_KEY, hash);
      setStoredPinHash(hash);
      setMessage('PIN saved.');
      setNewPin('');
      setConfirmPin('');
      setIsUnlocked(true);
      return;
    }

    const hash = await hashPin(enterPin);
    if (hash === storedPinHash) {
      setMessage('');
      setEnterPin('');
      setIsUnlocked(true);
      return;
    }

    setMessage('Incorrect PIN. Try again.');
  };

  if (isUnlocked) {
    return children;
  }

  return (
    <>
      {children}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 text-white shadow-2xl shadow-slate-950/40">
          <div className="mb-5">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Secure Access</p>
            <h2 className="mt-2 text-2xl font-semibold">ZHUST Command Center</h2>
            <p className="mt-2 text-sm text-slate-300">
              Set a PIN on first use, then enter it next time to unlock.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!storedPinHash ? (
              <>
                <input
                  type="password"
                  value={newPin}
                  onChange={(event) => setNewPin(event.target.value)}
                  placeholder="Set PIN (min 4)"
                  autoComplete="new-password"
                  className="w-full rounded-2xl border border-white/10 bg-slate-800 px-6 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50"
                  minLength={4}
                  required
                />
                <input
                  type="password"
                  value={confirmPin}
                  onChange={(event) => setConfirmPin(event.target.value)}
                  placeholder="Confirm PIN"
                  autoComplete="new-password"
                  className="w-full rounded-2xl border border-white/10 bg-slate-800 px-6 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50"
                  minLength={4}
                  required
                />
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3.5 text-sm font-semibold text-white transition hover:opacity-95 hover:shadow-lg hover:shadow-cyan-500/20"
                >
                  Save PIN & Unlock
                </button>
              </>
            ) : (
              <>
                <input
                  type="password"
                  value={enterPin}
                  onChange={(event) => setEnterPin(event.target.value)}
                  placeholder="Enter PIN"
                  autoComplete="current-password"
                  className="w-full rounded-2xl border border-white/10 bg-slate-800 px-6 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50"
                  minLength={4}
                  required
                />
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3.5 text-sm font-semibold text-white transition hover:opacity-95 hover:shadow-lg hover:shadow-cyan-500/20"
                >
                  Unlock
                </button>
              </>
            )}

            {message ? (
              <p className="mt-3 text-sm text-rose-300" role="status" aria-live="polite">
                {message}
              </p>
            ) : null}
          </form>
        </div>
      </div>
    </>
  );
}
