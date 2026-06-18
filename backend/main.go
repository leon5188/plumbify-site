package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"strings"
	"time"
)

// Simulation Request/Response structures
type CallRequest struct {
	Phone string `json:"phone"`
}

type CallResponse struct {
	Status       string    `json:"status"`
	Message      string    `json:"message"`
	Timestamp    time.Time `json:"timestamp"`
	AutoResponse string    `json:"autoResponse"`
}

type SMSRequest struct {
	Phone   string `json:"phone"`
	Message string `json:"message"`
	Step    int    `json:"step"` // tracks the user's progress in the chat demo
}

type SMSResponse struct {
	Sender    string    `json:"sender"`
	Text      string    `json:"text"`
	Timestamp time.Time `json:"timestamp"`
	NextStep  int       `json:"nextStep"`
	Captured  bool      `json:"captured"`
	Revenue   int       `json:"revenue"`
}

type ReviewRequest struct {
	Phone  string `json:"phone"`
	Rating int    `json:"rating"`
}

type ReviewResponse struct {
	Status      string    `json:"status"`
	Message     string    `json:"message"`
	ReviewLink  string    `json:"reviewLink,omitempty"`
	NeedsFollow bool      `json:"needsFollow"`
	Timestamp   time.Time `json:"timestamp"`
}

type StatsResponse struct {
	CapturedLeads  int     `json:"capturedLeads"`
	SavedRevenue   int     `json:"savedRevenue"`
	ResponseTime   string  `json:"responseTime"`
	ReviewsCount   int     `json:"reviewsCount"`
	AverageRating  float64 `json:"averageRating"`
	ActiveTechs    int     `json:"activeTechs"`
	JobsDispatched int     `json:"jobsDispatched"`
}

func main() {
	// Seed random generator
	rand.Seed(time.Now().UnixNano())

	mux := http.NewServeMux()

	// Define Routes
	mux.HandleFunc("/api/tour/simulate-call", handleSimulateCall)
	mux.HandleFunc("/api/tour/simulate-sms", handleSimulateSMS)
	mux.HandleFunc("/api/tour/simulate-review", handleSimulateReview)
	mux.HandleFunc("/api/tour/dashboard-stats", handleDashboardStats)

	// Apply CORS Middleware
	handler := enableCORS(mux)

	port := ":8080"
	fmt.Printf("Plumbify Tour API Server running on http://localhost%s\n", port)
	if err := http.ListenAndServe(port, handler); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}

// enableCORS Middleware
func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Set headers
		w.Header().Set("Access-Control-Allow-Origin", "*") // For local dev, allow all. Could restrict to localhost:3000
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

		// Handle preflight OPTIONS request
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// Handler: POST /api/tour/simulate-call
func handleSimulateCall(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req CallRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Bad request payload", http.StatusBadRequest)
		return
	}

	if req.Phone == "" {
		req.Phone = "+1 (555) 019-2834"
	}

	resp := CallResponse{
		Status:       "missed_call_registered",
		Message:      fmt.Sprintf("Missed call from %s intercepted by Plumbify.", req.Phone),
		Timestamp:    time.Now(),
		AutoResponse: "Hi, this is Plumbify! Sorry we missed your call. Need an emergency plumber?",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

// Handler: POST /api/tour/simulate-sms
func handleSimulateSMS(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req SMSRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Bad request payload", http.StatusBadRequest)
		return
	}

	msgText := strings.ToLower(strings.TrimSpace(req.Message))
	var resp SMSResponse
	resp.Sender = "ai"
	resp.Timestamp = time.Now()

	// Simple stateful dialog flow based on req.Step and content keywords
	switch req.Step {
	case 1:
		// User replies to first missed call SMS
		if containsAny(msgText, "yes", "emergency", "leak", "burst", "flood", "water", "clog", "help", "plumber") {
			resp.Text = "Oh no! We can get a master plumber dispatched immediately. Is today at 2 PM or 4 PM better for you?"
			resp.NextStep = 2
		} else {
			resp.Text = "Okay! We can help with bookings, drain clearing, water heaters, or quotes. Would you like to check our availability for today?"
			resp.NextStep = 2
		}
	case 2:
		// User replies with scheduling choice
		if containsAny(msgText, "2", "4", "pm", "today", "now", "afternoon", "first", "second") {
			resp.Text = "Perfect, we've blocked out that slot. What address should we send our technician to?"
			resp.NextStep = 3
		} else {
			resp.Text = "We have slots open today at 2 PM or 4 PM. Which one works best for your schedule?"
			resp.NextStep = 2
		}
	case 3:
		// User provides address -> Booked & Revenue Captured!
		resp.Text = "Got it! Technician Dave is assigned to your job and will head over. He'll text you when he's 15 mins out. You're all set!"
		resp.NextStep = 4
		resp.Captured = true
		resp.Revenue = 850 // Average plumbing emergency ticket value
	default:
		// Restart/idle state
		resp.Text = "Hi! This is the Plumbify AI. I can dispatch an emergency plumber or book a service appointment. What plumbing issue are you experiencing?"
		resp.NextStep = 1
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

// Handler: POST /api/tour/simulate-review
func handleSimulateReview(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req ReviewRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Bad request payload", http.StatusBadRequest)
		return
	}

	var resp ReviewResponse
	resp.Timestamp = time.Now()

	if req.Rating >= 4 {
		resp.Status = "success"
		resp.Message = fmt.Sprintf("Great review! Rating: %d stars. Plumbify routes customer to Google Review page.", req.Rating)
		resp.ReviewLink = "https://g.page/r/plumbify/review"
		resp.NeedsFollow = false
	} else {
		resp.Status = "feedback_captured"
		resp.Message = "Low rating captured privately. Plumbify prevents public negative review and alerts the manager."
		resp.NeedsFollow = true
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

// Handler: GET /api/tour/dashboard-stats
func handleDashboardStats(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Generate semi-dynamic stats
	now := time.Now()
	minute := now.Minute()
	
	// Base values plus minor adjustments to look live
	capturedLeads := 184 + (minute / 5)
	savedRevenue := capturedLeads * 820
	reviewsCount := 98 + (minute / 12)
	averageRating := 4.87 + (float64(minute%5) * 0.005)
	activeTechs := 8
	jobsDispatched := 312 + (minute / 3)

	resp := StatsResponse{
		CapturedLeads:  capturedLeads,
		SavedRevenue:   savedRevenue,
		ResponseTime:   "4.8 seconds",
		ReviewsCount:   reviewsCount,
		AverageRating:  averageRating,
		ActiveTechs:    activeTechs,
		JobsDispatched: jobsDispatched,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

// Helper: check if string contains any of the keywords
func containsAny(s string, keywords ...string) bool {
	for _, kw := range keywords {
		if strings.Contains(s, kw) {
			return true
		}
	}
	return false
}
