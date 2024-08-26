package main

import (
	"net/http"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
	"strconv"
)

// Function to retrieve all users from the database
func getUsers(c *gin.Context) {
	users, err := GetUsers(db)
	fmt.Print(err)

	if err != nil {
		// If there's an error retrieving users, return a 500 Internal Server Error
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": "Failed to retrieve Users"})
		return
	}

	// Return the list of users as a JSON response with a 200 OK status
	c.IndentedJSON(http.StatusOK, users)
}

// Function to retrieve a user by their ID
func getUserbyID(c *gin.Context) {
	id := c.Param("id")
	user, err := GetUserByID(id)

	if err != nil {
		// If the user is not found, return a 404 Not Found status
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "User not found."})
		return
	}

	// Return the user details as a JSON response with a 200 OK status
	c.IndentedJSON(http.StatusOK, user)
}

// Function to handle user login
func login(c *gin.Context) {
	username, usernameOk := c.GetQuery("username")
	password, passwordOk := c.GetQuery("password")

	// Check if both username and password parameters are provided
	if !usernameOk || !passwordOk {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Missing username or password query parameter."})
		return
	}

	// Attempt to retrieve the user by username and password
	user, err := tryLogin(db, password, username)
	if err != nil {
		// If login fails, return a 404 Not Found status
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "User not found."})
		return
	}

	// Return the user details as a JSON response with a 200 OK status
	c.IndentedJSON(http.StatusOK, user)
}

// Function to handle buying stocks
func buyStock(c *gin.Context) {
	username, usernameOK := c.GetQuery("username")
	quantity, quantityOk := c.GetQuery("quantity")
	stock, stockOk := c.GetQuery("stock")
	price, priceOk := c.GetQuery("price")

	// Check if all required parameters are provided
	if !usernameOK || !quantityOk || !stockOk || !priceOk {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Missing required parameters"})
		return
	}

	// Create a tuple string in the format (quantity, stock, price)
	tupleString := fmt.Sprintf("(%s, \"%s\", %s)", quantity, stock, price)

	// Attempt to add the tuple to the user's stockTrades
	userHistory, err := AddTupleToStockTrades(db, username, tupleString)
	if err != nil {
		// If the operation fails, return a 404 Not Found status
		fmt.Println(err)
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "Stock not added"})
		return
	}

	// Return the updated user history as a JSON response with a 200 OK status
	c.IndentedJSON(http.StatusOK, userHistory)
}

// Function to handle selling stocks
func sellStock(c *gin.Context) {
	username, usernameOK := c.GetQuery("username")
	quantity, quantityOk := c.GetQuery("quantity")
	stock, stockOk := c.GetQuery("stock")
	price, priceOk := c.GetQuery("price")

	// Check if all required parameters are provided
	if !usernameOK || !quantityOk || !stockOk || !priceOk {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Missing required parameters"})
		return
	}

	// Create the tuple string in the format (quantity, "stock", price)
	tupleString := fmt.Sprintf("(%s, \"%s\", %s)", quantity, stock, price)
	fmt.Println(tupleString)

	// Attempt to remove the tuple from the user's stockTrades
	// stockNames  := []string{}
	// quantityList := []string{}

	userHistory, quantityList, stockNames, err := RemoveTupleInStockTrades(db, username, stock, quantity, price)
	fmt.Println(quantityList, stockNames)
	if err != nil {
		// If the operation fails, return a 404 Not Found status
		fmt.Println(err)
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "Stock not removed"})
		return
	}

	// Return the updated user history as a JSON response with a 200 OK status
	c.IndentedJSON(http.StatusOK, userHistory)
}


func createUser(c *gin.Context) {
	var newUser User

	// Bind the JSON payload to the newUser struct
	if err := c.BindJSON(&newUser); err != nil {
		fmt.Println(err)
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Invalid request payload"})
		return
	}

	// Save the new user to the database
	err := CreateUser(db, newUser)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": "Failed to create user"})
		return
	}

	// Return the newly created user as a JSON response with a 201 Created status
	c.IndentedJSON(http.StatusCreated, newUser)
}
type Response struct {
	QuantitySlice  []string `json:"quantitySlice"`
	NameSlice []string `json:"nameSlice"`
	PriceSlice []string `json:"priceSlice"`

}

func sendStockAssets(c *gin.Context) {
	username, usernameOK := c.GetQuery("username")
	quantity, quantityOk := c.GetQuery("quantity")
	if !usernameOK || !quantityOk  {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Missing required parameters"})
		return
	}



	userHistory, quantityList, stockNames, priceList, err := sendSymbolandPrice(db, username,  quantity)
	fmt.Println(userHistory)
	if err != nil {
		// If the operation fails, return a 404 Not Found status
		fmt.Println(err)
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "Stock not removed"})
		return
	}



	response := Response{
		QuantitySlice:  quantityList,
		NameSlice: stockNames,
		PriceSlice: priceList,
	}

	c.JSON(http.StatusOK, response)
}


func updateCash(c *gin.Context) {
	username, usernameOK := c.GetQuery("username")
	cash, cashOk := c.GetQuery("cash")
	
	// Check if all required parameters are provided
	if !usernameOK || !cashOk  {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Missing required parameters"})
		return
	}


	userHistory, err := setCash(db, username, cash)
	if err != nil {
		// If the operation fails, return a 404 Not Found status
		fmt.Println(err)
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "setCash not excecuted correctly"})
		return
	}

	// Return the updated user history as a JSON response with a 200 OK status
	c.IndentedJSON(http.StatusOK, userHistory)
}



func updateNetworth(c *gin.Context) {
	username, usernameOK := c.GetQuery("username")
	networth, networthOk := c.GetQuery("networth")
	
	// Check if all required parameters are provided
	if !usernameOK || !networthOk  {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Missing required parameters"})
		return
	}


	userHistory, err := setNetworth(db, username, networth)
	if err != nil {
		// If the operation fails, return a 404 Not Found status
		fmt.Println(err)
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "Stock not removed"})
		return
	}

	// Return the updated user history as a JSON response with a 200 OK status
	c.IndentedJSON(http.StatusOK, userHistory)
}

type sendCashtoReact struct {
	Cash string `json:"cash"`

}
func sendCashValue(c *gin.Context) {
	username, usernameOK := c.GetQuery("username")
	
	// Check if all required parameters are provided
	if !usernameOK   {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Missing required parameters"})
		return
	}


	cash, err := GetCash(db, username)
	if err != nil {
		// If the operation fails, return a 404 Not Found status
		fmt.Println(err)
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "GetCash not excecuted correctly"})
		return
	}


	response := sendCashtoReact{
		Cash:  cash,
		
	}

	c.JSON(http.StatusOK, response)
}
type sendNetworth struct {
	Cash string `json:"cash"`

}

func sendNetworthValue(c *gin.Context) {
	username, usernameOK := c.GetQuery("username")
	fmt.Println("here")

	// Check if all required parameters are provided
	if !usernameOK {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Missing required parameters"})
		return
	}

	// Calculate the net worth
	cash, err := calculateNetworth(db, username)
	if err != nil {
		// If the operation fails, return a 404 Not Found status
		fmt.Println(err)
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "GetCash not executed correctly"})
		return
	}

	// Convert the cash value to a string
	cashString := fmt.Sprintf("%.2f", cash)

	// Prepare the response
	response := sendNetworth{
		Cash: cashString,
	}

	// Send the response
	c.JSON(http.StatusOK, response)
}



func addPurchase(c *gin.Context) {
	username, usernameOK := c.GetQuery("username")
	itemName, itemNameOK := c.GetQuery("itemName")
	price, quantityOK := c.GetQuery("price")
	
	// Check if all required parameters are provided
	if !usernameOK || !itemNameOK || !quantityOK  {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Missing required parameters"})
		return
	}

	quantityInt, err := strconv.Atoi(price)
        if err != nil {
                fmt.Println("Error converting string to integer:", err)
                return
        }


	userHistory, err := setPurchases(db, username, itemName, quantityInt)
	if err != nil {
		// If the operation fails, return a 404 Not Found status
		fmt.Println(err)
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "setCash not excecuted correctly"})
		return
	}

	// Return the updated user history as a JSON response with a 200 OK status
	c.IndentedJSON(http.StatusOK, userHistory)
}

type purchaseInfo struct {
	PurchasesSlice  []string `json:"purchasesSlice"`
	PricesList []int `json:"pricesList"`

}

func sendPurchaseInfo(c *gin.Context) {
	username, usernameOK := c.GetQuery("username")
	if !usernameOK   {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Missing required parameters"})
		return
	}



	purchases, prices, err := getPurchases(db, username)
	if err != nil {
		// If the operation fails, return a 404 Not Found status
		fmt.Println(err)
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "Purchases couln't be retrieved :("})
		return
	}



	response := purchaseInfo{
		PurchasesSlice:  purchases,
		PricesList: prices,
	}

	c.JSON(http.StatusOK, response)
}





func clearPurchase(c *gin.Context) {
	username, usernameOK := c.GetQuery("username")
	
	
	// Check if all required parameters are provided
	if !usernameOK  {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Missing required parameters"})
		return
	}

  
	currUser, err := clearPurchases(db, username)
	if err != nil {
		// If the operation fails, return a 404 Not Found status
		fmt.Println(err)
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "setCash not excecuted correctly"})
		return
	}
	fmt.Println("Deletion")
	// Return the updated user history as a JSON response with a 200 OK status
	c.IndentedJSON(http.StatusOK, currUser)
}




func main() {
	// Initialize the database connection
	ConnectDatabase()

	router := gin.Default()

	// Enable CORS for all origins
    router.Use(cors.Default())

	router.GET("/users", getUsers)
	router.GET("/users/:id", getUserbyID)
	router.POST("/users", createUser)
	router.PATCH("/login", login)
	router.PATCH("/buy", buyStock)
	router.PATCH("/sell", sellStock) 
	router.GET("/getStockAssets", sendStockAssets)
	router.GET("/getCash", sendCashValue)
	router.GET("/getNetworth",sendNetworthValue )
	router.PATCH("/addItem",addPurchase )
	router.GET("/getPurchases", sendPurchaseInfo)
	router.PATCH("/clearPurchase", clearPurchase)



	router.PATCH("/setCash",updateCash )
	router.PATCH("/setNetworth",updateNetworth )


	router.Run("localhost:8080")
}
