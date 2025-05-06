// src/components/StudentForm.js
import React, { useState } from "react";
import axios from "axios";

const StudentForm = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [course, setCourse] = useState("");
  const [emailid, setEmailid] = useState("");
  const [phoneno, setPhoneno] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/students", {
        name,
        age,
        course,
        emailid,
        phoneno,
        address,
      });
      setMessage("Student added successfully!");
      // Optionally clear the form after successful submission
      setName("");
      setAge("");
      setCourse("");
      setEmailid("");
      setPhoneno("");
      setAddress("");
      // You might also want to refresh the student list here
    } catch (error) {
      setError(error.response?.data?.message || "Failed to add student.");
      if (error.response?.data?.errors) {
        setError(error.response.data.errors.map((err) => err.msg).join(", "));
      }
    }
  };

  return (
    <div>
      <h2>Add New Student</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Age:</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
        <div>
          <label>Course:</label>
          <input
            type="text"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={emailid}
            onChange={(e) => setEmailid(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="tel"
            value={phoneno}
            onChange={(e) => setPhoneno(e.target.value)}
          />
        </div>
        <div>
          <label>Address:</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <button type="submit">Add Student</button>
      </form>
    </div>
  );
};

export default StudentForm;
