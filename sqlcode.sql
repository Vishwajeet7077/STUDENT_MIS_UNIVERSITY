SET SQL_SAFE_UPDATES = 0;

CREATE DATABASE student_mis_university;
USE student_mis_university;

-- Creating tables in the University Database:
-- Create table classroom
CREATE TABLE classroom (
    building VARCHAR(15),
    room_number VARCHAR(7),
    capacity NUMERIC(4,0),
    PRIMARY KEY (building, room_number)
);

-- Create table department
CREATE TABLE department (
    dept_name VARCHAR(20),
    building VARCHAR(15),
    budget NUMERIC(12,2) CHECK (budget > 0),
    PRIMARY KEY (dept_name)
);

-- Create table course
CREATE TABLE course (
    course_id VARCHAR(8),
    title VARCHAR(50),
    dept_name VARCHAR(20),
    credits NUMERIC(2,0) CHECK (credits > 0),
    PRIMARY KEY (course_id),
    FOREIGN KEY (dept_name) REFERENCES department(dept_name) ON DELETE SET NULL
);

-- Create table instructor
CREATE TABLE instructor (
    ID VARCHAR(10),
    name VARCHAR(30) NOT NULL,
    dept_name VARCHAR(20),
    salary NUMERIC(8,2) CHECK (salary > 29000),
    PRIMARY KEY (ID),
    FOREIGN KEY (dept_name) REFERENCES department(dept_name) ON DELETE SET NULL
);

-- Create table section
CREATE TABLE section (
    course_id VARCHAR(8),
    sec_id VARCHAR(8),
    semester VARCHAR(6) CHECK (semester IN ('Fall', 'Winter', 'Spring', 'Summer')),
    year NUMERIC(4,0) CHECK (year > 1701 AND year < 2100),
    building VARCHAR(15),
    room_number VARCHAR(7),
    time_slot_id VARCHAR(4),
    PRIMARY KEY (course_id, sec_id, semester, year),
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE,
    FOREIGN KEY (building, room_number) REFERENCES classroom(building, room_number) ON DELETE SET NULL
);


-- Create table teaches
CREATE TABLE teaches (
    ID VARCHAR(5),
    course_id VARCHAR(8),
    sec_id VARCHAR(8),
    semester VARCHAR(6),
    year NUMERIC(4,0),
    PRIMARY KEY (ID, course_id, sec_id, semester, year),
    FOREIGN KEY (course_id, sec_id, semester, year) REFERENCES section(course_id, sec_id, semester, year) ON DELETE CASCADE,
    FOREIGN KEY (ID) REFERENCES instructor(ID) ON DELETE CASCADE
);

-- Create table student
CREATE TABLE student (
    ID VARCHAR(10),
    name VARCHAR(30) NOT NULL,
    dept_name VARCHAR(20),
    tot_cred NUMERIC(3,0) CHECK (tot_cred >= 0),
    PRIMARY KEY (ID),
    FOREIGN KEY (dept_name) REFERENCES department(dept_name) ON DELETE SET NULL
);

-- Create table takes
CREATE TABLE takes (
    ID VARCHAR(5),
    course_id VARCHAR(8),
    sec_id VARCHAR(8),
    semester VARCHAR(6),
    year NUMERIC(4,0),
    grade VARCHAR(2),
    PRIMARY KEY (ID, course_id, sec_id, semester, year),
    FOREIGN KEY (course_id, sec_id, semester, year) REFERENCES section(course_id, sec_id, semester, year) ON DELETE CASCADE,
    FOREIGN KEY (ID) REFERENCES student(ID)ON DELETE CASCADE
);

 -- Create table advisor
CREATE TABLE advisor (
    s_ID VARCHAR(5),
    i_ID VARCHAR(5),
    PRIMARY KEY (s_ID),
    FOREIGN KEY (i_ID) REFERENCES instructor (ID) ON DELETE SET NULL,
    FOREIGN KEY (s_ID) REFERENCES student (ID) ON DELETE CASCADE
);

-- Create table prereq
CREATE TABLE prereq (
    course_id VARCHAR(8),
    prereq_id VARCHAR(8),
    PRIMARY KEY (course_id, prereq_id),
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE,
    FOREIGN KEY (prereq_id) REFERENCES course(course_id) ON DELETE CASCADE
);

-- Create table timeslot
CREATE TABLE timeslot (
    time_slot_id VARCHAR(4),
    day VARCHAR(1),
    start_hr INT CHECK (start_hr >= 0 AND start_hr < 24),
    start_min INT CHECK (start_min >= 0 AND start_min < 60),
    end_hr INT CHECK (end_hr >= 0 AND end_hr < 24),
    end_min INT CHECK (end_min >= 0 AND end_min < 60),
    PRIMARY KEY (time_slot_id, day, start_hr, start_min)
);


-------------------------------------------------------------------------------------------------------------

-- Create table Users
CREATE TABLE users (
  id VARCHAR(10) PRIMARY KEY ,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(30) NOT NULL,
  role VARCHAR(10) NOT NULL,
  dept_name VARCHAR(20),
  FOREIGN KEY (dept_name) REFERENCES department(dept_name) ON DELETE SET NULL
);


-- Create table Admin
CREATE TABLE admin (
    ID VARCHAR(10),
    name VARCHAR(30) NOT NULL,
    dept_name VARCHAR(20),
    PRIMARY KEY (ID),
    FOREIGN KEY (dept_name) REFERENCES department(dept_name) ON DELETE SET NULL
);


-- Create table course_students
CREATE TABLE course_students (
    course_id VARCHAR(8),
    student_id VARCHAR(10),
    PRIMARY KEY (course_id, student_id),
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES student(ID) ON DELETE CASCADE
);



INSERT INTO department (dept_name, building, budget) VALUES ('Computer Science', 'B1', 2000000.00);
INSERT INTO department (dept_name, building, budget) VALUES ('IT', 'B2', 1500000.00);
INSERT INTO department (dept_name, building, budget) VALUES ('Mechanical', 'B3', 1500000.00);
INSERT INTO department (dept_name, building, budget) VALUES ('Electrical', 'B4', 1300000.00);
INSERT INTO department (dept_name, building, budget) VALUES ('Electronics', 'B5', 1400000.00);
INSERT INTO department (dept_name, building, budget) VALUES ('Civil', 'B6', 1600000.00);


SELECT * FROM department;


SELECT * FROM users;

SELECT * FROM student;
SELECT * FROM admin;
SELECT * FROM instructor;
SELECT * FROM course_students;

