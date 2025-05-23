# Questions Bank

A working backend for a Graduation Project that serves as a question bank and assessment management platform. This project allows administrators and students to manage subjects, chapters, and questions, and enables automated evaluation of student answers. It is built with Node.js, Express, and MongoDB, and supports image uploads (via Cloudinary) and integration with generative AI for answer evaluation.

---

## Features

- User authentication with student/admin roles
- Subject and chapter management
- Question CRUD with support for multiple types (MCQ, open-ended, etc.)
- Image upload (Cloudinary integration)
- Student answer submission, auto-grading, and answer history
- AI-powered answer evaluation (Google Gemini integration)
- RESTful API structure

---

## Getting Started

### Prerequisites

- **Node.js** (v14 or higher recommended)
- **npm** (comes with Node.js)
- **MongoDB** (local instance or cloud service such as MongoDB Atlas)
- **Cloudinary** account (for image upload)
- **Google Gemini API Key** (for AI answer evaluation)

### System Requirements

- Windows 10/11 or macOS 11+
- At least 2 GB RAM
- Internet connection (for MongoDB Atlas/Cloudinary/Gemini integration)

---

## Installation

### 1. Clone the Repository

```sh
git clone https://github.com/shrouk-tarek/questions-bank.git
cd questions-bank
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory. Fill in your configuration:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GEMINI_API_KEY=your_gemini_api_key
```

---

## Running the Project

### On Windows

```sh
npm run dev
```

### On macOS

```sh
npm run dev
```

This will start the backend server using `nodemon` if configured, or just `node` for standard startup.

**Default port:** `3000` (can be changed in environment variables or code)

---

## Database Seeding (Optional)

If you want to populate the database with sample users, subjects, and questions:

```sh
node scripts/seedDB.js
```

This will clear existing data and insert admin/student users, subjects, chapters, and example questions.

---

## API Usage

- Base URL: `http://localhost:3000/api/`
- Endpoints include `/users`, `/subjects`, `/chapters`, `/questions`, `/answers`, etc.
- Use tools like Postman for API interaction.

---

## Executables

There are **no pre-built executables** for this project. The backend is run via Node.js as described above.

---

## Build Tools

- **Node.js** (JavaScript runtime)
- **npm** (for dependency management and scripts)

There is **no compilation** required, as this is a JavaScript/Node.js project.

---

## Dependencies

Key dependencies (see `package.json` for full list):

- `express`
- `mongoose`
- `jsonwebtoken`
- `bcryptjs`
- `dotenv`
- `cloudinary`
- `multer`, `multer-storage-cloudinary`
- `@google/generative-ai` (for Gemini integration)

---

## Configuration

- Configure your `.env` file as shown above.
- Set up your Cloudinary and Gemini credentials.
- Ensure your MongoDB instance is running and accessible.

---

## Troubleshooting

**Common Issues:**

- **MongoDB connection errors**: Check that your `MONGO_URI` is correct and that your MongoDB service is running/accessible.
- **Cloudinary upload errors**: Make sure all Cloudinary credentials are in your `.env` file and correct.
- **Gemini API errors**: Verify your API key and that you have access to the Gemini API.
- **Port in use**: Change the default port in your code or stop the process using it.
- **CORS issues**: If accessing from a frontend, ensure CORS settings in Express are configured properly.

**Debugging Tips:**

- Use `console.log` statements for debugging.
- Check logs/output for specific error messages.
- For Windows, run terminal/command prompt as administrator if you encounter permission issues.
- If `npm install` fails, try deleting `node_modules` and running it again.

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## License

This project is for educational purposes and does not yet include a formal license. 

---

## Contact

For questions, contact the project maintainer at [tarekshrouk511@gmail.com](mailto:tarekshrouk511@gmail.com).
