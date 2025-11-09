package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

func captureWeatherInfo(city string) interface{} {
	var response struct {
		Data struct {
			Temperature float32 `json:"temperature"`
			Country     string  `json:"country"`
		} `json:"data"`
	}

	apiUrl := fmt.Sprintf("http://localhost:3000/weather/%s", city)
	resp, err := http.Get(apiUrl)
	if err != nil {
		fmt.Printf("Error in fetching data from weather API %v \n", err)
		return response
	}
	defer resp.Body.Close()
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		fmt.Printf("Error decoding incoming weather info %v \n", err)
		return response
	}
	return response
}

func main() {
	startNow := time.Now()
	fmt.Println("Hello API")
	cities := []string{"London", "New York", "Tokyo", "Paris", "Sydney"}

	for _, city := range cities {
		data := captureWeatherInfo(city)
		fmt.Printf("City weather data %v \n", data)
	}

	fmt.Printf("Took %v to complete capture weather data from API", time.Since(startNow))

}
