import React, { useState } from 'react';

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

const SearchFilter = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    department: '',
    name: '',
    skills: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    
    // Call the parent search function immediately on change
    onSearch(newFilters);
  };

  const handleClear = () => {
    const cleared = { department: '', name: '', skills: '' };
    setFilters(cleared);
    onSearch(cleared);
  };

  return (
    <div className="glass-card mb-4">
      <div className="flex justify-between items-center mb-3">
        <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Search & Filter</h4>
        {(filters.department || filters.name || filters.skills) && (
          <button onClick={handleClear} className="btn btn-secondary btn-sm" style={{ padding: '0.2rem 0.6rem', fontSize: '0.8rem' }}>
            Clear Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <input
            type="text"
            name="name"
            placeholder="Search by name..."
            className="form-control"
            value={filters.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <select
            name="department"
            className="form-control"
            value={filters.department}
            onChange={handleChange}
          >
            <option value="">All Departments</option>
            {DEPARTMENTS.map((dept) => (
               <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        <div>
          <input
            type="text"
            name="skills"
            placeholder="Search by skill (e.g. React)..."
            className="form-control"
            value={filters.skills}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
