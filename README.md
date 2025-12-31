# Village Grievance Reporting System

A comprehensive digital platform for villagers to report civic issues and for administrators to manage/resolve them efficiently.

## Features

### 🏙️ For Villagers (User)
- **Account Creation**: Sign up and login securely.
- **Report Issues**: Submit complaints with:
  - **Category**: Road, Water, Electricity, Sanitation, etc.
  - **Description**: Detailed explanation of the problem.
  - **Image Proof**: Upload photos (powered by Cloudinary).
  - **Geo-Tagging**: Auto-detect GPS location.
- **Track Status**: View "My Complaints" with real-time status updates (Pending, In Progress, Resolved).
- **Admin Feedback**: See comments/responses from the administration.

### 👮 For Admins
- **Dashboard**: View all complaints from all users.
- **Filtering**: Filter complaints by status.
- **Management**: Update complaint status.
- **Response**: Add comments/updates to complaints.
- **Location View**: Open complaint location directly in Google Maps.

## Tech Stack
- **Frontend**: React.js (Vite), Tailwind CSS, Lucide Icons, Axios.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Storage**: Cloudinary (Image uploads).
- **Authentication**: JWT (JSON Web Tokens).

## Getting Started

### Prerequisites
- Node.js installed.
- MongoDB connection string.
- Cloudinary credentials.

### Installation

1. **Clone the repository**

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create .env file with:
   # MONGO_URI=...
   # CLOUDINARY_CLOUD_NAME=...
   # CLOUDINARY_API_KEY=...
   # CLOUDINARY_API_SECRET=...
   # JWT_SECRET=...
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the App**
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:201`

## Project Structure
- `backend/`: Express server, Models, Controllers, Routes.
- `frontend/`: Next.js App Router, Components, Pages.