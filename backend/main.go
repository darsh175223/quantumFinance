package main
//main.go
import (
	"net/http"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
	"github.com/sirupsen/logrus"
	"time"
	"os"
	"strconv"
)

// Initialize the logger
var log = logrus.New()

// LogMiddleware logs the details of every request
func LogMiddleware(c *gin.Context) {
	startTime := time.Now()

	// Process request
	c.Next()

	// Log the request details
	endTime := time.Now()
	latency := endTime.Sub(startTime)

	// Status code, method, path, latency, client IP, and user agent
	statusCode := c.Writer.Status()
	clientIP := c.ClientIP()
	method := c.Request.Method
	path := c.Request.URL.Path
	userAgent := c.Request.UserAgent()

	log.WithFields(logrus.Fields{
		"statusCode": statusCode,
		"latency":    latency,
		"clientIP":   clientIP,
		"method":     method,
		"path":       path,
		"userAgent":  userAgent,
	}).Info("Request logged")
}

func init() {
	// Open a file for logging
	logFile, err := os.OpenFile("./security/Qfinance.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		log.Fatal("Could not open log file", err)
	}

	// Set the output of the logger to the file
	log.Out = logFile

	// Optionally, set the log level (optional)
	log.SetLevel(logrus.InfoLevel)

	// Set log format (optional)
	log.SetFormatter(&logrus.TextFormatter{
		FullTimestamp: true,
	})
}


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
		fmt.Println("error:", err)
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


func Register(c *gin.Context) {
	fmt.Println("reached here")

	username, usernameOK := c.GetQuery("username")
	password, quantityOk := c.GetQuery("password")
	name, stockOk := c.GetQuery("name")
	ID, priceOk := c.GetQuery("ID")

	if !usernameOK || !quantityOk || !stockOk || !priceOk {
		fmt.Println("Missing required parameters")
		fmt.Println("username", username)
		fmt.Println("password", password)
		fmt.Println("firstname", name)
		fmt.Println("lastname", ID)
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Missing required parameters"})
		return
	}

	


	fmt.Println("got the id", ID)

	


	// Attempt to retrieve the user by username and password
	user, err := CreateUser(db, username, password, name,ID )
	fmt.Println("Query passed")

	if err != nil {
		// If login fails, return a 404 Not Found status
		fmt.Println("error is", err)
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "User not found."})
		return
	}
	fmt.Println("There's no err, user is found/registered")

	// Return the user details as a JSON response with a 200 OK status
	c.IndentedJSON(http.StatusOK, user)
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


func addCoveredCall(c *gin.Context) {
	username, usernameOK := c.GetQuery("username")
	symbol, symbolOk := c.GetQuery("symbol")
	strikePrice, strikePriceOk := c.GetQuery("strikePrice")
	basePrice, basePriceOk:=c.GetQuery("basePrice")
	time, timeOk :=c.GetQuery("time")
	
	fmt.Println("reached here")
	
	// Check if all required parameters are provided
	if !usernameOK || !symbolOk || !strikePriceOk || !timeOk||!basePriceOk {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Missing required parameters"})
		return
	}

	concatenatedString := ";("+symbol+","+strikePrice+","+basePrice+","+time+");";

	userHistory, err := updateCoveredCall(db, username, concatenatedString);
	if err != nil {
		// If the operation fails, return a 404 Not Found status
		fmt.Println("err: ",err)
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "addCoveredCall not excecuted correctly"})
		return
	}
	fmt.Println(userHistory)
	// Return the updated user history as a JSON response with a 200 OK status
	c.IndentedJSON(http.StatusOK, userHistory)
}

func addMarriedPut(c *gin.Context) {
	username, usernameOK := c.GetQuery("username")
	symbol, symbolOk := c.GetQuery("symbol")
	strikePrice, strikePriceOk := c.GetQuery("strikePrice")
	basePrice, basePriceOk:=c.GetQuery("basePrice")
	time, timeOk :=c.GetQuery("time")
	
	fmt.Println("reached here")
	
	// Check if all required parameters are provided
	if !usernameOK || !symbolOk || !strikePriceOk || !timeOk||!basePriceOk {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Missing required parameters"})
		return
	}

	concatenatedString := ";("+symbol+","+strikePrice+","+basePrice+","+time+");";
	fmt.Println(concatenatedString)

	userHistory, err := updateMarriedPut(db, username, concatenatedString);
	if err != nil {
		// If the operation fails, return a 404 Not Found status
		fmt.Println(err)
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "marriedPut not excecuted correctly"})
		return
	}

	// Return the updated user history as a JSON response with a 200 OK status
	c.IndentedJSON(http.StatusOK, userHistory)
}




func addBullCallSpread(c *gin.Context) {
	username, usernameOK := c.GetQuery("username")
	symbol, symbolOk := c.GetQuery("symbol")
	strikePrice, strikePriceOk := c.GetQuery("strikePrice")
	higherStrikePrice, higherStrikePriceOk :=c.GetQuery("higherStrikePrice")
	time, timeOk :=c.GetQuery("time")

	
	fmt.Println(" addBullCallSpread reached here")
	
	// Check if all required parameters are provided
	if !usernameOK || !symbolOk || !strikePriceOk || !higherStrikePriceOk||!timeOk {
		fmt.Println(!usernameOK,!symbolOk, !strikePriceOk, !higherStrikePriceOk )
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Missing required parameters"})
		return
	}

	concatenatedString := ";("+symbol+","+strikePrice+","+higherStrikePrice+","+time+");";

	userHistory, err := updateBullCallSpread(db, username, concatenatedString);
	if err != nil {
		// If the operation fails, return a 404 Not Found status
		fmt.Println(err)
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "addBullCallSpread not excecuted correctly"})
		return
	}

	// Return the updated user history as a JSON response with a 200 OK status
	c.IndentedJSON(http.StatusOK, userHistory)
}

func addBearPutSpread(c *gin.Context) {
	username, usernameOK := c.GetQuery("username")
	symbol, symbolOk := c.GetQuery("symbol")
	strikePrice, strikePriceOk := c.GetQuery("strikePrice")
	lowerStrikePrice, lowerStrikePriceOk :=c.GetQuery("lowerStrikePrice")
	time, timeOk :=c.GetQuery("time")

	
	fmt.Println(" addBullCallSpread reached here")
	
	// Check if all required parameters are provided
	if !usernameOK || !symbolOk || !strikePriceOk || !lowerStrikePriceOk ||!timeOk{
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Missing required parameters"})
		return
	}

	concatenatedString := ";("+symbol+","+strikePrice+","+lowerStrikePrice+","+time+");";

	userHistory, err := updateBearPutSpread(db, username, concatenatedString);
	if err != nil {
		// If the operation fails, return a 404 Not Found status
		fmt.Println(err)
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "addBearPutSpread not excecuted correctly"})
		return
	}

	// Return the updated user history as a JSON response with a 200 OK status
	c.IndentedJSON(http.StatusOK, userHistory)
}

func addProtectiveCollar(c *gin.Context) {
	username, usernameOK := c.GetQuery("username")
	symbol, symbolOk := c.GetQuery("symbol")
	call, strikePriceOk := c.GetQuery("call")
	put, lowerStrikePriceOk :=c.GetQuery("put")
	time, timeOk :=c.GetQuery("time")

	
	
	fmt.Println(" addBullCallSpread reached here")
	
	// Check if all required parameters are provided
	if !usernameOK || !symbolOk || !strikePriceOk || !lowerStrikePriceOk||!timeOk {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Missing required parameters"})
		return
	}

	concatenatedString := ";("+symbol+","+call+","+put+","+time+");";

	userHistory, err := updateProtectiveCollar(db, username, concatenatedString);
	if err != nil {
		// If the operation fails, return a 404 Not Found status
		fmt.Println(err)
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "addProtectiveCollar not excecuted correctly"})
		return
	}

	// Return the updated user history as a JSON response with a 200 OK status
	c.IndentedJSON(http.StatusOK, userHistory)
}

func addLongStraddle(c *gin.Context) {
	username, usernameOK := c.GetQuery("username")
	symbol, symbolOk := c.GetQuery("symbol")
	call, strikePriceOk := c.GetQuery("call")
	quantity, lowerStrikePriceOk :=c.GetQuery("quantity")
	time, timeOk :=c.GetQuery("time")

	
	
	
	// Check if all required parameters are provided
	if !usernameOK || !symbolOk || !strikePriceOk || !lowerStrikePriceOk||!timeOk {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Missing required parameters"})
		return
	}

	concatenatedString := ";("+symbol+","+call+","+quantity+","+time+");";

	userHistory, err := updateLongStraddle(db, username, concatenatedString);
	if err != nil {
		// If the operation fails, return a 404 Not Found status
		fmt.Println(err)
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "addLongStraddle not excecuted correctly"})
		return
	}

	// Return the updated user history as a JSON response with a 200 OK status
	c.IndentedJSON(http.StatusOK, userHistory)
}

func addLongStrangle(c *gin.Context) {
	username, usernameOK := c.GetQuery("username")
	symbol, symbolOk := c.GetQuery("symbol")
	call, strikePriceOk := c.GetQuery("call")
	put, lowerStrikePriceOk :=c.GetQuery("put")
	time, timeOk :=c.GetQuery("time")

	
	
	
	// Check if all required parameters are provided
	if !usernameOK || !symbolOk || !strikePriceOk || !lowerStrikePriceOk||!timeOk {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Missing required parameters"})
		return
	}

	concatenatedString := ";("+symbol+","+call+","+put+","+time+");";

	userHistory, err := updateLongStrangle(db, username, concatenatedString);
	if err != nil {
		// If the operation fails, return a 404 Not Found status
		fmt.Println(err)
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "addLongStraddle not excecuted correctly"})
		return
	}

	// Return the updated user history as a JSON response with a 200 OK status
	c.IndentedJSON(http.StatusOK, userHistory)
}

func addLongCallButterflySpread(c *gin.Context) {
	username, usernameOK := c.GetQuery("username")
	symbol, symbolOk := c.GetQuery("symbol")
	call, strikePriceOk := c.GetQuery("doubleCall")
	put, lowerStrikePriceOk :=c.GetQuery("boughtCall")
	time, timeOk :=c.GetQuery("time")
	
	
	// Check if all required parameters are provided
	if !usernameOK || !symbolOk || !strikePriceOk || !lowerStrikePriceOk||!timeOk {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Missing required parameters"})
		return
	}

	concatenatedString := ";("+symbol+","+call+","+put+","+time+");";

	userHistory, err := updateLongCallButterflySpread(db, username, concatenatedString);
	if err != nil {
		// If the operation fails, return a 404 Not Found status
		fmt.Println(err)
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "addLongStraddle not excecuted correctly"})
		return
	}

	// Return the updated user history as a JSON response with a 200 OK status
	c.IndentedJSON(http.StatusOK, userHistory)
}

func addIronCondor(c *gin.Context) {
	username, usernameOK := c.GetQuery("username")
	symbol, symbolOk := c.GetQuery("symbol")
	call, strikePriceOk := c.GetQuery("high")
	put, lowerStrikePriceOk :=c.GetQuery("low")
	time, timeOk :=c.GetQuery("time")
	
	
	// Check if all required parameters are provided
	if !usernameOK || !symbolOk || !strikePriceOk || !lowerStrikePriceOk||!timeOk {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Missing required parameters"})
		return
	}

	concatenatedString := ";("+symbol+","+call+","+put+","+time+");";

	userHistory, err := updateIronCondor(db, username, concatenatedString);
	if err != nil {
		// If the operation fails, return a 404 Not Found status
		fmt.Println(err)
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "addLongStraddle not excecuted correctly"})
		return
	}

	// Return the updated user history as a JSON response with a 200 OK status
	c.IndentedJSON(http.StatusOK, userHistory)
}

func addIronButterfly(c *gin.Context) {
	username, usernameOK := c.GetQuery("username")
	symbol, symbolOk := c.GetQuery("symbol")
	call, strikePriceOk := c.GetQuery("strike")
	put, lowerStrikePriceOk :=c.GetQuery("range")
	time, timeOk :=c.GetQuery("time")
	
	
	// Check if all required parameters are provided
	if !usernameOK || !symbolOk || !strikePriceOk || !lowerStrikePriceOk||!timeOk {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Missing required parameters"})
		return
	}

	concatenatedString := ";("+symbol+","+call+","+put+","+time+");";

	userHistory, err := updateIronButterfly(db, username, concatenatedString);
	if err != nil {
		// If the operation fails, return a 404 Not Found status
		fmt.Println("Err:",err)
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": " not excecuted correctly"})
		return
	}

	// Return the updated user history as a JSON response with a 200 OK status
	c.IndentedJSON(http.StatusOK, userHistory)
}

func addReversal(c *gin.Context) {
	username, usernameOK := c.GetQuery("username")
	symbol, symbolOk := c.GetQuery("symbol")
	call, strikePriceOk := c.GetQuery("call")
	put, lowerStrikePriceOk :=c.GetQuery("put")
	time, timeOk :=c.GetQuery("time")
	
	
	// Check if all required parameters are provided
	if !usernameOK || !symbolOk || !strikePriceOk || !lowerStrikePriceOk||!timeOk {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Missing required parameters"})
		return
	}

	concatenatedString := ";("+symbol+","+call+","+put+","+time+");";

	userHistory, err := updateReversal(db, username, concatenatedString);
	if err != nil {
		// If the operation fails, return a 404 Not Found status
		fmt.Println(err)
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "addLongStraddle not excecuted correctly"})
		return
	}

	// Return the updated user history as a JSON response with a 200 OK status
	c.IndentedJSON(http.StatusOK, userHistory)
}

type SendOptions struct {
	Options  []string `json:"options"`
}

func sendOptions(c *gin.Context) {
	username, usernameOK := c.GetQuery("username")
	if !usernameOK   {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Missing required parameters"})
		return
	}



	optionsList, err := getNonNullColumns(db, username)
	fmt.Println("optionsList: ",optionsList)
	if err != nil {
		// If the operation fails, return a 404 Not Found status
		fmt.Println(err)
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "Stock not removed"})
		return
	}



	response := SendOptions{
		Options:  optionsList,
	
	}

	c.JSON(http.StatusOK, response)
}
type profitStruct struct {
	Profit  int `json:"cash"`
}

func sendProfit(c *gin.Context) {
	username, usernameOK := c.GetQuery("username")
	if !usernameOK   {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Missing required parameters"})
		return
	}



	profit, err := returnProfit(db, username)
	if err != nil {
		// If the operation fails, return a 404 Not Found status
		fmt.Println(err)
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "Stock not removed"})
		return
	}
	// fmt.Println("optionsList: ",profit)



	response := profitStruct{
		Profit:  profit,
	
	}

	c.JSON(http.StatusOK, response)
}

func main() {
	// Initialize the database connection
	ConnectDatabase()

	router := gin.Default()

	// Enable CORS for all origins
    router.Use(cors.Default())

	// Use the logging middleware
	router.Use(LogMiddleware)

	router.GET("/users", getUsers)
	router.GET("/users/:id", getUserbyID)
	router.POST("/register", Register)
	router.PATCH("/login", login)
	router.PATCH("/buy", buyStock)
	router.PATCH("/sell", sellStock) 
	router.GET("/getStockAssets", sendStockAssets)
	router.GET("/getCash", sendCashValue)
	router.GET("/getNetworth",sendNetworthValue )
	router.PATCH("/addItem",addPurchase )
	router.GET("/getPurchases", sendPurchaseInfo)
	router.PATCH("/clearPurchase", clearPurchase)

	router.PATCH("/addCoveredCall", addCoveredCall)
	router.PATCH("/addMarriedPut", addMarriedPut)
	router.PATCH("/addBullCallSpread", addBullCallSpread)
	router.PATCH("/addBearPutSpread", addBearPutSpread)
	router.PATCH("/addProtectiveCollar", addProtectiveCollar)
	router.PATCH("/addLongStraddle", addLongStraddle)
	router.PATCH("/addLongStrangle", addLongStrangle)
	router.PATCH("/addLongCallButterflySpread", addLongCallButterflySpread)
	router.PATCH("/addIronCondor", addIronCondor)
	router.PATCH("/addIronButterfly", addIronButterfly)
	router.PATCH("/addReversal", addReversal)


	router.GET("/sendProfit", sendProfit)







	router.GET("/getAllOptions", sendOptions)





	router.PATCH("/setCash",updateCash )
	router.PATCH("/setNetworth",updateNetworth )


	router.Run("localhost:8080")
}
