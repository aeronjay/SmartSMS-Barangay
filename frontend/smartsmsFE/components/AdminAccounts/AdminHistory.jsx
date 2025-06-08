import { useEffect, useState, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import MainTemplate from '../MainTemplate';
import SearchInput from '../SearchInput';
import service from '../../services/service';
import '../../styles/AdminHistory.css';
import { 
  FaHistory, 
  FaUser, 
  FaCog, 
  FaEdit, 
  FaTrash, 
  FaPlus,
  FaUserPlus,
  FaUserMinus,
  FaEnvelope,
  FaFileAlt,
  FaFilter,
  FaCalendarAlt,
  FaClock
} from 'react-icons/fa';

export default function AdminHistory() {
  const { user } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [expandedRows, setExpandedRows] = useState(new Set());
  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await service.getAdminActionHistory(user);
        setHistory(data);
        setFilteredHistory(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  // Filter history based on search and filters
  useEffect(() => {
    let filtered = [...history];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.adminUsername?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.target?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply action filter
    if (selectedAction !== 'all') {
      filtered = filtered.filter(item => 
        item.action?.toLowerCase().includes(selectedAction.toLowerCase())
      );
    }

    // Apply date range filter
    if (selectedDateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (selectedDateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(item => new Date(item.createdAt) >= filterDate);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(item => new Date(item.createdAt) >= filterDate);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(item => new Date(item.createdAt) >= filterDate);
          break;
      }
    }

    setFilteredHistory(filtered);
  }, [history, searchTerm, selectedAction, selectedDateRange]);

  const getActionIcon = (action) => {
    const actionLower = action?.toLowerCase() || '';
    if (actionLower.includes('create') || actionLower.includes('add')) return <FaPlus />;
    if (actionLower.includes('edit') || actionLower.includes('update')) return <FaEdit />;
    if (actionLower.includes('delete') || actionLower.includes('remove')) return <FaTrash />;
    if (actionLower.includes('user')) return <FaUser />;
    if (actionLower.includes('message') || actionLower.includes('sms')) return <FaEnvelope />;
    if (actionLower.includes('document')) return <FaFileAlt />;
    return <FaCog />;
  };

  const getActionBadgeClass = (action) => {
    const actionLower = action?.toLowerCase() || '';
    if (actionLower.includes('create') || actionLower.includes('add')) return 'action-create';
    if (actionLower.includes('edit') || actionLower.includes('update')) return 'action-edit';
    if (actionLower.includes('delete') || actionLower.includes('remove')) return 'action-delete';
    return 'action-default';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-PH', {
      timeZone: 'Asia/Manila',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return `${Math.floor(diffInDays / 7)}w ago`;
  };

  const toggleRowExpansion = (itemId) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(itemId)) {
      newExpandedRows.delete(itemId);
    } else {
      newExpandedRows.add(itemId);
    }
    setExpandedRows(newExpandedRows);
  };

  if (loading) {
    return (
      <MainTemplate headerName="Admin Actions" cardHeader="Admin Action History">
        <div className="loading-state">
          <FaHistory size={48} color="#6b7280" />
          <p>Loading admin action history...</p>
        </div>
      </MainTemplate>
    );
  }

  if (error) {
    return (
      <MainTemplate headerName="Admin Actions" cardHeader="Admin Action History">
        <div className="error-state">
          <p>⚠️ {error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Try Again
          </button>
        </div>
      </MainTemplate>
    );
  }

  return (
    <MainTemplate headerName="Admin Actions" cardHeader="Admin Action History">
      <div className="admin-history-container">
        {/* Filters and Search */}
        <div className="history-controls">
          <div className="search-section">
            <SearchInput 
              search={searchTerm} 
              setSearch={setSearchTerm}
              placeholder="Search by admin, action, or target..."
            />
          </div>
          
          <div className="filter-section">
            <div className="filter-group">
              <FaFilter className="filter-icon" />              <select 
                value={selectedAction} 
                onChange={(e) => setSelectedAction(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Actions</option>
                <option value="create">Create/Add</option>
                <option value="edit">Edit/Update</option>
                <option value="delete">Delete/Remove</option>
                <option value="resident">Resident Actions</option>
                <option value="broadcast">Broadcast/SMS</option>
                <option value="document">Document Actions</option>
                <option value="admin">Admin Account Actions</option>
              </select>
            </div>
            
            <div className="filter-group">
              <FaCalendarAlt className="filter-icon" />
              <select 
                value={selectedDateRange} 
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Past Week</option>
                <option value="month">Past Month</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="history-stats">
          <div className="stat-card">
            <FaHistory className="stat-icon" />
            <div className="stat-info">
              <span className="stat-number">{filteredHistory.length}</span>
              <span className="stat-label">Total Actions</span>
            </div>
          </div>
          <div className="stat-card">
            <FaUser className="stat-icon" />
            <div className="stat-info">
              <span className="stat-number">
                {new Set(filteredHistory.map(item => item.adminUsername)).size}
              </span>
              <span className="stat-label">Active Admins</span>
            </div>
          </div>
          <div className="stat-card">
            <FaClock className="stat-icon" />
            <div className="stat-info">
              <span className="stat-number">
                {filteredHistory.filter(item => 
                  new Date(item.createdAt) > new Date(Date.now() - 24*60*60*1000)
                ).length}
              </span>
              <span className="stat-label">Today</span>
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="history-table-container">
          {filteredHistory.length === 0 ? (
            <div className="no-data-message">
              <FaHistory size={48} color="#6b7280" />
              <h3>No admin actions found</h3>
              <p>
                {searchTerm || selectedAction !== 'all' || selectedDateRange !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Admin actions will appear here when they occur'
                }
              </p>
            </div>
          ) : (
            <div className="table-container">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>Admin</th>
                    <th>Target</th>
                    <th>Details</th>
                    <th>Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((item) => (
                    <tr key={item._id} className="history-row">
                      <td>
                        <div className="action-cell">
                          <div className={`action-icon ${getActionBadgeClass(item.action)}`}>
                            {getActionIcon(item.action)}
                          </div>
                          <span className={`action-badge ${getActionBadgeClass(item.action)}`}>
                            {item.action}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="admin-cell">
                          <FaUser className="admin-icon" />
                          <span className="admin-name">{item.adminUsername}</span>
                        </div>                      </td>
                      <td>
                        <span className="target-text">{item.target || 'N/A'}</span>
                      </td>
                      <td>
                        <div className="details-cell">
                          {item.details && Object.entries(item.details).length > 0 ? (
                            <div className="details-content">
                              {/* Always show first 2 details */}
                              {Object.entries(item.details).slice(0, 2).map(([k, v]) => (
                                <div key={k} className="detail-item">
                                  <span className="detail-key">{k}:</span>
                                  <span className="detail-value">{String(v)}</span>
                                </div>
                              ))}
                              
                              {/* Show remaining details if expanded */}
                              {expandedRows.has(item._id) && 
                                Object.entries(item.details).slice(2).map(([k, v]) => (
                                  <div key={k} className="detail-item">
                                    <span className="detail-key">{k}:</span>
                                    <span className="detail-value">{String(v)}</span>
                                  </div>
                                ))
                              }
                              
                              {/* Show expand/collapse button if there are more than 2 details */}
                              {Object.entries(item.details).length > 2 && (
                                <button 
                                  className="toggle-details-btn"
                                  onClick={() => toggleRowExpansion(item._id)}
                                >
                                  {expandedRows.has(item._id) 
                                    ? `Show less` 
                                    : `+${Object.entries(item.details).length - 2} more details`
                                  }
                                </button>
                              )}
                            </div>
                          ) : (
                            <span className="no-details">No additional details</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="date-cell">
                          <div className="date-primary">{formatDate(item.createdAt)}</div>
                          <div className="date-secondary">{getTimeAgo(item.createdAt)}</div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </MainTemplate>
  );
}
