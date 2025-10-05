CREATE DATABASE HospitalDB;
USE HospitalDB;

-- Tables
CREATE TABLE  Patient (
    PatientID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(30) NOT NULL,
    Age INT,
    Gender VARCHAR(10),
    ContactNo VARCHAR(15),
    Address VARCHAR(100),
    Disease VARCHAR(50)
);

CREATE TABLE  Department (
    DepartmentID INT PRIMARY KEY,
    DepartmentName VARCHAR(50) NOT NULL,
    Location VARCHAR(100)
);

CREATE TABLE  Doctor (
    DoctorID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(30) NOT NULL,
    Specialization VARCHAR(50),
    ContactNo VARCHAR(15),
    DepartmentID INT,
    CONSTRAINT fk_doctor_department FOREIGN KEY (DepartmentID) REFERENCES Department(DepartmentID)
);

CREATE TABLE  Room (
    RoomID INT AUTO_INCREMENT PRIMARY KEY,
    RoomType VARCHAR(50),
    Availability VARCHAR(10) CHECK (Availability IN ('Yes','No'))
);

CREATE TABLE  Appointment (
    AppointmentID INT AUTO_INCREMENT PRIMARY KEY,
    PatientID INT,
    DoctorID INT,
    AppointmentDate DATE,
    Status VARCHAR(50),
    CONSTRAINT fk_appointment_patient FOREIGN KEY (PatientID) REFERENCES Patient(PatientID),
    CONSTRAINT fk_appointment_doctor FOREIGN KEY (DoctorID) REFERENCES Doctor(DoctorID)
);

CREATE TABLE  Admission (
    AdmissionID INT AUTO_INCREMENT PRIMARY KEY,
    PatientID INT,
    RoomID INT,
    AdmissionDate DATE,
    DischargeDate DATE,
    CONSTRAINT fk_admission_patient FOREIGN KEY (PatientID) REFERENCES Patient(PatientID),
    CONSTRAINT fk_admission_room FOREIGN KEY (RoomID) REFERENCES Room(RoomID)
);

CREATE TABLE  Bill (
    BillID INT AUTO_INCREMENT PRIMARY KEY,
    PatientID INT,
    AdmissionID INT,
    Amount INT,
    PaymentStatus VARCHAR(50),
    CONSTRAINT fk_bill_patient FOREIGN KEY (PatientID) REFERENCES Patient(PatientID),
    CONSTRAINT fk_bill_admission FOREIGN KEY (AdmissionID) REFERENCES Admission(AdmissionID)
);

-- Seed data
INSERT INTO Patient (PatientID, Name, Age, Gender, ContactNo, Address, Disease) VALUES
(1, 'Amit Sharma', 32, 'Male', '9876543210', 'Delhi, India', 'Fever'),
(2, 'Priya Mehta', 28, 'Female', '9123456780', 'Mumbai, India', 'Diabetes'),
(3, 'Rohit Verma', 45, 'Male', '9988776655', 'Chennai, India', 'Hypertension'),
(4, 'Neha Singh', 36, 'Female', '9090909090', 'Bangalore, India', 'Asthma'),
(5, 'Arjun Patel', 50, 'Male', '8888888888', 'Ahmedabad, India', 'Fracture')
ON DUPLICATE KEY UPDATE Name=VALUES(Name);

INSERT INTO Department (DepartmentID, DepartmentName, Location) VALUES
(101, 'Cardiology', 'Block A'),
(102, 'Neurology', 'Block B'),
(103, 'Orthopedics', 'Block C'),
(104, 'Pediatrics', 'Block D'),
(105, 'General Medicine', 'Block E')
ON DUPLICATE KEY UPDATE DepartmentName=VALUES(DepartmentName);

INSERT INTO Doctor (DoctorID, Name, Specialization, ContactNo, DepartmentID) VALUES
(1, 'Dr. Ramesh', 'Cardiologist', '9812345678', 101),
(2, 'Dr. Sunita', 'Neurologist', '9823456789', 102),
(3, 'Dr. Mohan', 'Orthopedic', '9834567890', 103),
(4, 'Dr. Kavita', 'Pediatrician', '9845678901', 104),
(5, 'Dr. Ajay', 'General Physician', '9856789012', 105)
ON DUPLICATE KEY UPDATE Name=VALUES(Name);

INSERT INTO Room (RoomID, RoomType, Availability) VALUES
(1, 'General', 'Yes'),
(2, 'ICU', 'No'),
(3, 'Private', 'Yes'),
(4, 'Semi-Private', 'Yes'),
(5, 'General', 'No')
ON DUPLICATE KEY UPDATE RoomType=VALUES(RoomType);

INSERT INTO Appointment (AppointmentID, PatientID, DoctorID, AppointmentDate, Status) VALUES
(1, 1, 1, '2025-09-20', 'Completed'),
(2, 2, 2, '2025-09-21', 'Scheduled'),
(3, 3, 3, '2025-09-22', 'Cancelled'),
(4, 4, 4, '2025-09-23', 'Scheduled'),
(5, 5, 5, '2025-09-24', 'Completed')
ON DUPLICATE KEY UPDATE Status=VALUES(Status);

INSERT INTO Admission (AdmissionID, PatientID, RoomID, AdmissionDate, DischargeDate) VALUES
(1, 1, 2, '2025-09-10', '2025-09-15'),
(2, 2, 3, '2025-09-12', '2025-09-18'),
(3, 3, 1, '2025-09-14', NULL),
(4, 4, 4, '2025-09-16', '2025-09-20'),
(5, 5, 5, '2025-09-18', NULL)
ON DUPLICATE KEY UPDATE AdmissionDate=VALUES(AdmissionDate);

INSERT INTO Bill (BillID, PatientID, AdmissionID, Amount, PaymentStatus) VALUES
(1, 1, 1, 12000, 'Paid'),
(2, 2, 2, 18000, 'Pending'),
(3, 3, 3, 10000, 'Pending'),
(4, 4, 4, 15000, 'Paid'),
(5, 5, 5, 22000, 'Pending')
ON DUPLICATE KEY UPDATE Amount=VALUES(Amount);

-- Procedures
DELIMITER $$
CREATE PROCEDURE AddDoctor(
    IN p_Name VARCHAR(30),
    IN p_Specialization VARCHAR(50),
    IN p_ContactNo VARCHAR(15),
    IN p_DepartmentID INT
)
BEGIN
    INSERT INTO Doctor (Name, Specialization, ContactNo, DepartmentID)
    VALUES (p_Name, p_Specialization, p_ContactNo, p_DepartmentID);
END $$

CREATE PROCEDURE AddPatient(
    IN p_Name VARCHAR(30),
    IN p_Age INT,
    IN p_Gender VARCHAR(10),
    IN p_ContactNo VARCHAR(15),
    IN p_Address VARCHAR(100),
    IN p_Disease VARCHAR(50)
)
BEGIN
    INSERT INTO Patient (Name, Age, Gender, ContactNo, Address, Disease)
    VALUES (p_Name, p_Age, p_Gender, p_ContactNo, p_Address, p_Disease);
END $$

-- Triggers
-- Mark room unavailable after admission insert
CREATE TRIGGER after_admission_insert
AFTER INSERT ON Admission
FOR EACH ROW
BEGIN
    UPDATE Room SET Availability = 'No' WHERE RoomID = NEW.RoomID;
END $$

-- Mark room available after discharge when updated
CREATE TRIGGER after_admission_update
AFTER UPDATE ON Admission
FOR EACH ROW
BEGIN
    IF NEW.DischargeDate IS NOT NULL THEN
        UPDATE Room SET Availability = 'Yes' WHERE RoomID = NEW.RoomID;
    END IF;
END $$
DELIMITER ;

-- Indexes
CREATE INDEX idx_doctor_name ON Doctor(Name);
CREATE INDEX idx_patient_name ON Patient(Name);

-- Views
CREATE OR REPLACE VIEW vw_Doctors AS
SELECT d.DoctorID,
       d.Name AS DoctorName,
       d.Specialization,
       d.ContactNo,
       d.DepartmentID,
       dept.DepartmentName
FROM Doctor d
LEFT JOIN Department dept ON d.DepartmentID = dept.DepartmentID;

CREATE OR REPLACE VIEW vw_Appointments AS
SELECT a.AppointmentID,
       a.AppointmentDate,
       a.Status,
       p.PatientID,
       p.Name AS PatientName,
       d.DoctorID,
       d.Name AS DoctorName
FROM Appointment a
LEFT JOIN Patient p ON a.PatientID = p.PatientID
LEFT JOIN Doctor d ON a.DoctorID = d.DoctorID;

CREATE OR REPLACE VIEW vw_Admissions AS
SELECT adm.AdmissionID,
       adm.AdmissionDate,
       adm.DischargeDate,
       adm.RoomID,
       r.RoomType,
       adm.PatientID,
       p.Name AS PatientName
FROM Admission adm
LEFT JOIN Room r ON adm.RoomID = r.RoomID
LEFT JOIN Patient p ON adm.PatientID = p.PatientID;

CREATE OR REPLACE VIEW vw_Bills AS
SELECT b.BillID,
       b.Amount,
       b.PaymentStatus,
       b.PatientID,
       p.Name AS PatientName,
       b.AdmissionID
FROM Bill b
LEFT JOIN Patient p ON b.PatientID = p.PatientID;