import { useState } from "react";

export default function MiniLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    alert(`Logged in as: ${email}`);
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: 20 }}>
      <h2>Mini Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button type="submit">Sign In</button>
    </form>
  );
}
