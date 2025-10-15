// pages/admin/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../hooks/useAuth';
import '../../assets/styles/globals.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/login');
      return;
    }
    // Simulate loading users
    setTimeout(() => {
      setUsers([
        {
          id: 1,
          username: 'john_doe',
          email: 'john@example.com',
          role: 'customer',
          status: 'active',
          joinDate: '2024-01-15',
          orderCount: 5
        },
        {
          id: 2,
          username: 'jane_smith',
          email: 'jane@example.com',
          role: 'customer',
          status: 'active',
          joinDate: '2024-02-20',
          orderCount: 12
        },
        {
          id: 3,
          username: 'admin_user',
          email: 'admin@example.com',
          role: 'admin',
          status: 'active',
          joinDate: '2024-01-01',
          orderCount: 0
        },
        {
          id: 4,
          username: 'bob_wilson',
          email: 'bob@example.com',
          role: 'customer',
          status: 'inactive',
          joinDate: '2024-03-10',
          orderCount: 2
        }
      ]);
      setLoading(false);
    }, 1000);
  }, [user, isAdmin, navigate]);

  const filteredUsers = users.filter(user => 
    (user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (roleFilter === 'all' || user.role === roleFilter)
  );

  const handleEditUser = (userId) => {
    navigate(`/admin/users/edit/${userId}`);
  };

  const handleToggleStatus = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  const handleChangeRole = (userId, newRole) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="App">
      <Header />
      <main className="admin-page">
        <div className="admin-header">
          <h1>User Management</h1>
          <p>Manage user accounts and permissions</p>
        </div>

        <div className="admin-actions">
          <div className="search-filter">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select 
              value={roleFilter} 
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="customer">Customers</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>

        <div className="admin-content">
          {loading ? (
            <div className="loading">Loading users...</div>
          ) : (
            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Orders</th>
                    <th>Join Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-info">
                          <strong>{user.username}</strong>
                          <span>{user.email}</span>
                        </div>
                      </td>
                      <td>
                        <select 
                          value={user.role}
                          onChange={(e) => handleChangeRole(user.id, e.target.value)}
                          className="role-select"
                        >
                          <option value="customer">Customer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>
                        <span className={`status-badge ${user.status}`}>
                          {user.status}
                        </span>
                      </td>
                      <td>{user.orderCount}</td>
                      <td>{user.joinDate}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn-secondary"
                            onClick={() => handleEditUser(user.id)}
                          >
                            Edit
                          </button>
                          <button 
                            className={`btn-${user.status === 'active' ? 'warning' : 'success'}`}
                            onClick={() => handleToggleStatus(user.id)}
                          >
                            {user.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserManagement;