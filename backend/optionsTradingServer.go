package main

import (
	"database/sql"
	"fmt"
	"strings"

	// "strings"

	_ "github.com/go-sql-driver/mysql"
	// "log"
	// "encoding/json"
	"errors"
	// "io/ioutil"
	// "net/http"
	"strconv"
	"math"
	"regexp"
)


type userOptions struct {
	Username    string `json:"username"`
	CoveredCall     string `json:"coveredCall"`
	MarriedPut  string `json:"marriedPut"` 
	BullCallSpread    string `json:"bullCallSpread"`
	BearPutSpread    string `json:"bearPutSpread"`
	ProtectiveCollar    string `json:"protectiveCollar"`
	LongStraddle     string `json:"longStraddle"`
	LongStrangle     string `json:"longStrangle"`
	LongCallButterflySpread     string `json:"longCallButterflySpread"`
	IronCondor     string `json:"ironCondor"`
	IronButterfly     string `json:"ironButterfly"`
	Conversion     string `json:"conversion"`
	Reversal     string `json:"reversal"`


	
}


// Function to update the coveredCall value for a specific username
func updateCoveredCall(db *sql.DB, username string, newCoveredCall string) (string, error) {
    var coveredCall sql.NullString
    query := "SELECT coveredCall FROM optionStrategies WHERE username = ?"
    
    // Retrieve the current coveredCall value
    err := db.QueryRow(query, username).Scan(&coveredCall)
    if err != nil {
        if err == sql.ErrNoRows {
            return "", fmt.Errorf("no rows found for username: %s", username)
        }
        return "", err
    }

    // If the coveredCall value is NULL, use newCoveredCall as the first entry
    var updatedCoveredCall string
    if coveredCall.Valid {
        updatedCoveredCall = coveredCall.String + newCoveredCall
    } else {
        updatedCoveredCall = newCoveredCall
    }

    // Update the coveredCall column with the concatenated string
    updateQuery := "UPDATE optionStrategies SET coveredCall = ? WHERE username = ?"
    _, err = db.Exec(updateQuery, updatedCoveredCall, username)
    if err != nil {
        return "",err
    }

    return updatedCoveredCall, nil
}

// Function to update the coveredCall value for a specific username
func updateMarriedPut(db *sql.DB, username string, newCoveredCall string) (string, error) {
    var coveredCall sql.NullString
    query := "SELECT MarriedPut FROM optionStrategies WHERE username = ?"
    
    // Retrieve the current coveredCall value
    err := db.QueryRow(query, username).Scan(&coveredCall)
    if err != nil {
        if err == sql.ErrNoRows {
            return "", fmt.Errorf("no rows found for username: %s", username)
        }
        return "", err
    }

    // If the coveredCall value is NULL, use newCoveredCall as the first entry
    var updatedCoveredCall string
    if coveredCall.Valid {
        updatedCoveredCall = coveredCall.String + newCoveredCall
    } else {
        updatedCoveredCall = newCoveredCall
    }

    // Update the coveredCall column with the concatenated string
    updateQuery := "UPDATE optionStrategies SET MarriedPut  = ? WHERE username = ?"
    _, err = db.Exec(updateQuery, updatedCoveredCall, username)
    if err != nil {
        return "",err
    }

    return updatedCoveredCall, nil
}


func updateBullCallSpread(db *sql.DB, username string, newCoveredCall string) (string, error) {
	//Parameters of bull call spread is symbol, strike price of bought call, strike price of sold call (Make it higher than the bought call)
    var coveredCall sql.NullString
    query := "SELECT BullCallSpread  FROM optionStrategies WHERE username = ?"
    
    // Retrieve the current coveredCall value
    err := db.QueryRow(query, username).Scan(&coveredCall)
    if err != nil {
        if err == sql.ErrNoRows {
            return "", fmt.Errorf("no rows found for username: %s", username)
        }
        return "", err
    }

    // If the coveredCall value is NULL, use newCoveredCall as the first entry
    var updatedCoveredCall string
    if coveredCall.Valid {
        updatedCoveredCall = coveredCall.String + newCoveredCall
    } else {
        updatedCoveredCall = newCoveredCall
    }

    // Update the coveredCall column with the concatenated string
    updateQuery := "UPDATE optionStrategies SET bullCallSpread  = ? WHERE username = ?"
    _, err = db.Exec(updateQuery, updatedCoveredCall, username)
    if err != nil {
        return "",err
    }

    return updatedCoveredCall, nil
}

func updateBearPutSpread(db *sql.DB, username string, newCoveredCall string) (string, error) {
	//Parameters of bull call spread is symbol, strike price of bought call, strike price of sold call (Make it higher than the bought call)
    var coveredCall sql.NullString
    query := "SELECT BearPutSpread FROM optionStrategies WHERE username = ?"
    
    // Retrieve the current coveredCall value
    err := db.QueryRow(query, username).Scan(&coveredCall)
    if err != nil {
        if err == sql.ErrNoRows {
            return "", fmt.Errorf("no rows found for username: %s", username)
        }
        return "", err
    }

    // If the coveredCall value is NULL, use newCoveredCall as the first entry
    var updatedCoveredCall string
    if coveredCall.Valid {
        updatedCoveredCall = coveredCall.String + newCoveredCall
    } else {
        updatedCoveredCall = newCoveredCall
    }

    // Update the coveredCall column with the concatenated string
    updateQuery := "UPDATE optionStrategies SET bearPutSpread   = ? WHERE username = ?"
    _, err = db.Exec(updateQuery, updatedCoveredCall, username)
    if err != nil {
        return "",err
    }

    return updatedCoveredCall, nil
}

func updateProtectiveCollar(db *sql.DB, username string, newCoveredCall string) (string, error) {
	//Parameters of bull call spread is symbol, strike price of bought call, strike price of sold call (Make it higher than the bought call)
    var coveredCall sql.NullString
    query := "SELECT ProtectiveCollar FROM optionStrategies WHERE username = ?"
    
    // Retrieve the current coveredCall value
    err := db.QueryRow(query, username).Scan(&coveredCall)
    if err != nil {
        if err == sql.ErrNoRows {
            return "", fmt.Errorf("no rows found for username: %s", username)
        }
        return "", err
    }

    // If the coveredCall value is NULL, use newCoveredCall as the first entry
    var updatedCoveredCall string
    if coveredCall.Valid {
        updatedCoveredCall = coveredCall.String + newCoveredCall
    } else {
        updatedCoveredCall = newCoveredCall
    }

    // Update the coveredCall column with the concatenated string
    updateQuery := "UPDATE optionStrategies SET protectiveCollar = ? WHERE username = ?"
    _, err = db.Exec(updateQuery, updatedCoveredCall, username)
    if err != nil {
        return "",err
    }

    return updatedCoveredCall, nil
}

func updateLongStraddle(db *sql.DB, username string, newCoveredCall string) (string, error) {
	//Parameters of bull call spread is symbol, strike price of bought call, strike price of sold call (Make it higher than the bought call)
    var coveredCall sql.NullString
    query := "SELECT LongStraddle FROM optionStrategies WHERE username = ?"
    
    // Retrieve the current coveredCall value
    err := db.QueryRow(query, username).Scan(&coveredCall)
    if err != nil {
        if err == sql.ErrNoRows {
            return "", fmt.Errorf("no rows found for username: %s", username)
        }
        return "", err
    }

    // If the coveredCall value is NULL, use newCoveredCall as the first entry
    var updatedCoveredCall string
    if coveredCall.Valid {
        updatedCoveredCall = coveredCall.String + newCoveredCall
    } else {
        updatedCoveredCall = newCoveredCall
    }

    // Update the coveredCall column with the concatenated string
    updateQuery := "UPDATE optionStrategies SET longStraddle = ? WHERE username = ?"
    _, err = db.Exec(updateQuery, updatedCoveredCall, username)
    if err != nil {
        return "",err
    }

    return updatedCoveredCall, nil
}

func updateLongStrangle(db *sql.DB, username string, newCoveredCall string) (string, error) {
	//Parameters of bull call spread is symbol, strike price of bought call, strike price of sold call (Make it higher than the bought call)
    var coveredCall sql.NullString
    query := "SELECT LongStrangle FROM optionStrategies WHERE username = ?"
    
    // Retrieve the current coveredCall value
    err := db.QueryRow(query, username).Scan(&coveredCall)
    if err != nil {
        if err == sql.ErrNoRows {
            return "", fmt.Errorf("no rows found for username: %s", username)
        }
        return "", err
    }

    // If the coveredCall value is NULL, use newCoveredCall as the first entry
    var updatedCoveredCall string
    if coveredCall.Valid {
        updatedCoveredCall = coveredCall.String + newCoveredCall
    } else {
        updatedCoveredCall = newCoveredCall
    }

    // Update the coveredCall column with the concatenated string
    updateQuery := "UPDATE optionStrategies SET longStrangle = ? WHERE username = ?"
    _, err = db.Exec(updateQuery, updatedCoveredCall, username)
    if err != nil {
        return "",err
    }

    return updatedCoveredCall, nil
}

func updateLongCallButterflySpread(db *sql.DB, username string, newCoveredCall string) (string, error) {
	//Parameters of bull call spread is symbol, strike price of bought call, strike price of sold call (Make it higher than the bought call)
    var coveredCall sql.NullString
    query := "SELECT LongCallButterflySpread FROM optionStrategies WHERE username = ?"
    
    // Retrieve the current coveredCall value
    err := db.QueryRow(query, username).Scan(&coveredCall)
    if err != nil {
        if err == sql.ErrNoRows {
            return "", fmt.Errorf("no rows found for username: %s", username)
        }
        return "", err
    }

    // If the coveredCall value is NULL, use newCoveredCall as the first entry
    var updatedCoveredCall string
    if coveredCall.Valid {
        updatedCoveredCall = coveredCall.String + newCoveredCall
    } else {
        updatedCoveredCall = newCoveredCall
    }

    // Update the coveredCall column with the concatenated string
    updateQuery := "UPDATE optionStrategies SET longCallButterflySpread = ? WHERE username = ?"
    _, err = db.Exec(updateQuery, updatedCoveredCall, username)
    if err != nil {
        return "",err
    }

    return updatedCoveredCall, nil
}

func updateIronCondor(db *sql.DB, username string, newCoveredCall string) (string, error) {
	//Parameters of bull call spread is symbol, strike price of bought call, strike price of sold call (Make it higher than the bought call)
    var coveredCall sql.NullString
    query := "SELECT IronCondor FROM optionStrategies WHERE username = ?"
    
    // Retrieve the current coveredCall value
    err := db.QueryRow(query, username).Scan(&coveredCall)
    if err != nil {
        if err == sql.ErrNoRows {
            return "", fmt.Errorf("no rows found for username: %s", username)
        }
        return "", err
    }

    // If the coveredCall value is NULL, use newCoveredCall as the first entry
    var updatedCoveredCall string
    if coveredCall.Valid {
        updatedCoveredCall = coveredCall.String + newCoveredCall
    } else {
        updatedCoveredCall = newCoveredCall
    }

    // Update the coveredCall column with the concatenated string
    updateQuery := "UPDATE optionStrategies SET ironCondor = ? WHERE username = ?"
    _, err = db.Exec(updateQuery, updatedCoveredCall, username)
    if err != nil {
        return "",err
    }

    return updatedCoveredCall, nil
}

func updateIronButterfly(db *sql.DB, username string, newCoveredCall string) (string, error) {
	//Parameters of bull call spread is symbol, strike price of bought call, strike price of sold call (Make it higher than the bought call)
    var coveredCall sql.NullString
    query := "SELECT IronButterfly FROM optionStrategies WHERE username = ?"
    
    // Retrieve the current coveredCall value
    err := db.QueryRow(query, username).Scan(&coveredCall)
    if err != nil {
        if err == sql.ErrNoRows {
            return "", fmt.Errorf("no rows found for username: %s", username)
        }
        return "", err
    }

    // If the coveredCall value is NULL, use newCoveredCall as the first entry
    var updatedCoveredCall string
    if coveredCall.Valid {
        updatedCoveredCall = coveredCall.String + newCoveredCall
    } else {
        updatedCoveredCall = newCoveredCall
    }

    // Update the coveredCall column with the concatenated string
    updateQuery := "UPDATE optionStrategies SET ironButterfly = ? WHERE username = ?"
    _, err = db.Exec(updateQuery, updatedCoveredCall, username)
    if err != nil {
        return "",err
    }

    return updatedCoveredCall, nil
}

func updateReversal(db *sql.DB, username string, newCoveredCall string) (string, error) {
	//Parameters of bull call spread is symbol, strike price of bought call, strike price of sold call (Make it higher than the bought call)
    var coveredCall sql.NullString
    query := "SELECT Reversal FROM optionStrategies WHERE username = ?"
    
    // Retrieve the current coveredCall value
    err := db.QueryRow(query, username).Scan(&coveredCall)
    if err != nil {
        if err == sql.ErrNoRows {
            return "", fmt.Errorf("no rows found for username: %s", username)
        }
        return "", err
    }

    // If the coveredCall value is NULL, use newCoveredCall as the first entry
    var updatedCoveredCall string
    if coveredCall.Valid {
        updatedCoveredCall = coveredCall.String + newCoveredCall
    } else {
        updatedCoveredCall = newCoveredCall
    }

    // Update the coveredCall column with the concatenated string
    updateQuery := "UPDATE optionStrategies SET reversal = ? WHERE username = ?"
    _, err = db.Exec(updateQuery, updatedCoveredCall, username)
    if err != nil {
        return "",err
    }

    return updatedCoveredCall, nil
}

func returnProfit(db *sql.DB, username string) (int, error) {
    profit := 0
    optionsList, err := getNonNullColumns(db, username)
    // fmt.Println("optionsList: ", optionsList)
    if err != nil {
        // If the operation fails, return a 404 Not Found status
        fmt.Println(err)
        return 0, err
    }

    // Iterate through the optionsList
    for _, option := range optionsList {
        // Print each option
        fmt.Println( option, strings.Contains(option, "CoveredCall"))

		if(strings.Contains(option, "CoveredCall")){
			p, err := coveredCallProfit(db, option)
			if (err!=nil){
				fmt.Println("Error", err)
			}
			profit = profit+p

		}else if(strings.Contains(option, "MarriedPut")){
			p, err := marriedPutProfit(db, option)
			if (err!=nil){
				fmt.Println("Error", err)
			}
			profit = profit+p

		}else if(strings.Contains(option, "BullCallSpread")){
			p, err := bullCallSpreadProfit(db, option)
			if (err!=nil){
				fmt.Println("Error", err)
			}
			profit = profit+p

		}else if(strings.Contains(option, "BearPutSpread")){
			p, err := bearPutSpreadProfit(db, option)
			if (err!=nil){
				fmt.Println("Error", err)
			}
			profit = profit+p

		}else if(strings.Contains(option, "ProtectiveCollar")){
			p, err := protectiveCollarProfit(db, option)
			if (err!=nil){
				fmt.Println("Error", err)
			}
			profit = profit+p

		}else if(strings.Contains(option, "LongStraddle")){
			p, err := longStraddleProfit(db, option)
			if (err!=nil){
				fmt.Println("Error", err)
			}
			profit = profit+p

		}else if(strings.Contains(option, "LongStrangle")){
			p, err := longStrangleProfit(db, option)
			if (err!=nil){
				fmt.Println("Error", err)
			}
			profit = profit+p

		}else if(strings.Contains(option, "LongCallButterflySpread")){
			p, err := longCallButterflySpreadProfit(db, option)
			if (err!=nil){
				fmt.Println("Error", err)
			}
			profit = profit+p

		}else if(strings.Contains(option, "IronCondor")){
			p, err := ironCondorProfit(db, option)
			if (err!=nil){
				fmt.Println("Error", err)
			}
			profit = profit+p

		}else if(strings.Contains(option, "IronButterfly")){
			p, err := ironButterflyProfit(db, option)
			if (err!=nil){
				fmt.Println("Error", err)
			}
			profit = profit+p

		}else if(strings.Contains(option, "Reversal")){
			p, err := reversalProfit(db, option)
			if (err!=nil){
				fmt.Println("Error", err)
			}
			profit = profit+p

		}

    }

    return profit, nil
}
//username == StockName
func coveredCallProfit(db *sql.DB, coveredCallString string) (int, error) {
		// Implementation for covered call profit calculation
		re := regexp.MustCompile(`\(([^()]*)\)`)

        // Find all matches and extract the captured groups
        matches := re.FindAllStringSubmatch(coveredCallString, -1)

		

        // Create a string slice from the captured groups
        stringSlice := make([]string, len(matches))
        for i, match := range matches {
                stringSlice[i] = match[1]
        }
		// fmt.Println(stringSlice[0])
		profit:=0

		for _, element := range stringSlice {
			parts := strings.Split(element, ",")
		symbol := parts[0]
		fmt.Println(symbol)
        strikePrice, err := strconv.Atoi(parts[1])
		if err!=nil{
			return  0, fmt.Errorf("invalid price format: %w", err)

		}
		pastPrice, err := strconv.ParseFloat(parts[2], 64)
        if err != nil {
                return 0, fmt.Errorf("invalid quantity format: %w", err)
        }
		time, err := strconv.ParseFloat(parts[3], 64)
        if err != nil {
                return 0, fmt.Errorf("invalid quantity format: %w", err)
        }
		currPrice, err:=getCurrentPrice(symbol)
		if (err!=nil){
			fmt.Println("Error", err)
		}
		pastPriceFloat := float64(pastPrice)
		currentPriceFloat := float64(currPrice)
		timeFloat := float64(time)
		// func premium(currentPrice, strikePrice int, timeToExpiry float64, isCall bool) (int, error) {
		if(currPrice<=float64(strikePrice)){
		
			fmt.Println("pastPriceFloat", pastPriceFloat, " currentPriceFloat", currentPriceFloat, " timeFloat", timeFloat)
			premiumPrice, err := premium(currentPriceFloat, pastPriceFloat, timeFloat, true)
			if (err!=nil){
				fmt.Println("Error", err)
			}
			fmt.Println("1premiumPrice", premiumPrice)
			profit = int(currPrice)-int(pastPrice)+premiumPrice


		}else{
			premiumPrice, err := premium(pastPriceFloat, currentPriceFloat, timeFloat, true)
			if (err!=nil){
				fmt.Println("Error", err)
			}
			fmt.Println("2premiumPrice", premiumPrice)

			profit = strikePrice+premiumPrice


		}







			
	}
		

	return profit, nil
}

func marriedPutProfit(db *sql.DB, username string) (int, error) {
    // Implementation for married put profit calculation
    return 0, nil
}

func bullCallSpreadProfit(db *sql.DB, username string) (int, error) {
    // Implementation for bull call spread profit calculation
    return 0, nil
}

func bearPutSpreadProfit(db *sql.DB, username string) (int, error) {
    // Implementation for bear put spread profit calculation
    return 0, nil
}

func protectiveCollarProfit(db *sql.DB, username string) (int, error) {
    // Implementation for protective collar profit calculation
    return 0, nil
}

func longStraddleProfit(db *sql.DB, username string) (int, error) {
    // Implementation for long straddle profit calculation
    return 0, nil
}

func longStrangleProfit(db *sql.DB, username string) (int, error) {
    // Implementation for long strangle profit calculation
    return 0, nil
}

func longCallButterflySpreadProfit(db *sql.DB, username string) (int, error) {
    // Implementation for long call butterfly spread profit calculation
    return 0, nil
}

func ironCondorProfit(db *sql.DB, username string) (int, error) {
    // Implementation for iron condor profit calculation
    return 0, nil
}

func ironButterflyProfit(db *sql.DB, username string) (int, error) {
    // Implementation for iron butterfly profit calculation
    return 0, nil
}

func reversalProfit(db *sql.DB, username string) (int, error) {
    // Implementation for reversal profit calculation
    return 0, nil
}


func premium(currentPrice, strikePrice, timeToExpiry float64, isCall bool) (int, error) {
	if currentPrice <= 0 || strikePrice <= 0 || timeToExpiry <= 0 {
		return 0, errors.New("invalid input: prices and time to expiry must be positive")
	}

	volatility := 0.30 // 30%
	riskFreeRate := 0.05 // 5%

	d1 := (math.Log(currentPrice/strikePrice) + (riskFreeRate+0.5*volatility*volatility)*timeToExpiry) / (volatility * math.Sqrt(timeToExpiry))
	d2 := d1 - volatility*math.Sqrt(timeToExpiry)

	var optionPrice float64
	if isCall {
		optionPrice = currentPrice*normalCDF(d1) - strikePrice*math.Exp(-riskFreeRate*timeToExpiry)*normalCDF(d2)
	} else {
		optionPrice = strikePrice*math.Exp(-riskFreeRate*timeToExpiry)*normalCDF(-d2) - currentPrice*normalCDF(-d1)
	}

	return int(math.Round(optionPrice)), nil
}

func normalCDF(x float64) float64 {
	return 0.5 * (1 + math.Erf(x/math.Sqrt(2)))
}



// Function to retrieve non-null column values for a specific username
func getNonNullColumns(db *sql.DB, username string) ([]string, error) {
	query := `
		SELECT
			coveredCall, MarriedPut, BullCallSpread, BearPutSpread, ProtectiveCollar,
			LongStraddle, LongStrangle, LongCallButterflySpread, IronCondor, IronButterfly,
			Conversion, Reversal
		FROM optionStrategies
		WHERE username = ?`
	
	// Retrieve the row
	row := db.QueryRow(query, username)

	// Define variables to hold the column values
	var coveredCall, marriedPut, bullCallSpread, bearPutSpread, protectiveCollar sql.NullString
	var longStraddle, longStrangle, longCallButterflySpread, ironCondor, ironButterfly sql.NullString
	var conversion, reversal sql.NullString

	err := row.Scan(
		&coveredCall, &marriedPut, &bullCallSpread, &bearPutSpread, &protectiveCollar,
		&longStraddle, &longStrangle, &longCallButterflySpread, &ironCondor, &ironButterfly,
		&conversion, &reversal,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("no rows found for username: %s", username)
		}
		return nil, err
	}

	// Create a slice to hold the non-null column data
	var nonNullColumns []string

	// Append non-null values to the slice
	if coveredCall.Valid {
		nonNullColumns = append(nonNullColumns, fmt.Sprintf("CoveredCall: %s", coveredCall.String))
	}
	if marriedPut.Valid {
		nonNullColumns = append(nonNullColumns, fmt.Sprintf("MarriedPut: %s", marriedPut.String))
	}
	if bullCallSpread.Valid {
		nonNullColumns = append(nonNullColumns, fmt.Sprintf("BullCallSpread: %s", bullCallSpread.String))
	}
	if bearPutSpread.Valid {
		nonNullColumns = append(nonNullColumns, fmt.Sprintf("BearPutSpread: %s", bearPutSpread.String))
	}
	if protectiveCollar.Valid {
		nonNullColumns = append(nonNullColumns, fmt.Sprintf("ProtectiveCollar: %s", protectiveCollar.String))
	}
	if longStraddle.Valid {
		nonNullColumns = append(nonNullColumns, fmt.Sprintf("LongStraddle: %s", longStraddle.String))
	}
	if longStrangle.Valid {
		nonNullColumns = append(nonNullColumns, fmt.Sprintf("LongStrangle: %s", longStrangle.String))
	}
	if longCallButterflySpread.Valid {
		nonNullColumns = append(nonNullColumns, fmt.Sprintf("LongCallButterflySpread: %s", longCallButterflySpread.String))
	}
	if ironCondor.Valid {
		nonNullColumns = append(nonNullColumns, fmt.Sprintf("IronCondor: %s", ironCondor.String))
	}
	if ironButterfly.Valid {
		nonNullColumns = append(nonNullColumns, fmt.Sprintf("IronButterfly: %s", ironButterfly.String))
	}
	if conversion.Valid {
		nonNullColumns = append(nonNullColumns, fmt.Sprintf("Conversion: %s", conversion.String))
	}
	if reversal.Valid {
		nonNullColumns = append(nonNullColumns, fmt.Sprintf("Reversal: %s", reversal.String))
	}

	// Join the non-null columns into a single string
	
	return nonNullColumns, nil
}	