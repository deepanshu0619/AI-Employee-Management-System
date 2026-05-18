const Employee = require('../models/Employee');

/**
 * @desc    Add a new employee
 * @route   POST /api/employees
 * @access  Private (JWT required)
 */
const addEmployee = async (req, res, next) => {
  try {
    const { name, email, department, skills, performanceScore, experience } = req.body;

    // Check for duplicate email
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: 'Employee with this email already exists',
      });
    }

    const employee = await Employee.create({
      name,
      email,
      department,
      skills,
      performanceScore,
      experience,
    });

    res.status(201).json({
      success: true,
      message: 'Employee stored successfully',
      data: employee,
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages,
      });
    }
    next(error);
  }
};

/**
 * @desc    Get all employees
 * @route   GET /api/employees
 * @access  Private (JWT required)
 */
const getAllEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Search employees by department, name, or skills
 * @route   GET /api/employees/search?department=X&name=Y&skills=Z
 * @access  Private (JWT required)
 */
const searchEmployees = async (req, res, next) => {
  try {
    const { department, name, skills } = req.query;
    const filter = {};

    if (department) {
      filter.department = department;
    }
    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }
    if (skills) {
      filter.skills = { $in: skills.split(',').map((s) => new RegExp(s.trim(), 'i')) };
    }

    const employees = await Employee.find(filter).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single employee by ID
 * @route   GET /api/employees/:id
 * @access  Private (JWT required)
 */
const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }
    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update employee by ID
 * @route   PUT /api/employees/:id
 * @access  Private (JWT required)
 */
const updateEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: employee,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages,
      });
    }
    next(error);
  }
};

/**
 * @desc    Delete employee by ID
 * @route   DELETE /api/employees/:id
 * @access  Private (JWT required)
 */
const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addEmployee,
  getAllEmployees,
  searchEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};
