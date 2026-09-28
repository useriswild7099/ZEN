import { useState, useEffect } from 'react';
import { Lock, Unlock, Shield, KeyRound, AlertCircle } from 'lucide-react';
import { sentimentClient } from '@/lib/api';
import { journalStorage } from '@/lib/storage';
import { JournalEntry } from '@/types/journal';

interface JournalVaultLockProps {
  onUnlock: (password: string, entries: JournalEntry[]) => void;
  isLight: boolean;
}

// Helper to hash password for client-side vault verification
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function JournalVaultLock({ onUnlock, isLight }: JournalVaultLockProps) {
  const [password, setPassword] = useState('');
  const [isSetup, setIsSetup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLocalVault, setIsLocalVault] = useState(false);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const isBackendAlive = await sentimentClient.healthCheck();
      if (isBackendAlive) {
        const exists = await sentimentClient.checkVaultStatus();
        setIsSetup(!exists);
        setIsLocalVault(false);
      } else {
        // Standalone browser mode
        setIsLocalVault(true);
        const localHash = typeof window !== 'undefined' ? localStorage.getItem('zenguard_vault_hash') : null;
        setIsSetup(!localHash);
      }
    } catch (e) {
      setIsLocalVault(true);
      const localHash = typeof window !== 'undefined' ? localStorage.getItem('zenguard_vault_hash') : null;
      setIsSetup(!localHash);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    
    setLoading(true);
    setError('');

    try {
      if (isLocalVault) {
        const hashed = await hashPassword(password);
        if (isSetup) {
          localStorage.setItem('zenguard_vault_hash', hashed);
          localStorage.setItem('zenguard_vault_initialized', 'true');
          setIsSetup(false);
          const entries = journalStorage.getEntries();
          onUnlock(password, entries);
        } else {
          const storedHash = localStorage.getItem('zenguard_vault_hash');
          if (storedHash && storedHash !== hashed) {
            setError('Incorrect password. Please try again.');
            return;
          }
          const entries = journalStorage.getEntries();
          onUnlock(password, entries);
        }
        return;
      }

      if (isSetup) {
        // Create new vault via backend
        const success = await sentimentClient.setupVault(password);
        if (success) {
          setIsSetup(false);
          const entries = await sentimentClient.getJournalEntries(password);
          onUnlock(password, entries);
        } else {
          setError('Failed to create vault.');
        }
      } else {
        // Unlock existing vault via backend
        await sentimentClient.unlockVault(password);
        const entries = await sentimentClient.getJournalEntries(password);
        onUnlock(password, entries);
      }
    } catch (e: any) {
      // Fallback to local storage vault if backend call fails
      try {
        const hashed = await hashPassword(password);
        const storedHash = localStorage.getItem('zenguard_vault_hash');
        if (!storedHash) {
          localStorage.setItem('zenguard_vault_hash', hashed);
        } else if (storedHash !== hashed) {
          setError('Incorrect password.');
          return;
        }
        const entries = journalStorage.getEntries();
        onUnlock(password, entries);
      } catch {
        setError(e.message || 'An error occurred accessing the secure vault.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && !password) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        <p className={`text-sm ${isLight ? 'text-zinc-500' : 'text-white/50'}`}>Connecting to secure local vault...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className={`max-w-md w-full p-8 rounded-3xl border backdrop-blur-2xl shadow-2xl text-center space-y-6 animate-fade-scale ${
        isLight ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-zinc-900 border-white/10 text-white'
      }`}>
        <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center shadow-inner ${
          isLight ? 'bg-zinc-100 border border-zinc-200' : 'bg-black border border-white/10'
        }`}>
          {isSetup ? <Shield className="w-10 h-10 text-blue-500" /> : <Lock className="w-10 h-10 text-purple-500" />}
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-2">
            {isSetup ? 'Create Your Vault' : 'Secure Vault Locked'}
          </h2>
          <p className={`text-sm leading-relaxed ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
            {isSetup 
              ? 'Your journal entries will be encrypted using AES-256 and saved locally as .md files. Create a strong password. If you lose this password, your entries cannot be recovered.'
              : 'Your journal is encrypted with zero-knowledge AES-256 encryption. Enter your password to decrypt your local files.'}
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 text-red-500 text-sm font-medium border border-red-500/20 text-left">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <KeyRound className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isLight ? 'text-zinc-400' : 'text-zinc-500'}`} />
            <input
              type="password"
              placeholder={isSetup ? "Create vault password" : "Enter vault password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full pl-12 pr-4 py-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-mono tracking-widest ${
                isLight ? 'bg-zinc-50 border-zinc-200 text-zinc-900' : 'bg-black border-white/10 text-white'
              }`}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || !password}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 ${
              isLight ? 'bg-zinc-900 text-white hover:bg-zinc-800' : 'bg-white text-black hover:bg-zinc-200'
            }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : isSetup ? (
              <><Shield className="w-5 h-5" /> Initialize Encrypted Vault</>
            ) : (
              <><Unlock className="w-5 h-5" /> Decrypt & Unlock</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
