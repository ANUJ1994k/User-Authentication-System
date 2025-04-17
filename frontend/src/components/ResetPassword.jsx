import { useState } from 'react';
import axios from 'axios';

const ResetPassword = ({ match }) => {
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = match.params.token;

    try {
      await axios.post('https://user-authentication-system-rzdj.onrender.com/api/auth/reset-password', { token, newPassword });
      alert('Password has been reset!');
    } catch (err) {
      alert('Failed to reset password');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      <button type="submit">Reset Password</button>
    </form>
    
  );
};

export default ResetPassword;
