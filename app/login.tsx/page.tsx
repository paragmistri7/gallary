"use client"

import React, { useState } from 'react'
import { supabase } from '../../supabaseClient'
import { useRouter } from 'next/navigation'

// 3 views: 'login' | 'signup' | 'forgot'
type View = 'login' | 'signup' | 'forgot'

export default function AuthPage() {
  const [view, setView] = useState<View>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

  const resetForm = () => {
    setUsername('')
    setPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setMessage(null)
  }

  const switchView = (v: View) => {
    setView(v)
    resetForm()
  }

  // ✅ SIGN UP
  const handleSignUp = async () => {
    if (!username || !password) {
      setMessage({ text: 'Please fill in all fields', type: 'error' })
      return
    }

    setLoading(true)
    try {
            if (!supabase) { throw new Error('Supabase client not initialized')}
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .single()

      if (existing) {
        setMessage({ text: 'Username already taken!', type: 'error' })
        return
      }

      const { data, error } = await supabase
        .from('users')
        .insert([{ username, password }])
        .select()

      if (error) { setMessage({ text: error.message, type: 'error' }); return }

      console.log('Signed up:', data)
      setMessage({ text: 'Account created! You can now log in.', type: 'success' })
      setTimeout(() => switchView('login'), 1500)
    } catch {
      setMessage({ text: 'Unexpected error occurred', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  // ✅ LOGIN
  const handleLogin = async () => {
    if (!username || !password) {
      setMessage({ text: 'Please fill in all fields', type: 'error' })
      return
    }

    setLoading(true)
    try {
      if (!supabase) { throw new Error('Supabase client not initialized')}
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single()

      if (error || !data) {
        console.log('Login failed 111:', error)
        setMessage({ text: 'Invalid username or password', type: 'error' })
        return
      }

      console.log('Logged in:', data)
        setMessage({ text: `Welcome back, ${data.username}! 👋`, type: 'success' })
        router.push('/dashboard')
    } catch(error) {
      console.log('Login error:', error)
      setMessage({ text: 'Unexpected error occurred', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  // ✅ FORGOT PASSWORD — verify username exists, then update password
  const handleForgotPassword = async () => {
    if (!username || !newPassword || !confirmPassword) {
      setMessage({ text: 'Please fill in all fields', type: 'error' })
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage({ text: 'Passwords do not match!', type: 'error' })
      return
    }

    if (newPassword.length < 4) {
      setMessage({ text: 'Password must be at least 4 characters', type: 'error' })
      return
    }

    setLoading(true)
    try {
      // Step 1: Check if username exists
            if (!supabase) { throw new Error('Supabase client not initialized')}
      const { data: existing, error: fetchError } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .single()

      if (fetchError || !existing) {
        setMessage({ text: 'No account found with this username', type: 'error' })
        return
      }

      // Step 2: Update password
      const { error: updateError } = await supabase
        .from('users')
        .update({ password: newPassword })
        .eq('username', username)

      if (updateError) {
        setMessage({ text: updateError.message, type: 'error' })
        return
      }

      setMessage({ text: 'Password reset successfully! Please log in.', type: 'success' })
      setTimeout(() => switchView('login'), 1800)
    } catch {
      setMessage({ text: 'Unexpected error occurred', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const headerMap = {
    login:  { title: 'Welcome back',   subtitle: 'Sign in to your account' },
    signup: { title: 'Create account', subtitle: 'Join us today'           },
    forgot: { title: 'Reset password', subtitle: 'Enter your new password' },
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logo}>⚡</div>
          <h1 style={styles.title}>{headerMap[view].title}</h1>
          <p style={styles.subtitle}>{headerMap[view].subtitle}</p>
        </div>

        {/* Tabs — only on login/signup */}
        {view !== 'forgot' && (
          <div style={styles.tabs}>
            <button
              style={{ ...styles.tab, ...(view === 'login' ? styles.tabActive : {}) }}
              onClick={() => switchView('login')}
            >
              Login
            </button>
            <button
              style={{ ...styles.tab, ...(view === 'signup' ? styles.tabActive : {}) }}
              onClick={() => switchView('signup')}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* ── LOGIN FORM ── */}
        {view === 'login' && (
          <div style={styles.form}>
            <Field label="Username">
              <input type="text" placeholder="Enter your username" value={username}
                onChange={e => setUsername(e.target.value)} style={styles.input} />
            </Field>

            <Field label="Password">
              <input type="password" placeholder="Enter your password" value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                style={styles.input} />
            </Field>

            {/* Forgot password link */}
            <div style={{ textAlign: 'right', marginTop: '-0.4rem' }}>
              <span style={styles.forgotLink} onClick={() => switchView('forgot')}>
                Forgot password?
              </span>
            </div>

            <MessageBox message={message} />

            <button onClick={handleLogin} disabled={loading}
              style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Please wait...' : 'Login'}
            </button>

            <p style={styles.switchText}>
              {"Don't have an account? "}
              <span style={styles.switchLink} onClick={() => switchView('signup')}>Sign Up</span>
            </p>
          </div>
        )}

        {/* ── SIGN UP FORM ── */}
        {view === 'signup' && (
          <div style={styles.form}>
            <Field label="Username">
              <input type="text" placeholder="Choose a username" value={username}
                onChange={e => setUsername(e.target.value)} style={styles.input} />
            </Field>

            <Field label="Password">
              <input type="password" placeholder="Choose a password" value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSignUp()}
                style={styles.input} />
            </Field>

            <MessageBox message={message} />

            <button onClick={handleSignUp} disabled={loading}
              style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Please wait...' : 'Create Account'}
            </button>

            <p style={styles.switchText}>
              {'Already have an account? '}
              <span style={styles.switchLink} onClick={() => switchView('login')}>Login</span>
            </p>
          </div>
        )}

        {/* ── FORGOT PASSWORD FORM ── */}
        {view === 'forgot' && (
          <div style={styles.form}>
            <Field label="Username">
              <input type="text" placeholder="Enter your username" value={username}
                onChange={e => setUsername(e.target.value)} style={styles.input} />
            </Field>

            <Field label="New Password">
              <input type="password" placeholder="Enter new password" value={newPassword}
                onChange={e => setNewPassword(e.target.value)} style={styles.input} />
            </Field>

            <Field label="Confirm New Password">
              <input type="password" placeholder="Confirm new password" value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleForgotPassword()}
                style={styles.input} />
            </Field>

            <MessageBox message={message} />

            <button onClick={handleForgotPassword} disabled={loading}
              style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Please wait...' : 'Reset Password'}
            </button>

            <p style={styles.switchText}>
              {'Remember your password? '}
              <span style={styles.switchLink} onClick={() => switchView('login')}>Back to Login</span>
            </p>
          </div>
        )}

      </div>
    </div>
  )
}

// ── Small helper components ──

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <label style={styles.label}>{label}</label>
      {children}
    </div>
  )
}

function MessageBox({ message }: { message: { text: string; type: 'success' | 'error' } | null }) {
  if (!message) return null
  return (
    <div style={{
      padding: '0.75rem 1rem',
      borderRadius: '8px',
      fontSize: '0.9rem',
      fontWeight: 500,
      backgroundColor: message.type === 'success' ? '#e6f9f0' : '#fdecea',
      color: message.type === 'success' ? '#1a7f4b' : '#c0392b',
      border: `1px solid ${message.type === 'success' ? '#a3dfc0' : '#f5c2c2'}`,
    }}>
      {message.type === 'success' ? '✅' : '❌'} {message.text}
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f2f5',
    fontFamily: 'sans-serif',
    padding: '1rem',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '2.5rem 2rem',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  },
  header: { textAlign: 'center', marginBottom: '1.5rem' },
  logo: { fontSize: '2.5rem', marginBottom: '0.5rem' },
  title: { fontSize: '1.6rem', fontWeight: 700, color: '#1a1a2e', margin: '0 0 0.25rem' },
  subtitle: { color: '#888', fontSize: '0.95rem', margin: 0 },
  tabs: {
    display: 'flex', backgroundColor: '#f0f2f5',
    borderRadius: '10px', padding: '4px', marginBottom: '1.5rem',
  },
  tab: {
    flex: 1, padding: '0.5rem', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontSize: '0.95rem', fontWeight: 500,
    backgroundColor: 'transparent', color: '#888', transition: 'all 0.2s',
  },
  tabActive: {
    backgroundColor: '#ffffff', color: '#1a1a2e',
    boxShadow: '0 1px 6px rgba(0,0,0,0.1)',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  label: { fontSize: '0.875rem', fontWeight: 600, color: '#444' },
  input: {
    padding: '0.75rem 1rem', borderRadius: '10px',
    border: '1.5px solid #e0e0e0', fontSize: '0.95rem', outline: 'none',
  },
  button: {
    marginTop: '0.25rem', padding: '0.85rem', borderRadius: '10px',
    border: 'none', backgroundColor: '#4f46e5', color: '#fff',
    fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
  },
  forgotLink: {
    fontSize: '0.85rem', color: '#4f46e5',
    cursor: 'pointer', textDecoration: 'underline',
  },
  switchText: { textAlign: 'center', marginTop: '0.5rem', fontSize: '0.9rem', color: '#888' },
  switchLink: { color: '#4f46e5', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' },
}