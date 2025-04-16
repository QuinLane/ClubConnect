import { useState } from 'react';

function LoginPage() {
  const [ucid, setUcid] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ucid, password }),
    });

    if (res.ok) {
      const data = await res.json();
      // Save token or user info to localStorage or context if needed
      alert('Login successful');
      setError('');
      // Redirect or load protected page here
    } else {
      const err = await res.json();
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="UCID"
          value={ucid}
          onChange={(e) => setUcid(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button type="submit" className="bg-blue-600 text-white py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
