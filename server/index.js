require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());


const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});




// Use the callback provided by createPool to check for connection errors
db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    process.exit(1); // Exit the application if there's an error connecting to the database
  } else {
    console.log('Connected to the MySQL database');
    console.log('Connection ID:', connection.threadId);
    connection.release(); // Release the connection when done
  }
});



// **Sign-up** 
// POST Request: '/signup' route
app.post('/signup', async (req, res) => {
  try {
    const { email, name, password, id, role, department } = req.body;

    const checkPrnSql = 'SELECT id FROM users WHERE id = ?';

    db.query(checkPrnSql, [id], (error, results) => {
      if (error) {
        console.error('Error checking PRN:', error);
        return res.status(500).json({ success: false, message: 'Error checking PRN' });
      } 
      else {
        if (results.length > 0) {
          console.log('PRN already exists');
          return res.status(400).json({ success: false, message: 'User already exists' });
        } 
        else {
          // Hash the password for security
          bcrypt.hash(password, 10, async (err, hashedPassword) => {
            if (err) {
              console.error('Error hashing password: ', err);
              return res.status(500).json({ success: false, message: 'Error hashing password' });
            } 
            else {
              // Insert user into the users table
              const userSql = 'INSERT INTO users (id, email, password, name, role, dept_name) VALUES (?, ?, ?, ?, ?, ?)';

              db.query(userSql, [id, email, hashedPassword, name, role, department], (userErr, userResult) => {
                if (userErr) {
                  console.error('Error inserting user: ', userErr);
                  return res.status(500).json({ success: false, message: 'Error inserting user' });
                } 
                else {
                  let specificInsertQuery;
                  // Insert specific role into corresponding table
                  if (role === 'student') {
                    specificInsertQuery = 'INSERT INTO student (id, name, dept_name) VALUES (?, ?, ?)';
                  } 
                  else if (role === 'faculty') {
                    specificInsertQuery = 'INSERT INTO instructor (id, name, dept_name) VALUES (?, ?, ?)';
                  } 
                  else {
                    specificInsertQuery = 'INSERT INTO admin (id, name, dept_name) VALUES (?, ?, ?)';
                  }

                  db.query(specificInsertQuery, [id, name, department], (roleErr, roleResult) => {
                    if (roleErr) {
                      console.error('Error inserting role: ', roleErr);
                      return res.status(500).json({ success: false, message: 'Error inserting role' });
                    } 
                    else {
                      res.status(200).json({
                        success: true,
                        message: 'User registration successful',
                        userId: id
                      });
                    }
                  });
                }
              });
            }
          });
        }
      }
    });

  } catch (error) {
    console.error('Error in signup: ', error);

    res.status(500).json({
      success: false,
      message: 'Error in signup',
      error: error.message
    });
  }

});




// **login**
// POST Request: '/login' route
app.post('/login', async (req, res) => {
  try {
    const { id, password } = req.body;

    const searchUserById = "SELECT * FROM users WHERE id = ?";

    db.query(searchUserById, [id], async (error, results) => {
      if (error) {
        console.error('Error searching user by ID: ', error);

        return res.status(500).json({
          success: false,
          message: 'Error searching user by ID'
        });
      } 
      else {
        if (results.length > 0) {
          // User found, results contains the user information
          console.log('User found:', results[0]);

          const passwordMatch = await bcrypt.compare(password, results[0].password);

          if (passwordMatch) {
            // Passwords match, user authentication successful
            const token = await jwt.sign(
              {
                email: results[0].email,
                id: results[0].id,
                role: results[0].role,
                name: results[0].name,
                department: results[0].dept_name
              },
              process.env.JWT_SECRET, // JWT Secret
              { expiresIn: '2d' }
            )

            console.log('User authenticated successfully:', results[0]);

            return res.status(200).json({
              success: true,
              message: 'User authenticated successfully',
              user: results[0],
              token: token
            });
          } 
          else {
            console.log('Wrong password');

            return res.status(401).json({
              success: false,
              message: 'Wrong password'
            });
          }
        } 
        else {
          console.log('User not found');
          return res.status(404).json({
            success: false,
            message: 'User not found'
          });
        }
      }
    });
  } 
  catch (error) {
    console.log('Error in login: ', error);

    return res.status(500).json({
      success: false,
      message: 'Error in login',
      error: error.message
    });
  }
});




// GET Request: '/faculties/:department' route
app.get('/faculties/:department', (req, res) => {
  const department = req.params.department;

  // Query to fetch faculties by department
  const sql = 'SELECT * FROM instructor WHERE dept_name = ?';

  db.query(sql, [department], (err, results) => {
    if (err) {
      throw err;
    }
    console.log(results);
    res.json(results);
  });

});



// GET Request: '/students/:department' route
app.get('/students/:department', (req, res) => {
  const department = req.params.department;

  // Query to fetch students by department
  const sql = 'SELECT * FROM student WHERE dept_name = ?';

  db.query(sql, [department], (err, results) => {
    if (err) {
      throw err;
    }
    console.log(results);
    res.json(results);
  });
});



// GET Request: '/courses/:department' route
app.get('/courses/:department', (req, res) => {
  const department = req.params.department;

  // Query to fetch courses by department
  const sql = 'SELECT * FROM course WHERE dept_name = ?';

  db.query(sql, [department], (err, results) => {
    if (err) {
      throw err;
    }
    console.log(results)
    res.json(results);
  });
});



// POST Request: '/createcourses' route
app.post('/createcourses', (req, res) => {
  // Get data from the request body
  const { course_id, title, dept_name, credits } = req.body;

  const sql = `INSERT INTO course (course_id, title, dept_name, credits) VALUES (?, ?, ?, ?)`;

  db.query(sql, [course_id, title, dept_name, credits], (error, results, fields) => {
    if (error) {
      console.error('Error inserting course: ', error);
      return res.status(500).send('Internal Server Error');
    }
    console.log('Course inserted successfully.');
    res.status(200).send('Course inserted successfully.');
  });
});



// DELETE Request: '/courses/:courseId' route
app.delete('/courses/:courseId', (req, res) => {
  const courseId = req.params.courseId;

  const sql = 'DELETE FROM course WHERE course_id = ?';

  db.query(sql, [courseId], (err, result) => {
    if (err) {
      console.error('Error deleting course: ', err);
      return res.status(500).send('Internal Server Error');
    }
    console.log('Course deleted successfully');
    return res.status(200).send('Course deleted successfully');
  });
});



// GET Request: '/profile/:userId' route
app.get('/profile/:userId', (req, res) => {
  const userId = req.params.userId;

  const sql = 'SELECT id, email, name, role, dept_name FROM users WHERE id = ?';

  // Execute the query
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching user profile: ', err);
      return res.status(500).send('Internal Server Error');
    }

    if (results.length === 0) {
      return res.status(404).send('User not found');
    }

    const userProfile = {
      id: results[0].id,
      email: results[0].email,
      name: results[0].name,
      role: results[0].role,
      dept_name: results[0].dept_name
    };

    // Send the user profile data as a JSON response
    return res.json(userProfile);
  });
});



// POST Request: '/updatePassword' route
app.post('/updatePassword', (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  const sql = 'SELECT * FROM users WHERE id = ?';

  db.query(sql, [userId], (err, [user]) => {
    if (err) {
      console.error('Error retrieving user data: ', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    bcrypt.compare(oldPassword, user.password, (err, isPasswordValid) => {
      if (err) {
        console.error('Error comparing passwords: ', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (!isPasswordValid) {
        return res.status(400).json({ error: 'Old password does not match' });
      }

      bcrypt.hash(newPassword, 10, (err, newPasswordHash) => {
        if (err) {
          console.error('Error hashing new password: ', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
         
        const sqlUpdate = 'UPDATE users SET password = ? WHERE id = ?';

        db.query(sqlUpdate, [newPasswordHash, userId], (err, updateResult) => {
          if (err) {
            console.error('Error updating password: ', err);
            return res.status(500).json({ error: 'Internal Server Error' });
          }

          if (updateResult.affectedRows === 0) {
            return res.status(500).json({ error: 'Failed to update password' });
          }

          return res.status(200).json({ success: true, message: 'Password updated successfully' });
        });
      });
    });
  });
});



// POST Request: '/course/register' route
app.post('/course/register', async (req, res) => {
  try {
    const { selectedCourses, studentId } = req.body;

    console.log(selectedCourses, " + ", studentId)

    if (!selectedCourses || !studentId) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    if (typeof studentId !== 'string') {
      return res.status(400).json({ error: 'Invalid studentId' });
    }

    const values = selectedCourses.map((id) => [id, studentId]);

    if (values.length === 0) {
      return res.status(400).json({ error: 'No course IDs provided' });
    }

    const sqlInsert = 'INSERT IGNORE INTO course_students (course_id, student_id) VALUES ?';

    // Use callback style with db.query()
    db.query(sqlInsert, [values], (error, results) => {
      if (error) {
        console.error('Error registering courses for student: ', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.status(200).json({ success: true, message: 'Courses registered successfully' });
    })
  }
  catch (error) {
    console.error('Error registering courses for student: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// GET Request: '/courses/student/:userId' route
app.get('/courses/student/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const query = `
      SELECT course_id, title, credits
      FROM course
      WHERE course_id IN (
          SELECT DISTINCT course_id
          FROM course_students
          WHERE student_id = ?
      );
    `;

    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error('Error fetching course details: ', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.status(200).json(results);
    });
  } 
  catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.post('/logout', (req, res) => {
  // Perform any necessary cleanup or session invalidation
  // For simplicity, we'll just send a success response
  res.clearCookie('connect.sid'); // Clear the session cookie
  res.json({ message: 'Logout successful' });
});




const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


