package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq" // PostgreSQL driver
	"github.com/joho/godotenv"
)

var db *sql.DB

// ConnectDatabase initializes the PostgreSQL database connection
func ConnectDatabase() {
	// Load environment variables from .env file
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Build the PostgreSQL connection string for Supabase
	dsn := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=require",
		os.Getenv("DB_USER"),      // Supabase username
		os.Getenv("DB_PASSWORD"),  // Supabase password
		os.Getenv("DB_HOST"),      // Supabase host (e.g., db.something.supabase.co)
		os.Getenv("DB_PORT"),      // Port (usually 5432 for PostgreSQL)
		os.Getenv("DB_NAME"))      // Supabase database name

	// Open the connection to the PostgreSQL database
	db, err = sql.Open("postgres", dsn)
	if err != nil {
		log.Fatal("Error opening database connection:", err)
	}

	// Test the connection
	err = db.Ping()
	if err != nil {
		log.Fatal("Error pinging database:", err)
	}

	fmt.Println("Connected to the PostgreSQL database successfully!")
}



















// package main


// import (
// 	"database/sql"
// 	"fmt"
// 	// "log"
// 	"os"

// 	_ "github.com/go-sql-driver/mysql"
// 	"github.com/joho/godotenv"
// )

// var db *sql.DB

// // ConnectDatabase initializes the MySQL database connection
// func ConnectDatabase() {
// 	// Load environment variables from .env file
// 	err := godotenv.Load()
// 	if err != nil {
// 		log.Fatal("Error loading .env file")
// 	}

// 	// Build the connection string
// 	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s",
// 		os.Getenv("DB_USER"),
// 		os.Getenv("DB_PASSWORD"),
// 		os.Getenv("DB_HOST"),
// 		os.Getenv("DB_PORT"),
// 		os.Getenv("DB_NAME"))

// 	// Open the connection
// 	db, err = sql.Open("mysql", dsn)
// 	if err != nil {
// 		log.Fatal(err)
// 	}

// 	// Test the connection
// 	err = db.Ping()
// 	if err != nil {
// 		log.Fatal(err)
// 	}

// 	fmt.Println("Database connected!")
// }
