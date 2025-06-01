import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    username: '',
    password: '',
    oldPassword: '',
    newPassword: ''
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // for redirection

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      if (isLogin) {
        const res = await axios.post('https://algotronn-backend.vercel.app/login', {
          username: form.username,
          password: form.password
        });
        setMessage(res.data.message);

        if (res.data.message === "Login successful") {
          navigate("/order"); // Redirect after login
        }
      } else {
        const res = await axios.post('https://algotronn-backend.vercel.app/change-password', {
          username: form.username,
          oldPassword: form.oldPassword,
          newPassword: form.newPassword
        });
        setMessage(res.data.message);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      {/* Simple local navbar */}
      <div style={styles.topBar}>
        <h1 style={styles.logo}>Algobazarr Admin</h1>
      </div>

      <div style={styles.container}>
        <h2>{isLogin ? 'Login' : 'Change Password'}</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            style={styles.input}
          />
          {isLogin ? (
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              style={styles.input}
            />
          ) : (
            <>
              <input
                type="password"
                name="oldPassword"
                placeholder="Old Password"
                value={form.oldPassword}
                onChange={handleChange}
                required
                style={styles.input}
              />
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={form.newPassword}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </>
          )}
          <button type="submit" style={styles.button}>
            {isLogin ? 'Login' : 'Change Password'}
          </button>
        </form>
        <p style={styles.toggleText}>
          {isLogin ? 'Want to change password?' : 'Back to login?'}{" "}
          <span onClick={() => setIsLogin(!isLogin)} style={styles.link}>
            Click here
          </span>
        </p>
        {message && <p style={styles.message}>{message}</p>}
      </div>
    </>
  );
};

const styles = {
  topBar: {
    backgroundColor: '#0f172a',
    padding: '1rem 2rem',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  },
  logo: {
    color: '#f1f5f9',
    margin: 0,
    fontSize: '1.75rem',
    fontWeight: '700',
    letterSpacing: '1px',
  },
  container: {
    maxWidth: '420px',
    margin: '4rem auto',
    padding: '2rem',
    borderRadius: '1rem',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 4px 30px rgba(0,0,0,0.1)',
    color: '#f8fafc',
    backgroundColor: '#1e293b',
    transition: 'all 0.3s ease-in-out',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginTop: '1rem',
  },
  input: {
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    borderRadius: '0.5rem',
    border: '1px solid #475569',
    backgroundColor: '#334155',
    color: '#e2e8f0',
    transition: 'border-color 0.2s ease',
  },
  button: {
    padding: '0.75rem 1rem',
    backgroundColor: '#22c55e',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: '600',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  toggleText: {
    marginTop: '1rem',
    fontSize: '0.9rem',
    color: '#cbd5e1',
    textAlign: 'center',
  },
  link: {
    color: '#38bdf8',
    textDecoration: 'underline',
    cursor: 'pointer',
    marginLeft: '4px',
    transition: 'color 0.2s ease',
  },
  message: {
    marginTop: '1.5rem',
    fontSize: '0.95rem',
    fontWeight: '500',
    color: '#facc15', // yellow for feedback, change based on status if desired
    textAlign: 'center',
  },
};

export default AuthForm;