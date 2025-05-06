// src/components/StudentList.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import StudentForm from "./StudentForm"; // We might reuse this or create a separate EditForm

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    age: "",
    course: "",
    emailid: "",
    phoneno: "",
    address: "",
  });
  const [editSuccessMessage, setEditSuccessMessage] = useState("");
  const [editErrorMessage, setEditErrorMessage] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/students");
        setStudents(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to load students.");
        setLoading(false);
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/students/${id}`);
      setStudents(students.filter((student) => student.id !== id));
      setDeleteMessage(`Student with ID ${id} deleted successfully!`);
      setTimeout(() => setDeleteMessage(""), 3000);
      setError("");
    } catch (error) {
      console.error("Error deleting student:", error);
      setError("Failed to delete student.");
      setDeleteMessage("");
    }
  };

  const handleEdit = (student) => {
    setEditingStudentId(student.id);
    setEditFormData({ ...student });
    setEditSuccessMessage("");
    setEditErrorMessage("");
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    setEditSuccessMessage("");
    setEditErrorMessage("");
    try {
      const response = await axios.put(
        `http://localhost:5000/api/students/${editingStudentId}`,
        editFormData,
      );
      setStudents(
        students.map((student) =>
          student.id === editingStudentId ? response.data : student,
        ),
      );
      setEditingStudentId(null);
      setEditSuccessMessage("Student updated successfully!");
      // Refresh student list after update for simplicity
      const fetchStudents = async () => {
        try {
          const response = await axios.get(
            "http://localhost:5000/api/students",
          );
          setStudents(response.data);
          setLoading(false);
        } catch (error) {
          setError("Failed to load students.");
          setLoading(false);
          console.error("Error fetching students:", error);
        }
      };
      fetchStudents();
    } catch (error) {
      console.error("Error updating student:", error);
      setEditErrorMessage(
        error.response?.data?.message || "Failed to update student.",
      );
      if (error.response?.data?.errors) {
        setEditErrorMessage(
          error.response.data.errors.map((err) => err.msg).join(", "),
        );
      }
    }
  };

  if (loading) {
    return <p>Loading students...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <h2>Student List</h2>
      {deleteMessage && <p style={{ color: "green" }}>{deleteMessage}</p>}
      {editSuccessMessage && (
        <p style={{ color: "green" }}>{editSuccessMessage}</p>
      )}
      {editErrorMessage && <p style={{ color: "red" }}>{editErrorMessage}</p>}
      {students.map((student) => (
        <div key={student.id}>
          {editingStudentId === student.id ? (
            <form onSubmit={handleUpdateStudent}>
              <h3>Edit Student</h3>
              <div>
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditInputChange}
                  required
                />
              </div>
              <div>
                <label>Age:</label>
                <input
                  type="number"
                  name="age"
                  value={editFormData.age}
                  onChange={handleEditInputChange}
                />
              </div>
              <div>
                <label>Course:</label>
                <input
                  type="text"
                  name="course"
                  value={editFormData.course}
                  onChange={handleEditInputChange}
                />
              </div>
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  name="emailid"
                  value={editFormData.emailid}
                  onChange={handleEditInputChange}
                  required
                />
              </div>
              <div>
                <label>Phone:</label>
                <input
                  type="tel"
                  name="phoneno"
                  value={editFormData.phoneno}
                  onChange={handleEditInputChange}
                />
              </div>
              <div>
                <label>Address:</label>
                <textarea
                  name="address"
                  value={editFormData.address}
                  onChange={handleEditInputChange}
                />
              </div>
              <button type="submit">Save Changes</button>
              <button onClick={() => setEditingStudentId(null)}>Cancel</button>
            </form>
          ) : (
            <table>
              <tbody>
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.age}</td>
                  <td>{student.course}</td>
                  <td>{student.emailid}</td>
                  <td>{student.phoneno}</td>
                  <td>{student.address}</td>
                  <td>
                    <button onClick={() => handleEdit(student)}>Edit</button>
                    <button onClick={() => handleDelete(student.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      ))}
      {students.length === 0 && !loading && <p>No students added yet.</p>}
    </div>
  );
};

export default StudentList;
