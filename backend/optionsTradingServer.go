package main

import (
	"database/sql"
    "fmt"
	// "strings"

    _ "github.com/go-sql-driver/mysql"
    // "log"
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
