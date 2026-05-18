import React, { useState, useEffect, useCallback } from 'react';
import { employeeService } from '../services/api';
import SearchFilter from './SearchFilter';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const EmployeeList = ({ setAllEmployees }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchEmployees = useCallback(async (filters = {}) => {
    setLoading(true);
    setError('');
    try {
      let response;
      if (Object.values(filters).some(val => val)) {
        response = await employeeService.search(filters);
      } else {
        response = await employeeService.getAll();
      }
      setEmployees(response.data.data);
      if (setAllEmployees) {
        setAllEmployees(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  }, [setAllEmployees]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeService.delete(id);
        setEmployees(employees.filter(emp => emp._id !== id));
        if (setAllEmployees) {
            // update parent state too
            setAllEmployees(prev => prev.filter(emp => emp._id !== id));
        }
      } catch (err) {
        alert('Failed to delete employee');
      }
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'var(--success)';
    if (score >= 50) return 'var(--warning)';
    return 'var(--danger)';
  };

  return (
    <div className="animate-fade-in">
      <SearchFilter onSearch={fetchEmployees} />

      {error && (
        <div className="glass-panel" style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)', padding: '1rem', marginBottom: '1.5rem' }}>
          <p className="text-danger" style={{ margin: 0 }}>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center" style={{ padding: '3rem' }}>
          <div className="spinner" style={{ width: '40px', height: '40px', borderWidth: '4px' }}></div>
        </div>
      ) : employees.length === 0 ? (
        <div className="glass-panel text-center" style={{ padding: '3rem 1rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>No employees found.</p>
        </div>
      ) : (
        <motion.div className="grid grid-cols-2" variants={containerVariants} initial="hidden" animate="show">
          {employees.map((emp) => (
            <motion.div key={emp._id} variants={itemVariants} className="glass-card flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.2rem' }}>{emp.name}</h3>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{emp.email}</p>
                  </div>
                  <span className="badge badge-primary">{emp.department}</span>
                </div>
                
                <div className="mb-3" style={{ fontSize: '0.9rem' }}>
                  <p style={{ margin: '0 0 0.5rem 0' }}><strong style={{ color: 'var(--text-muted)' }}>Experience:</strong> {emp.experience} years</p>
                  <p style={{ margin: 0 }}><strong style={{ color: 'var(--text-muted)' }}>Performance:</strong> 
                    <span style={{ color: getScoreColor(emp.performanceScore), fontWeight: 'bold', marginLeft: '5px' }}>
                      {emp.performanceScore}/100
                    </span>
                  </p>
                </div>

                <div className="mb-4 flex" style={{ flexWrap: 'wrap', gap: '0.4rem' }}>
                  {emp.skills.map(skill => (
                    <span key={skill} style={{ 
                      fontSize: '0.75rem', 
                      background: 'rgba(255,255,255,0.05)', 
                      padding: '0.2rem 0.5rem', 
                      borderRadius: '4px',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between mt-auto pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                {/* Note: Update flow can be added here, currently just delete to save time */}
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
                  Added: {new Date(emp.createdAt).toLocaleDateString()}
                </span>
                <button onClick={() => handleDelete(emp._id)} className="btn btn-danger btn-sm">Delete</button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default EmployeeList;
