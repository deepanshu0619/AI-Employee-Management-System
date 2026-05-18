/**
 * Validation Middleware
 * Validates request body for employee and auth routes.
 */

/**
 * Validate employee creation/update request body
 */
const validateEmployee = (req, res, next) => {
  const { name, email, department, skills, performanceScore, experience } = req.body;
  const errors = [];

  if (!name || name.trim().length === 0) {
    errors.push('Employee name is required');
  }
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    errors.push('A valid email is required');
  }
  if (!department) {
    errors.push('Department is required');
  }
  if (!skills || !Array.isArray(skills) || skills.length === 0) {
    errors.push('At least one skill is required (as an array)');
  }
  if (performanceScore === undefined || performanceScore === null) {
    errors.push('Performance score is required');
  } else if (performanceScore < 0 || performanceScore > 100) {
    errors.push('Performance score must be between 0 and 100');
  }
  if (experience === undefined || experience === null) {
    errors.push('Years of experience is required');
  } else if (experience < 0) {
    errors.push('Experience cannot be negative');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors,
    });
  }

  next();
};

/**
 * Validate signup request body
 */
const validateSignup = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || name.trim().length === 0) {
    errors.push('Name is required');
  }
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    errors.push('A valid email is required');
  }
  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors,
    });
  }

  next();
};

/**
 * Validate login request body
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email) errors.push('Email is required');
  if (!password) errors.push('Password is required');

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors,
    });
  }

  next();
};

module.exports = { validateEmployee, validateSignup, validateLogin };
