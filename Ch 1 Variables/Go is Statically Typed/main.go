package main

import "fmt"

func main() {
	var username string = "presidentSkroob"
	var password int = 12345

	// don't edit below this line
	fmt.Println("Authorization: Basic", username+":"+password)
}
