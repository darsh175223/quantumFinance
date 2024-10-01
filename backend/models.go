package main
//models.go
import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"regexp"
	"strconv"
	"strings"
	"math"
)

// User struct to represent a user in the database
type User struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Username    string `json:"username"`
	Password    string `json:"password"`
	StockTrades string `json:"stockTrades"` 
	Cash   string `json:"cash"`
	Networth   string `json:"networth"`
	Purchases   string `json:"purchases"`
	
}

// GetUsers retrieves all users from the database
func GetUsers(db *sql.DB) ([]User, error) {
	query := `SELECT id, name , username , password FROM books`

	// Execute the query
	rows, err := db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("GetUsers: %v", err)
	}
	defer rows.Close()

	// Iterate over the rows and create a slice of users
	var users []User
	for rows.Next() {
		var user User
		if err := rows.Scan(&user.ID, &user.Name, &user.Username, &user.Password); err != nil {
			return nil, fmt.Errorf("GetUsers: %v", err)
		}
		users = append(users, user)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("GetUsers: %v", err)
	}

	return users, nil
}

// GetUserByID retrieves a single user by their ID
func GetUserByID(id string) (*User, error) {
	var user User
	err := db.QueryRow("SELECT id, name, username, password FROM books WHERE id = $1", id).Scan(
		&user.ID, &user.Name, &user.Username, &user.Password)
	if err == sql.ErrNoRows {
		return nil, errors.New("user not found")
	} else if err != nil {
		return nil, err
	}

	return &user, nil
}

// CreateUser inserts a new user into the "users" table and returns the created user or an error
func CreateUser(db *sql.DB, username string, password string, name string, ID string) (*User, error) {
	// SQL query to insert a new user into the "users" table
	query := `INSERT INTO books (id, username, password, name) 
			  VALUES ($1, $2, $3, $4) 
			  RETURNING id, username,password, name`

	// Prepare the User struct to store the returned values
	var newUser User

	// Execute the insert query and scan the returned values into the newUser struct
	err := db.QueryRow(query, ID, username, password, name).Scan(&newUser.ID, &newUser.Username, &newUser.Name, &newUser.Password)
	if err != nil {
		return nil, fmt.Errorf("error inserting new user: %v", err)
	}

	// Password is not included in the returned struct for security reasons, but you can store it in the DB
	newUser.Password = password
	fmt.Println("Successfully inserted data")

	// Return the newly created user
	return &newUser, nil
}


// tryLogin retrieves a user from the database by username and password
func tryLogin(db *sql.DB, password string, username string) (*User, error) {
	var user User

	query := `SELECT id, name, username, password FROM books WHERE username = $1 AND password = $2 LIMIT 1`

	// Execute the query
	err := db.QueryRow(query, username, password).Scan(&user.ID, &user.Name, &user.Username, &user.Password)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("user not found")
		}
		return nil, fmt.Errorf("tryLogin: %v", err)
	}

	return &user, nil
}

// AddTupleToStockTrades adds a new tuple to the stockTrades column for the given user
func AddTupleToStockTrades(db *sql.DB, username string, newTuple string) (*User, error) {
	// First, retrieve the current stockTrades value
	var currentStockTrades sql.NullString
	var addingStock User

	// PostgreSQL uses $1, $2, etc. instead of ?
	query := `SELECT stockTrades FROM books WHERE username = $1 LIMIT 1`
	err := db.QueryRow(query, username).Scan(&currentStockTrades)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("user not found")
		}
		return nil, fmt.Errorf("failed to retrieve current stockTrades: %v", err)
	}

	// Handle NULL value for stockTrades
	updatedStockTrades := currentStockTrades.String
	if updatedStockTrades == "" {
		updatedStockTrades = newTuple
	} else {
		updatedStockTrades += "," + newTuple
	}

	// Update the stockTrades value in the database
	_, err = db.Exec("UPDATE books SET stockTrades = $1 WHERE username = $2", updatedStockTrades, username)
	if err != nil {
		return nil, fmt.Errorf("failed to update stockTrades: %v", err)
	}

	// Retrieve updated user info
	err = db.QueryRow("SELECT id, name, username, stockTrades FROM books WHERE username = $1", username).Scan(&addingStock.ID, &addingStock.Name, &addingStock.Username, &addingStock.StockTrades)
	if err != nil {
		return nil, fmt.Errorf("error retrieving updated user: %v", err)
	}
	return &addingStock, nil
}


// RemoveTupleInStockTrades removes the specified tuple from the stockTrades column for the given user
func RemoveTupleInStockTrades(db *sql.DB, username string, symbolToRemove string, quantityToRemove string, price string) (*User, []string, []string, error) {
	// Convert the quantity to an integer
	quantityToRemoveInt, err := strconv.Atoi(quantityToRemove)
	if err != nil {
		return nil,nil,nil, fmt.Errorf("invalid quantity: %v", err)
	}

	// First, retrieve the current stockTrades value
	var currentStockTrades sql.NullString
	var updatedUser User

	// SQL query to retrieve the stockTrades column for the specified user
	query := `SELECT stockTrades FROM books WHERE username = $1 LIMIT 1`
	err = db.QueryRow(query, username).Scan(&currentStockTrades)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil,nil,nil, fmt.Errorf("user not found")
		}
		return nil,nil,nil, fmt.Errorf("failed to retrieve current stockTrades: %v", err)
	}

	// Handle NULL value for stockTrades
	if !currentStockTrades.Valid || currentStockTrades.String == "" {
		return nil, nil,nil,fmt.Errorf("no stock trades found")
	}

	// Regular expression to match the tuple pattern
	re := regexp.MustCompile(`\((\d+), "([^"]+)", ([\d.]+)\)`)

	// Find all tuples in the stockTrades string
	trades := re.FindAllStringSubmatch(currentStockTrades.String, -1)

	// Initialize a new slice to hold the updated trades
	updatedTrades := []string{}
	stockNames  := []string{}
	quantityList := []string{}

	// Flag to determine if we found the trade to remove
	found := false

	// Iterate over each tuple in the trades slice
	for _, trade := range trades {
		tradeQuantity, err := strconv.Atoi(trade[1])
		if err != nil {
			return nil,nil,nil, fmt.Errorf("invalid trade quantity: %v", err)
		}
		
		tradeSymbol := trade[2] // The stock symbol is in the second capture group

		if tradeSymbol == symbolToRemove {
			if quantityToRemoveInt > tradeQuantity {
				// If the quantity to remove is greater than the trade quantity, we cannot remove this trade
				return nil, nil,nil,fmt.Errorf("quantity to remove exceeds trade quantity")
			} else if quantityToRemoveInt == tradeQuantity {
				// If the quantity to remove matches the trade quantity, remove the trade
				buyPrice,err1 := strconv.ParseFloat(trade[3], 64)
				sellPrice,err2 := strconv.ParseFloat(price, 64)
				mult,err3 := strconv.ParseFloat(trade[1], 64)

				

				fmt.Println("Perhaps ignore, buyPrice", err1, buyPrice)
				fmt.Println("Perhaps ignore, sellPrice", err2, sellPrice)
				fmt.Println("Perhaps ignore, mult", err3, mult)


				fmt.Println("Profit: ", (sellPrice-buyPrice)*mult)



				found = true
				continue
			} else {
				// If the quantity to remove is less than the trade quantity, update the trade quantity
				buyPrice,err1 := strconv.ParseFloat(trade[3], 64)
				sellPrice,err2 := strconv.ParseFloat(price, 64)
				// mult,err3 := strconv.ParseFloat(tradeQuantity-quantityToRemoveInt, 64)
				floatQuant := float64(tradeQuantity-quantityToRemoveInt)
				

				fmt.Println("Perhaps ignore, buyPrice", err1, buyPrice)
				fmt.Println("Perhaps ignore, sellPrice", err2, sellPrice)
				// fmt.Println("Perhaps ignore, mult", err3, mult)

				fmt.Println("Profit: ", (sellPrice-buyPrice)*(floatQuant))
				
			


				updatedTrades = append(updatedTrades, fmt.Sprintf("(%d, \"%s\", %.2f)", tradeQuantity-quantityToRemoveInt, symbolToRemove, buyPrice))
				found = true
				continue
			}
		}

		// If the trade does not match the symbol to remove, add it to the updated trades
		updatedTrades = append(updatedTrades, trade[0])
	}

	// Check if the symbol was found
	if !found {
		return nil, nil,nil,fmt.Errorf("symbol to remove not found")
	}

	// Join the updated trades back into a single string
	updatedStockTrades := strings.Join(updatedTrades, ", ")

	// SQL query to update the stockTrades column
	updateQuery := `UPDATE books SET stockTrades = $1 WHERE username = $2`
	_, err = db.Exec(updateQuery, updatedStockTrades, username)
	if err != nil {
		return nil, nil,nil,fmt.Errorf("failed to update stockTrades: %v", err)
	}


	for _, trade := range trades {
		
		quantityList = append(quantityList, trade[1])
		stockNames = append(stockNames, trade[2])

	}

	// Return the updated user record
	updatedUser.Username = username
	updatedUser.StockTrades = updatedStockTrades

	return &updatedUser, quantityList, stockNames, nil
}



func sendSymbolandPrice(db *sql.DB, username string,  quantityToRemove string) (*User, []string, []string, []string, error) {
	// Convert the quantity to an integer
	quantityToRemoveInt, err := strconv.Atoi(quantityToRemove)
	if err != nil {
		return nil,nil,nil,nil, fmt.Errorf("invalid quantity: %v", err)
		fmt.Println(quantityToRemoveInt)
	}
	
	

	// First, retrieve the current stockTrades value
	var currentStockTrades sql.NullString
	var updatedUser User

	// SQL query to retrieve the stockTrades column for the specified user
	query := `SELECT stockTrades FROM books WHERE username = $1 LIMIT 1`
	err = db.QueryRow(query, username).Scan(&currentStockTrades)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil,nil,nil, nil, fmt.Errorf("user not found")
		}
		return nil,nil,nil, nil, fmt.Errorf("failed to retrieve current stockTrades: %v", err)
	}

	// Handle NULL value for stockTrades
	if !currentStockTrades.Valid || currentStockTrades.String == "" {
		return nil, nil,nil,nil, fmt.Errorf("no stock trades found")
	}

	// Regular expression to match the tuple pattern
	re := regexp.MustCompile(`\((\d+), "([^"]+)", ([\d.]+)\)`)

	// Find all tuples in the stockTrades string
	trades := re.FindAllStringSubmatch(currentStockTrades.String, -1)

	// Initialize a new slice to hold the updated trades
	stockNames  := []string{}
	quantityList := []string{}
	priceList:=[]string{}


	


	for _, trade := range trades {
		
		quantityList = append(quantityList, trade[1])
		stockNames = append(stockNames, trade[2])
		priceList = append(priceList, trade[3])


	}

	

	return &updatedUser, quantityList, stockNames, priceList, nil

}

// setCash sets the cash value for a given user by their username
func setCash(db *sql.DB, username string, cashValue string) (*User, error) {
	// Convert cashValue to a float64
	cashFloat, err := strconv.ParseFloat(cashValue, 64)
	if err != nil {
		return nil, fmt.Errorf("failed to parse cash value: %v", err)
	}

	// Truncate the value to two decimal places
	truncatedCash := fmt.Sprintf("%.2f", cashFloat)

	// SQL query to update the cash value
	query := "UPDATE books SET cash = $1 WHERE username = $2"
	_, err = db.Exec(query, truncatedCash, username)
	if err != nil {
		return nil, fmt.Errorf("failed to update cash: %v", err)
	}
    fmt.Printf("Type of x: %T\n", truncatedCash)

	return nil, nil
}

// setNetworth sets the networth value for a given user by their username
func setNetworth(db *sql.DB, username string, networthValue string) (*User, error) {
	// SQL query to update the networth value
	query := `UPDATE books SET networth = $1 WHERE username = $2`
	_, err := db.Exec(query, networthValue, username)
	if err != nil {
		return nil, fmt.Errorf("failed to update networth: %v", err)
	}

	// Retrieve the updated user record to confirm the operation
	var updatedUser User
	err = db.QueryRow("SELECT id, name, username, cash, networth FROM books WHERE username = $1 LIMIT 1", username).Scan(
		&updatedUser.ID, &updatedUser.Name, &updatedUser.Username, &updatedUser.Cash, &updatedUser.Networth,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("user not found")
		}
		return nil, fmt.Errorf("failed to retrieve updated user: %v", err)
	}

	return &updatedUser, nil
}

// GetCash retrieves the cash value for a given user by their username
func GetCash(db *sql.DB, username string) (string, error) {
	var cash string

	// SQL query to retrieve the cash value
	query := `SELECT cash FROM books WHERE username = $1 LIMIT 1`
	err := db.QueryRow(query, username).Scan(&cash)
	if err != nil {
		if err == sql.ErrNoRows {
			return "", errors.New("user not found")
		}
		return "", fmt.Errorf("failed to retrieve cash value: %v", err)
	}

	return cash, nil
}
// Function to fetch current stock price from Twelve Data API
func getCurrentPrice(stockName string) (float64, error) {
	apiKey := "23ba00821f554f1483efe54897bedd08"
	url := fmt.Sprintf("https://api.twelvedata.com/price?symbol=%s&apikey=%s", stockName, apiKey)

	resp, err := http.Get(url)
	if err != nil {
		return 0, fmt.Errorf("failed to fetch stock price: %v", err)
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return 0, fmt.Errorf("failed to read response body: %v", err)
	}

	var result map[string]interface{}
	if err := json.Unmarshal(body, &result); err != nil {
		return 0, fmt.Errorf("failed to parse JSON: %v", err)
	}

	if price, ok := result["price"].(string); ok {
		fmt.Println("Price of",stockName, ": ", price)
		return strconv.ParseFloat(price, 64)
	}

	return 0, errors.New("failed to get stock price from response")
}

// Function to calculate and update the networth of a user
func calculateNetworth(db *sql.DB, username string) (float64, error) {
	// Retrieve the user's cash and stockTrades
	var user User
	query := `SELECT cash, stockTrades FROM books WHERE username = $1 LIMIT 1`
	err := db.QueryRow(query, username).Scan(&user.Cash, &user.StockTrades)
	if err != nil {
		if err == sql.ErrNoRows {
			return 0, fmt.Errorf("user not found")
		}
		return 0, fmt.Errorf("failed to retrieve user data: %v", err)
	}
	fmt.Println("passed username search", user.Cash)

	// Convert cash to float64
	cashString := user.Cash
	networth, err := strconv.ParseFloat(cashString, 64)
	if err != nil {
		return 0, fmt.Errorf("invalid cash value: %v", err)
	}

	// Regular expression to match the tuple pattern
	re := regexp.MustCompile(`\((\d+), "([^"]+)", ([\d.]+)\)`)

	// Find all tuples in the stockTrades string
	trades := re.FindAllStringSubmatch(user.StockTrades, -1)

	// Iterate over each trade to calculate the networth
	for _, trade := range trades {
		quantity, err := strconv.Atoi(trade[1])
		if err != nil {
			return 0, fmt.Errorf("invalid trade quantity: %v", err)
		}

		stockName := trade[2]
		buyPrice, err := strconv.ParseFloat(trade[3], 64)
		if err != nil {
			return 0, fmt.Errorf("invalid buy price: %v", err)
		}

		// Fetch the current price of the stock
		sellPrice, err := getCurrentPrice(stockName)
		if err != nil {
			return 0, fmt.Errorf("failed to get current price for %s: %v", stockName, err)
		}

		// Update the networth
		networth += (sellPrice - buyPrice) * float64(quantity)
	}

	// Truncate networth to 2 decimal places
	networth = math.Round(networth*100) / 100

	// Update the networth in the database
	_, err = db.Exec("UPDATE books SET networth = $1 WHERE username = $2", networth, username)
	if err != nil {
		return 0, fmt.Errorf("failed to update networth: %v", err)
	}

	return networth, nil
}

// setPurchases adds a new purchase to the purchases column for the given user
func setPurchases(db *sql.DB, username string, itemName string, quantity int) (*User, error) {
	// First, retrieve the current purchases value
	var currentPurchases sql.NullString
	var updatedUser User

	query := `SELECT purchases FROM books WHERE username = $1 LIMIT 1`
	err := db.QueryRow(query, username).Scan(&currentPurchases)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("user not found")
		}
		return nil, fmt.Errorf("failed to retrieve current purchases: %v", err)
	}

	// Handle NULL value for purchases
	newPurchase := fmt.Sprintf("(%s, %d)", itemName, quantity)
	updatedPurchases := currentPurchases.String
	if updatedPurchases == "" {
		updatedPurchases = newPurchase
	} else {
		updatedPurchases += ";" + newPurchase
	}

	// Update the purchases value in the database
	_, err = db.Exec("UPDATE books SET purchases = $1 WHERE username = $2", updatedPurchases, username)
	if err != nil {
		return nil, fmt.Errorf("failed to update purchases: %v", err)
	}

	// Retrieve the updated user
	err = db.QueryRow("SELECT id, name, username, purchases FROM books WHERE username = $1", username).Scan(&updatedUser.ID, &updatedUser.Name, &updatedUser.Username, &updatedUser.Purchases)
	if err != nil {
		return nil, fmt.Errorf("error retrieving updated user: %v", err)
	}

	return &updatedUser, nil
}

// getPurchases retrieves the purchases for a given user by their username and returns the items and quantities as slices
func getPurchases(db *sql.DB, username string) ([]string, []int, error) {
	// First, retrieve the current purchases value
	var currentPurchases sql.NullString

	query := `SELECT purchases FROM books WHERE username = $1 LIMIT 1`
	err := db.QueryRow(query, username).Scan(&currentPurchases)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil, fmt.Errorf("user not found")
		}
		return nil, nil, fmt.Errorf("failed to retrieve current purchases: %v", err)
	}

	// Handle NULL value for purchases
	if !currentPurchases.Valid || currentPurchases.String == "" {
		return nil, nil, fmt.Errorf("no purchases found")
	}

	// Split the purchases string into individual tuples using a semicolon
	purchases := strings.Split(currentPurchases.String, ";")

	// Initialize slices to hold the items and quantities
	var items []string
	var quantities []int

	// Iterate over each purchase tuple and extract the item name and quantity
	for _, purchase := range purchases {
		purchase = strings.Trim(purchase, "() ")

		parts := strings.Split(purchase, ",")
		if len(parts) != 2 {
			return nil, nil, fmt.Errorf("invalid purchase format: %s", purchase)
		}

		item := strings.TrimSpace(parts[0])
		quantity, err := strconv.Atoi(strings.TrimSpace(parts[1]))
		if err != nil {
			return nil, nil, fmt.Errorf("invalid quantity in purchase: %v", err)
		}

		items = append(items, item)
		quantities = append(quantities, quantity)
	}

	return items, quantities, nil
}

// clearPurchases removes all entries in the purchases column for the given username
func clearPurchases(db *sql.DB, username string) (*User, error) {
	// Update the purchases column to an empty string for the specified user
	query := `UPDATE books SET purchases = '' WHERE username = $1`
	_, err := db.Exec(query, username)
	if err != nil {
		return nil, fmt.Errorf("failed to clear purchases: %v", err)
	}

	// Retrieve the updated user to return
	var updatedUser User
	err = db.QueryRow("SELECT id, name, username, purchases FROM books WHERE username = $1", username).Scan(&updatedUser.ID, &updatedUser.Name, &updatedUser.Username, &updatedUser.Purchases)
	if err != nil {
		return nil, fmt.Errorf("error retrieving updated user: %v", err)
	}

	return &updatedUser, nil
}
