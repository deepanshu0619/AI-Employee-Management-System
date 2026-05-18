const express = require('express');
const router = express.Router();
const {
  addEmployee,
  getAllEmployees,
  searchEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');
const { validateEmployee } = require('../middleware/validateMiddleware');

/**
 * Employee Routes — All protected by JWT authentication
 *
 * GET    /api/employees          — Get all employees
 * GET    /api/employees/search   — Search/filter employees
 * POST   /api/employees          — Add new employee
 * GET    /api/employees/:id      — Get employee by ID
 * PUT    /api/employees/:id      — Update employee
 * DELETE /api/employees/:id      — Delete employee
 */

router.get('/search', protect, searchEmployees);
router.get('/', protect, getAllEmployees);
router.post('/', protect, validateEmployee, addEmployee);
router.get('/:id', protect, getEmployeeById);
router.put('/:id', protect, updateEmployee);
router.delete('/:id', protect, deleteEmployee);

module.exports = router;
