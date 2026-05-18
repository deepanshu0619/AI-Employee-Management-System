import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeService } from '../services/api';
import { motion } from 'framer-motion';

const DEPARTMENTS = [
  'Development',
  'Design',
  'Marketing',
  'Sales',
  'HR',
  'Finance',
  'Operations',
  'Management',
];

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    skills: '',
    performanceScore: 50,
    experience: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Process skills from comma separated string to array
      const processedData = {
        ...formData,
        skills: formData.skills.split(',').map((skill) => skill.trim()).filter((s) => s),
        performanceScore: Number(formData.performanceScore),
        experience: Number(formData.experience),
      };

      await employeeService.create(processedData);
      navigate('/');
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.join(', '));
      } else {
        setError(err.response?.data?.message || 'Failed to add employee');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px', marginTop: '2rem' }}>
      <div className="flex justify-between items-center mb-4">
        <h2>Add New Employee</h2>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)}>
          &larr; Back
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-card"
      >
        {error && (
          <div className="glass-panel" style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)', padding: '1rem', marginBottom: '1.5rem' }}>
            <p className="text-danger" style={{ margin: 0 }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-2">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g. Aman Verma"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="e.g. aman@gmail.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Department</label>
            <select
              name="department"
              className="form-control"
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select Department</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Years of Experience</label>
            <input
              type="number"
              name="experience"
              className="form-control"
              value={formData.experience}
              onChange={handleChange}
              required
              min="0"
              placeholder="e.g. 3"
            />
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Skills (comma separated)</label>
            <input
              type="text"
              name="skills"
              className="form-control"
              value={formData.skills}
              onChange={handleChange}
              required
              placeholder="e.g. React, Node.js, MongoDB"
            />
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label flex justify-between">
              <span>Performance Score</span>
              <span style={{ color: 'var(--primary)' }}>{formData.performanceScore} / 100</span>
            </label>
            <input
              type="range"
              name="performanceScore"
              className="form-control"
              style={{ padding: '0', height: '6px', background: '#334155', outline: 'none' }}
              value={formData.performanceScore}
              onChange={handleChange}
              min="0"
              max="100"
            />
          </div>

          <div className="form-group mt-4" style={{ gridColumn: '1 / -1' }}>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? <div className="spinner"></div> : 'Register Employee'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EmployeeForm;
