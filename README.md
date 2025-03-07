# TaskFlow.ai Project

This repository contains both the ML backend (Flask) and the WebTaskFlow frontend (React+Vite). Follow the instructions below to set up and run each component.

## Backend Setup (ML)

The backend is built with Flask and contains the `combinedtemp.py` file that needs to be run in a virtual environment.

### Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

### Setting up the Backend

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/TaskFlow.ai.git
   cd TaskFlow.ai/ML
   ```

2. Create a virtual environment:
   ```bash
   # On Windows
   python -m venv venv
   
   # On macOS/Linux
   python3 -m venv venv
   ```

3. Activate the virtual environment:
   ```bash
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

4. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
   
   If requirements.txt doesn't exist, install the minimum required packages:
   ```bash
   pip install flask pandas numpy scikit-learn flask-cors
   ```

5. Run the Flask application:
   ```bash
   python combinedtemp.py
   ```

The Flask server should now be running on `http://localhost:5000` (or the port specified in the combinedtemp.py file).

## Frontend Setup (WebTaskFlow)

The frontend is built with React and Vite.

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher) or yarn

### Setting up the Frontend

1. Navigate to the WebTaskFlow directory:
   ```bash
   cd ../WebTaskFlow
   ```

2. Install dependencies:
   ```bash
   # Using npm
   npm install
   
   # Using yarn
   yarn
   ```

3. Start the development server:
   ```bash
   # Using npm
   npm run dev
   
   # Using yarn
   yarn dev
   ```

The Vite development server should now be running on `http://localhost:3000` or another port that will be displayed in the terminal.

## Accessing the Application

Once both the backend and frontend servers are running:

1. The API endpoints are accessible through the Flask server (http://localhost:5000)
2. The web interface is accessible through the Vite server (typically http://localhost:3000)

## Project Structure

- `/ML` - Contains the Flask backend with machine learning functionality
  - `combinedtemp.py` - Main Flask application
  - `requirements.txt` - Backend dependencies
  
- `/WebTaskFlow` - Contains the React+Vite frontend
  - `/src` - Source code for the React components
  - `/public` - Static assets
  - `package.json` - Frontend dependencies and scripts
  - `vite.config.js` - Vite configuration

## Development

- Backend changes should be made to the Flask files in the ML directory
- Frontend changes should be made to the React components in the WebTaskFlow/src directory
- After making changes to the backend, you'll need to restart the Flask server
- Frontend changes will automatically be reflected due to Vite's hot-module replacement

## Building for Production

### Frontend

```bash
# Using npm
npm run build

# Using yarn
yarn build
```

The build artifacts will be stored in the `dist/` folder, ready to be deployed.

### Backend

For the backend, consider using WSGI servers like Gunicorn or uWSGI for production deployment.

```bash
pip install gunicorn
gunicorn -w 4 combinedtemp:app
```

## Troubleshooting

If you encounter issues:

1. Ensure all dependencies are installed correctly
2. Check if the correct ports are available
3. Examine the console for any error messages
4. Make sure both the backend and frontend are running simultaneously

For more specific help, please open an issue on the repository.
