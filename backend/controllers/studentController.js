const db = require("../config/db");

const studentController = {
  getAllStudents: async (req, res) => {
    try {
      const [students] = await db.promise().query("SELECT * FROM students");
      res.status(200).json(students);
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ message: "Failed to fetch students" });
    }
  },

  createStudent: async (req, res) => {
    const { name, age, course, emailid, phoneno, address } = req.body;

    // Optional: Add basic field presence validation
    if (!name || !age || !course || !emailid || !phoneno || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const [result] = await db
        .promise()
        .query(
          "INSERT INTO students (name, age, course, emailid, phoneno, address) VALUES (?, ?, ?, ?, ?, ?)",
          [name, age, course, emailid, phoneno, address],
        );

      res
        .status(201)
        .json({ id: result.insertId, message: "Student created successfully" });
    } catch (error) {
      console.error("Error creating student:", error);
      res.status(500).json({ message: "Failed to create student" });
    }
  },

  getStudentById: async (req, res) => {
    const { id } = req.params;

    try {
      const [rows] = await db
        .promise()
        .query("SELECT * FROM students WHERE id = ?", [id]);

      if (rows.length === 0) {
        return res.status(404).json({ message: "Student not found" });
      }

      res.status(200).json(rows[0]);
    } catch (error) {
      console.error("Error fetching student:", error);
      res.status(500).json({ message: "Failed to fetch student" });
    }
  },

  updateStudent: async (req, res) => {
    const { id } = req.params;
    const { name, age, course, emailid, phoneno, address } = req.body;

    // Optional: Field validation
    if (!name || !age || !course || !emailid || !phoneno || !address) {
      return res
        .status(400)
        .json({ message: "All fields are required for update" });
    }

    try {
      const [result] = await db
        .promise()
        .query(
          "UPDATE students SET name = ?, age = ?, course = ?, emailid = ?, phoneno = ?, address = ? WHERE id = ?",
          [name, age, course, emailid, phoneno, address, id],
        );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Student not found" });
      }

      res.status(200).json({ message: "Student updated successfully" });
    } catch (error) {
      console.error("Error updating student:", error);
      res.status(500).json({ message: "Failed to update student" });
    }
  },

  deleteStudent: async (req, res) => {
    const { id } = req.params;

    try {
      const [result] = await db
        .promise()
        .query("DELETE FROM students WHERE id = ?", [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Student not found" });
      }

      res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
      console.error("Error deleting student:", error);
      res.status(500).json({ message: "Failed to delete student" });
    }
  },
};

module.exports = studentController;

// ---------------------------------------------------------------
// const db = require("../config/db");

// const studentController = {
//   getAllStudents: async (req, res) => {
//     try {
//       const userId = req.user.userId; // Get user ID from the authenticated request
//       const [rows] = await db
//         .promise()
//         .query("SELECT * FROM students WHERE user_id = ?", [userId]);
//       res.status(200).json(rows);
//     } catch (error) {
//       console.error("Error fetching students:", error);
//       res.status(500).json({ message: "Failed to fetch students" });
//     }
//   },

//   createStudent: async (req, res) => {
//     try {
//       const userId = req.user.userId; // Get user ID
//       const { name, age, course, emailid, phoneno, address } = req.body;
//       const [result] = await db
//         .promise()
//         .query(
//           "INSERT INTO students (user_id, name, age, course, emailid, phoneno, address) VALUES (?, ?, ?, ?, ?, ?, ?)",
//           [userId, name, age, course, emailid, phoneno, address],
//         );
//       res
//         .status(201)
//         .json({ id: result.insertId, message: "Student created successfully" });
//     } catch (error) {
//       console.error("Error creating student:", error);
//       res.status(500).json({ message: "Failed to create student" });
//     }
//   },

//   getStudentById: async (req, res) => {
//     const id = req.params.id;
//     const userId = req.user.userId;
//     try {
//       const [rows] = await db
//         .promise()
//         .query("SELECT * FROM students WHERE id = ? AND user_id = ?", [
//           id,
//           userId,
//         ]);
//       if (rows.length === 0) {
//         return res.status(404).json({ message: "Student not found" });
//       }
//       res.status(200).json(rows[0]);
//     } catch (error) {
//       console.error("Error fetching student:", error);
//       res.status(500).json({ message: "Failed to fetch student" });
//     }
//   },

//   updateStudent: async (req, res) => {
//     const id = req.params.id;
//     const userId = req.user.userId;
//     const { name, age, course, emailid, phoneno, address } = req.body;
//     try {
//       const [result] = await db
//         .promise()
//         .query(
//           "UPDATE students SET name = ?, age = ?, course = ?, emailid = ?, phoneno = ?, address = ? WHERE id = ? AND user_id = ?",
//           [name, age, course, emailid, phoneno, address, id, userId],
//         );
//       if (result.affectedRows === 0) {
//         return res.status(404).json({
//           message: "Student not found or you are not authorized to update",
//         });
//       }
//       res.status(200).json({ message: "Student updated successfully" });
//     } catch (error) {
//       console.error("Error updating student:", error);
//       res.status(500).json({ message: "Failed to update student" });
//     }
//   },

//   deleteStudent: async (req, res) => {
//     const id = req.params.id;
//     const userId = req.user.userId;
//     try {
//       const [result] = await db
//         .promise()
//         .query("DELETE FROM students WHERE id = ? AND user_id = ?", [
//           id,
//           userId,
//         ]);
//       if (result.affectedRows === 0) {
//         return res.status(404).json({
//           message: "Student not found or you are not authorized to delete",
//         });
//       }
//       res.status(200).json({ message: "Student deleted successfully" });
//     } catch (error) {
//       console.error("Error deleting student:", error);
//       res.status(500).json({ message: "Failed to delete student" });
//     }
//   },
// };

// module.exports = studentController;
