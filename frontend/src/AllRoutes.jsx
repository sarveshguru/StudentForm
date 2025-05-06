import React from "react";
import { Routes, Route } from "react-router-dom";
import StudentFrom from "./components/StudentFrom";
import StudentList from "./components/StudentList";
const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<StudentFrom />} />
      <Route path="/StudentList" element={<StudentList />} />
    </Routes>
  );
};

export default AllRoutes;
