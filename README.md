App is live on : https://appointmentbooking-frontend.vercel.app/login

🚀 Features

🔹 User Features

✔ User Registration & Login – Secure authentication with JWT.

✔ View Available Time Slots – See free slots in the system.

✔ Book Appointments – Select a preferred time slot and fill out a form to confirm booking.

✔ Manage Appointments – View and cancel booked appointments.

🔹 Admin Features

✔ View All Appointments – See details of all scheduled appointments.

✔ Add New Appointments – Create appointment slots manually.

✔ Manage Bookings – Modify or delete appointments.

🔹 Security Features

✔ JWT-Based Authentication – Secure login with JSON Web Token.

✔ Role-Based Access Control – Different access levels for users and admins.

✔ Password Encryption – Secure password storage using BCrypt.

🔹 CI/CD & Deployment

✔ Automated CI/CD Pipeline – Ensures seamless deployment.

✔ Frontend on Vercel – React UI hosted on Vercel.

✔ Backend on Fly.io – Spring Boot backend deployed on Fly.io.

✔ Database on Railway – MySQL database hosted on Railway.

🛠️ Tools & Technologies Used

🌐 Frontend (React)

React.js – UI development.

Axios – API calls.

React Router – Page navigation.

Material-UI (MUI) – UI components.

🖥 Backend (Spring Boot)

Spring Boot – Backend framework.

Spring Security – Authentication & authorization.

Spring Data JPA – Database interaction.

JWT (JSON Web Token) – Secure authentication.

💾 Database

MySQL – Relational database for appointment storage.

Hibernate – ORM for database operations.

☁️ Deployment & DevOps

Fly.io – Backend hosting.

Vercel – Frontend hosting.

Railway – MySQL database hosting.

Docker – Containerization for local testing.

GitHub Actions – CI/CD automation.

Run project locally

1️⃣ Set Up MySQL Database Locally

Step 1: Install MySQL (If Not Installed)

Download and install MySQL from MySQL official website.

Alternatively, you can use XAMPP or Docker to run MySQL.

Step 2: Start MySQL Server

Ensure MySQL is running using:

mysql -u root -p

Enter your MySQL root password when prompted.

Step 3: Create the Database

Run the following SQL commands in MySQL:


CREATE DATABASE appointment_booking;

USE appointment_booking;

Step 4: Configure MySQL Connection in Spring Boot

Edit the application.properties file in the Spring Boot backend:

For application.properties

spring.datasource.url=jdbc:mysql://localhost:3306/appointment_booking

spring.datasource.username=root

spring.datasource.password=your_password

spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect

spring.jpa.hibernate.ddl-auto=update

Replace your_password with your actual MySQL password.

2️⃣ Run the Spring Boot Backend Locally

git clone https://github.com/JagathGamage/appointmentBooking.git

📌please make sure to replace @CrossOrigin in AppointmentController with your frontend url(http://localhost:3000)  ,

📌ALLOWED_ORIGIN  in Securityconfig class with your frontend url(http://localhost:3000) and

📌allowedOrigins in CorsConfig class with your frontend url(http://localhost:3000) 

Step 1: Install Dependencies

Ensure you have Java 17+ and Maven installed.

Check Java version:

java -version

Check Maven version:

mvn -version

Step 2: Run the Spring Boot Application

Navigate to the backend project folder:

cd appointmentBooking

Run the application using:

mvn spring-boot:run

or

mvnw.cmd spring-boot:run # For Windows

The backend should now be running at http://localhost:8080.

3️⃣ Run the React Frontend Locally

git clone https://github.com/JagathGamage/appointmentbookingFrontend.git

Step 1: Install Node.js & npm (If Not Installed)

Download and install Node.js from Node.js official website.

Check installation:

node -v

npm -v

Step 2: Install Dependencies

Navigate to the frontend folder:

cd appointmentBooking

Install dependencies:

npm install

Step 3: Configure API Base URL

Open .env and update it to match the local backend:

REACT_APP_BACKEND_URL = "http://localhost:8080";

Step 4: Start the React App

Run:

npm start

The frontend should now be running at http://localhost:3000.

4️⃣ Test the Application Locally

Open MySQL and verify that the database is running.

Start the Spring Boot backend (http://localhost:8080).

Start the React frontend (http://localhost:3000).

Open your browser and access the frontend.

Login/Register as a User or Admin and test booking, cancellation, and admin management features.

