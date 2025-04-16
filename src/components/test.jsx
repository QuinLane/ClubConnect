import { useEffect, useState } from "react";
import { getUsers, createUser } from "./api";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  return (
    <div>
      {users.map((u) => (
        <p key={u.id}>
          {u.name} - {u.email}
        </p>
      ))}
      <button
        onClick={() => createUser({ name: "Quin", email: "q@example.com" })}
      >
        Add User
      </button>
    </div>
  );
}
