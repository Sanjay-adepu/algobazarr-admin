import React, { useEffect, useState } from 'react';
import Navbar from "./Navbar.jsx";
const UserCard = ({ user }) => (
  <div className="user-card">
    <div className="user-detail"><span className="label">Name:</span> {user.name || 'N/A'}</div>
    <div className="user-detail"><span className="label">Email:</span> {user.email || 'N/A'}</div>
    <div className="user-detail"><span className="label">Mobile:</span> {user.mobile || 'N/A'}</div>
  </div>
);

const UserGroups = () => {
  const [newUsers, setNewUsers] = useState([]);
  const [oldUsers, setOldUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrderNew, setSortOrderNew] = useState('asc');
  const [sortOrderOld, setSortOrderOld] = useState('asc');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://algotronn-backend.vercel.app/users');
        const data = await response.json();
        setNewUsers(data.newUsers || []);
        setOldUsers(data.oldUsers || []);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const sortUsers = (users, order) => {
    return [...users].sort((a, b) => {
      const nameA = a.name?.toLowerCase() || '';
      const nameB = b.name?.toLowerCase() || '';
      return order === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
  };

  return (
    <>
      <Navbar/>

    <div className="user-groups-container">
      <style>
        {`
        .user-groups-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 48px 24px;
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(to bottom right, #f9fafb, #eef2f7);
  min-height: 100vh;
}

.main-header {
  text-align: center;
  font-size: 40px;
  font-weight: 800;
  margin-bottom: 48px;
  color: #111827;
  letter-spacing: -0.5px;
}

.loader {
  text-align: center;
  font-size: 20px;
  color: #6b7280;
  animation: pulse 1.2s infinite;
}

@keyframes pulse {
  0% { opacity: 0.4; }
  50% { opacity: 1; }
  100% { opacity: 0.4; }
}

.section {
  margin-bottom: 64px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 12px;
}

.sub-header {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
}

.sort-select {
  padding: 10px 16px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  background-color: #ffffff;
  font-size: 15px;
  color: #1f2937;
  outline: none;
  transition: all 0.25s ease-in-out;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  appearance: none;
  cursor: pointer;
}

.sort-select:hover {
  border-color: #9ca3af;
}

.sort-select:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.4);
  border-color: #3b82f6;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 28px;
}

.user-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(229, 231, 235, 0.6);
  transition: all 0.3s ease;
}

.user-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.08);
}

.user-detail {
  margin-bottom: 14px;
  font-size: 17px;
  color: #374151;
  line-height: 1.6;
  display: flex;
  flex-wrap: wrap;
  word-break: break-word;
}

.label {
  font-weight: 600;
  color: #111827;
  margin-right: 6px;
  min-width: 70px;
}



        `}
      </style>

      <h1 className="main-header">📋 User Directory</h1>

      {loading ? (
        <div className="loader">Loading users...</div>
      ) : (
        <>
          {/* New Users */}
          <div className="section">
            <div className="section-header">
              <h2 className="sub-header">🟢 New Users ({newUsers.length})</h2>
              <select className="sort-select" value={sortOrderNew} onChange={(e) => setSortOrderNew(e.target.value)}>
                <option value="asc">Sort A-Z</option>
                <option value="desc">Sort Z-A</option>
              </select>
            </div>
            <div className="card-grid">
              {sortUsers(newUsers, sortOrderNew).map((user, idx) => (
                <UserCard key={idx} user={user} />
              ))}
            </div>
          </div>

          {/* Old Users */}
          <div className="section">
            <div className="section-header">
              <h2 className="sub-header">🔵 Old Users ({oldUsers.length})</h2>
              <select className="sort-select" value={sortOrderOld} onChange={(e) => setSortOrderOld(e.target.value)}>
                <option value="asc">Sort A-Z</option>
                <option value="desc">Sort Z-A</option>
              </select>
            </div>
            <div className="card-grid">
              {sortUsers(oldUsers, sortOrderOld).map((user, idx) => (
                <UserCard key={idx} user={user} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
        </>
  );
};

export default UserGroups;