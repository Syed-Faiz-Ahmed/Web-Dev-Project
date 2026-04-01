# Daycare Discovery Platform API

A robust RESTful API built with Node.js, Express, and PostgreSQL to manage and discover daycare centers.

## Features

- **CRUD Operations**: Complete management of daycare center records (Create, Read, Update, Delete).
- **Advanced Filtering**: Filter daycares by minimum/maximum monthly fee, minimum rating, and verification status.
- **Dynamic Sorting**: Sort results by lowest fee, highest rating, or a custom algorithmic "Best Match" scoring system.
- **Global Error Handling**: Catch-all mechanism for graceful error responses, including database constraint violations.

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL

## Setup & Installation

1. **Clone the repository** (or navigate to the project directory).
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Database Configuration**:
   - Create a PostgreSQL database (e.g., `daycare_db`).
   - Execute the schema file located in `database/schema.sql` to create the necessary tables and indexes.
4. **Environment Variables**:
   - Ensure you have a `.env` file in the root directory formatted like so:
     ```env
     DB_USER=your_postgres_user
     DB_HOST=localhost
     DB_NAME=daycare_db
     DB_PASSWORD=your_postgres_password
     DB_PORT=5432
     PORT=3000
     ```
5. **Start the server**:
   ```bash
   npm start
   ```
   *The server will run on `http://localhost:3000` by default.*

## API Endpoints

### 1. Get All Daycares (with Filtering and Sorting)
`GET /daycares`

**Query Parameters (Optional):**
- `min_fee` (number): Minimum monthly fee.
- `max_fee` (number): Maximum monthly fee.
- `min_rating` (number): Minimum overall rating (1-5).
- `is_verified` (boolean): `true` to show only verified daycares.
- `sort` (string): 
  - `lowest_fee`: Sorts by total fee ascending.
  - `highest_rated`: Sorts by rating descending.
  - `best_match`: Sorts using a custom heuristic (Rating * 0.7 - Normalized Fee * 0.3).

**Example Request:**
`GET /daycares?min_fee=500&max_fee=1500&sort=best_match`

### 2. Get Daycare by ID
`GET /daycares/:id`

Retrieves a single daycare by its auto-generated ID.

### 3. Create a Daycare
`POST /daycares`

**Body (JSON):**
```json
{
  "name": "Sunny Days Childcare",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "monthly_fee": 1200.00,
  "registration_fee": 150.00,
  "total_seats": 50,
  "available_seats": 15,
  "age_groups_accepted": ["0-2", "3-5"],
  "overall_rating": 4.8,
  "is_verified": true
}
```

### 4. Update a Daycare
`PUT /daycares/:id`

Update specific fields of an existing daycare. You only need to send the fields you wish to modify.

**Body (JSON) Example:**
```json
{
  "available_seats": 10,
  "monthly_fee": 1250.00
}
```

### 5. Delete a Daycare
`DELETE /daycares/:id`

Removes a daycare record permanently from the database.

## Algorithmic Details

The `GET /daycares` endpoint includes algorithmic query compilation to ensure O(log N) fetching utilizing PostgreSQL indexes.

The custom `best_match` sorting algorithm computes a relevance score in-memory (O(K log K) time complexity, where K is the number of filtered records) by balancing normalized pricing and quality ratings.
