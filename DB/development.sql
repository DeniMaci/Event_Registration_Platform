-- Create the Event_Registration_Platform database if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'Event_Registration_Platform')
BEGIN
    CREATE DATABASE Event_Registration_Platform;
END
GO

USE Event_Registration_Platform;
GO

-- Create the Users table
IF OBJECT_ID('Users', 'U') IS NOT NULL
    DROP TABLE Users;

CREATE TABLE Users (
  UserID INT IDENTITY(1,1) PRIMARY KEY,
  Name VARCHAR(255) NOT NULL,
  Email VARCHAR(255) NOT NULL UNIQUE,
  Password VARCHAR(255) NOT NULL
);

-- Create the Events table
IF OBJECT_ID('Events', 'U') IS NOT NULL
    DROP TABLE Events;

CREATE TABLE Events (
  EventID INT IDENTITY(1,1) PRIMARY KEY,
  EventName VARCHAR(255) NOT NULL,
  Description TEXT,
  EventDate DATE,
  Location VARCHAR(255),
  OrganizerID INT,
  FOREIGN KEY (OrganizerID) REFERENCES Users(UserID)
);

-- Create the Attendees table
IF OBJECT_ID('Attendees', 'U') IS NOT NULL
    DROP TABLE Attendees;

CREATE TABLE Attendees (
  AttendeeID INT IDENTITY(1,1) PRIMARY KEY,
  UserID INT,
  EventID INT,
  FOREIGN KEY (UserID) REFERENCES Users(UserID),
  FOREIGN KEY (EventID) REFERENCES Events(EventID)
);

-- Seed data for Users
INSERT INTO Users (Name, Email, Password)
VALUES
  ('User1', 'user1@example.com', 'password1'),
  ('User2', 'user2@example.com', 'password2');

-- Seed data for Events
INSERT INTO Events (EventName, Description, EventDate, Location, OrganizerID)
VALUES
  ('Event1', 'Description for Event 1', '2023-09-30', 'Location 1', 1),
  ('Event2', 'Description for Event 2', '2023-10-15', 'Location 2', 2);

-- Seed data for Attendees
INSERT INTO Attendees (UserID, EventID)
VALUES
  (1, 1),
  (1, 2),
  (2, 2);