import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EmployeeList = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState({ department: '', position: '' });
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Fetch employees on component load
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Fetch employees from the backend
  const fetchEmployees = () => {
    axios
      .get('https://one01419226-comp3123-assignment2-backend-5ko1.onrender.com/api/v1/emp/employees')
      .then((response) => {
        setEmployees(response.data);
        setFilteredEmployees(response.data); // Initialize filtered list
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  // Delete employee
  const deleteEmployee = (empId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      axios
        .delete('https://one01419226-comp3123-assignment2-backend-5ko1.onrender.com/api/v1/emp/employees', {
          params: { empId },
        })
        .then(() => {
          alert('Employee deleted successfully!');
          fetchEmployees();
        })
        .catch((error) => {
          console.error('Error deleting employee:', error);
          alert('Failed to delete employee. Please try again.');
        });
    }
  };

  // Search functionality
  const handleSearch = () => {
    const { department, position } = search;
    const filtered = employees.filter(
      (employee) =>
        (!department || employee.department.toLowerCase().includes(department.toLowerCase())) &&
        (!position || employee.position.toLowerCase().includes(position.toLowerCase()))
    );
    setFilteredEmployees(filtered);
  };

  // Reset search filters
  const resetFilters = () => {
    setSearch({ department: '', position: '' });
    setFilteredEmployees(employees);
  };

  return (
    <div>
      <h1>Employee Management</h1>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => navigate('/employees/add')}>Add Employee</button>
      </div>

      {/* Search Section */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by Department"
          value={search.department}
          onChange={(e) => setSearch({ ...search, department: e.target.value })}
        />
        <input
          type="text"
          placeholder="Search by Position"
          value={search.position}
          onChange={(e) => setSearch({ ...search, position: e.target.value })}
        />
        <button onClick={handleSearch}>Search</button>
        <button onClick={resetFilters}>Reset</button>
      </div>

      {/* Employee Table */}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <table border="1" style={{ width: '100%', textAlign: 'left' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Position</th>
            <th>Department</th>
            <th>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((employee) => (
            <tr key={employee._id}>
              <td>{employee._id}</td>
              <td>
                {employee.first_name} {employee.last_name}
              </td>
              <td>{employee.email}</td>
              <td>{employee.position}</td>
              <td>{employee.department}</td>
              <td>{employee.salary}</td>
              <td>
                <button onClick={() => setSelectedEmployee(employee)}>View Details</button>
                <button onClick={() => navigate(`/employees/updateEmployee/${employee._id}`)}>Update</button>
                <button onClick={() => deleteEmployee(employee._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* View Details Modal */}
      {selectedEmployee && (
        <div style={{ background: 'rgba(0, 0, 0, 0.5)', padding: '20px', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
          <div style={{ background: 'white', padding: '20px', margin: 'auto', width: '50%' }}>
            <h2>Employee Details</h2>
            <p>ID: {selectedEmployee._id}</p>
            <p>
              Name: {selectedEmployee.first_name} {selectedEmployee.last_name}
            </p>
            <p>Email: {selectedEmployee.email}</p>
            <p>Position: {selectedEmployee.position}</p>
            <p>Department: {selectedEmployee.department}</p>
            <p>Salary: {selectedEmployee.salary}</p>
            <p>Date of Joining: {new Date(selectedEmployee.date_of_joining).toLocaleDateString()}</p>
            <button onClick={() => setSelectedEmployee(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
