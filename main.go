package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
	"time"
)

func captureWeatherInfo(city string, ch chan<- string, wg *sync.WaitGroup) interface{} {
	var response struct {
		Data struct {
			Temperature float32 `json:"temperature"`
			Country     string  `json:"country"`
		} `json:"data"`
	}

	defer wg.Done()

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
	ch <- fmt.Sprintf("This is the city %s", city)
	return response
}

func main() {
	startNow := time.Now()
	fmt.Println("Hello API")

	ch := make(chan string)
	var wg sync.WaitGroup

	cities := []string{"London", "New York", "Tokyo", "Paris", "Sydney"}

	for _, city := range cities {
		wg.Add(1)
		go captureWeatherInfo(city, ch, &wg)
	}

	go func() {
		wg.Wait()
		close(ch)
	}()

	for result := range ch {
		fmt.Println(result)
	}

	fmt.Printf("Took %v to complete capture weather data from API", time.Since(startNow))

}
