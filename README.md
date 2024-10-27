# Full-Stack Blog Application with Django Rest Framework and React

A feature-rich blog platform with rich-text editing, CRUD functionality, JWT-based authentication, email verification, and a REST API developed with Django Rest Framework (DRF) and React. 
OpenBlogU :: Mini Blog Site [Uncensored]

([**Live Demo**](https://openblogu.165131.xyz/))

## Features

- **Rich-Text Blogging**: Intuitive editor for creating and formatting blog posts.
- **CRUD Operations**: Create, Read, Update, and Delete blog posts with ease.
- **User Authentication**: Secure JWT-based login system.
- **Email Verification**: Ensures valid user accounts through email verification.
- **REST API**: Full REST API supporting blog and user operations.

## Tech Stack

- **Frontend**: React
- **Backend**: Django Rest Framework (DRF)
- **Authentication**: JWT (JSON Web Tokens)
- **Deployment**: ([Link to Deployed Version](https://openblogu.165131.xyz/))

## Installation

To run this project locally, follow these steps:

### Backend Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/ProPython007/OpenBlogU.git
    cd OpenBlogU
    ```

2. Set up a virtual environment and install dependencies:

    ```bash
    python -m venv env
    source env/bin/activate
    pip install -r requirements.txt
    ```

3. Set up environment variables for Django secret keys and JWT:

    ```bash
    export SECRET_KEY='your_django_secret_key'
    export JWT_SECRET_KEY='your_jwt_secret_key'
    ```

4. Run migrations and start the server:

    ```bash
    python manage.py migrate
    python manage.py runserver
    ```

### Frontend Setup

1. Navigate to the frontend folder:

    ```bash
    cd frontend
    ```

2. Install npm packages:

    ```bash
    npm install
    ```

3. Start the frontend development server:

    ```bash
    npm start
    ```

### Access the Application

- The React frontend will be available at `http://localhost:3000`.
- The DRF backend will be available at `http://localhost:8000/api/`.

## Usage

1. Register for an account.
2. Verify your email to access the platform fully.
3. Create, edit, and delete blog posts with the rich-text editor.
4. Access the REST API for programmatic access to blog posts and user management.
