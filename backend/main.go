package main

import (
	"context"
	"crypto/aes"
	"crypto/cipher"
	"encoding/json"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"time"

	"github.com/docker/docker/client"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

// main is the entry point for the application.
func main() {
	// --- Initialization ---

	// Create a new context for the application.
	// This context will be used for all background operations, including Docker client calls.
	ctx := context.Background()

	// Initialize the Docker client.
	// client.FromEnv is a helper that reads environment variables (like DOCKER_HOST)
	// to configure the client. This is the standard way to connect to a local Docker daemon.
	cli, err := client.NewClientWithOpts(client.FromEnv)
	if err != nil {
		// If we can't connect to Docker, the application is useless.
		// We log a fatal error and exit.
		log.Fatalf("Failed to create Docker client: %v", err)
	}

	// Ping the Docker daemon to confirm a successful connection.
	// This is a crucial health check on startup.
	ping, err := cli.Ping(ctx)
	if err != nil {
		log.Fatalf("Failed to ping Docker daemon: %v", err)
	}
	log.Printf("Successfully connected to Docker daemon. API Version: %s", ping.APIVersion)

	// --- API Router Setup ---

	// Create a new chi router.
	r := chi.NewRouter()

	// Add CORS middleware for development (allow all origins).
	r.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "*") // TODO: Restrict in production
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			if r.Method == "OPTIONS" {
				w.WriteHeader(http.StatusOK)
				return
			}
			next.ServeHTTP(w, r)
		})
	})

	// Add some standard middleware.
	// Logger prints a log line for each request.
	// Recoverer catches panics and returns a 500 error.
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Timeout(60 * time.Second)) // Set a reasonable request timeout.

	// Define the API routes.
	// We'll create a sub-router for all /api endpoints.
	r.Route("/api", func(r chi.Router) {
		// The /status endpoint is our basic health check.
		// It confirms that the server is running and can talk to Docker.
		r.Get("/status", handleGetStatus(cli))

		// The /deploy endpoint handles application deployment requests
		r.Post("/deploy", handleDeploy(cli))

		// The /validate endpoint validates deployment configurations
		r.Post("/validate", handleValidateConfig())
	})

	// --- Frontend File Server (Placeholder) ---

	// TODO: Add code to serve the static files from the ./web directory.
	// We'll use http.FileServer for this later.

	// --- Start Server ---

	log.Println("Starting server on :8081...")
	if err := http.ListenAndServe(":8081", r); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

// handleGetStatus is the HTTP handler for the /api/status endpoint.
// It takes the Docker client as a dependency.
func handleGetStatus(cli *client.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Ping the Docker daemon again to get live data.
		ping, err := cli.Ping(r.Context())
		if err != nil {
			// If we can't ping Docker, something is wrong. Return a 500 error.
			http.Error(w, "Failed to connect to Docker daemon", http.StatusInternalServerError)
			log.Printf("Error pinging Docker for status: %v", err)
			return
		}

		// Create a response struct.
		status := struct {
			ServerStatus     string `json:"server_status"`
			DockerAPIVersion string `json:"docker_api_version"`
			DockerOK         bool   `json:"docker_ok"`
		}{
			ServerStatus:     "OK",
			DockerAPIVersion: ping.APIVersion,
			DockerOK:         ping.APIVersion != "",
		}

		// Set the content type header to application/json.
		w.Header().Set("Content-Type", "application/json")

		// Encode the struct to JSON and write it to the response.
		if err := json.NewEncoder(w).Encode(status); err != nil {
			http.Error(w, "Failed to write response", http.StatusInternalServerError)
			log.Printf("Error encoding status response: %v", err)
		}
	}
}

// DeploymentRequest represents the structure of deployment requests from the frontend
type DeploymentRequest struct {
	AppID         string                 `json:"app_id"`
	Configuration map[string]interface{} `json:"configuration"`
	Timestamp     int64                  `json:"timestamp"`
	RequestID     string                 `json:"request_id"`
}

// EncryptionMetadata represents encrypted field information
type EncryptionMetadata struct {
	SessionKey      []byte                        `json:"sessionKey"`
	EncryptedFields map[string]EncryptedFieldData `json:"encryptedFields"`
	Algorithm       string                        `json:"algorithm"`
	Version         string                        `json:"version"`
}

// EncryptedFieldData represents an encrypted field value
type EncryptedFieldData struct {
	Encrypted []byte `json:"encrypted"`
	IV        []byte `json:"iv"`
}

// handleDeploy is the HTTP handler for the /api/deploy endpoint.
func handleDeploy(cli *client.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Parse the request body
		var req DeploymentRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			log.Printf("Error parsing deploy request: %v", err)
			return
		}

		// Validate required fields
		if req.AppID == "" {
			http.Error(w, "app_id is required", http.StatusBadRequest)
			return
		}

		log.Printf("Received deployment request for app: %s (request ID: %s)", req.AppID, req.RequestID)

		// Check if the request contains encrypted fields
		if encryptionData, hasEncryption := req.Configuration["_encryption"]; hasEncryption {
			// Decrypt sensitive fields
			decryptedConfig, err := decryptConfiguration(req.Configuration, encryptionData)
			if err != nil {
				http.Error(w, "Failed to decrypt configuration", http.StatusBadRequest)
				log.Printf("Decryption failed: %v", err)
				return
			}
			req.Configuration = decryptedConfig
			log.Printf("Successfully decrypted sensitive fields")
		}

		// TODO: Implement actual Docker deployment logic here
		// For now, we'll simulate the deployment process
		deploymentResult := simulateDeployment(req.AppID, req.Configuration)

		// Create response
		response := map[string]interface{}{
			"status":     "success",
			"message":    fmt.Sprintf("Successfully initiated deployment of %s", req.AppID),
			"request_id": req.RequestID,
			"deployment": deploymentResult,
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(response); err != nil {
			http.Error(w, "Failed to write response", http.StatusInternalServerError)
			log.Printf("Error encoding deploy response: %v", err)
		}
	}
}

// decryptConfiguration decrypts sensitive fields in the configuration
func decryptConfiguration(config map[string]interface{}, encryptionData interface{}) (map[string]interface{}, error) {
	// Convert encryption metadata
	encBytes, err := json.Marshal(encryptionData)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal encryption data: %w", err)
	}

	var encMeta EncryptionMetadata
	if err := json.Unmarshal(encBytes, &encMeta); err != nil {
		return nil, fmt.Errorf("failed to unmarshal encryption metadata: %w", err)
	}

	// Validate encryption version and algorithm
	if encMeta.Version != "1.0" || encMeta.Algorithm != "AES-GCM" {
		return nil, fmt.Errorf("unsupported encryption version or algorithm")
	}

	// Create AES cipher
	block, err := aes.NewCipher(encMeta.SessionKey)
	if err != nil {
		return nil, fmt.Errorf("failed to create AES cipher: %w", err)
	}

	aesGCM, err := cipher.NewGCM(block)
	if err != nil {
		return nil, fmt.Errorf("failed to create GCM: %w", err)
	}

	// Create a copy of the configuration without encryption metadata
	result := make(map[string]interface{})
	for k, v := range config {
		if k != "_encryption" {
			result[k] = v
		}
	}

	// Decrypt each encrypted field
	for fieldName, encryptedData := range encMeta.EncryptedFields {
		plaintext, err := aesGCM.Open(nil, encryptedData.IV, encryptedData.Encrypted, nil)
		if err != nil {
			return nil, fmt.Errorf("failed to decrypt field %s: %w", fieldName, err)
		}
		result[fieldName] = string(plaintext)
		log.Printf("Decrypted field: %s", fieldName)
	}

	return result, nil
}

// simulateDeployment simulates the deployment process (replace with actual Docker logic)
func simulateDeployment(appID string, config map[string]interface{}) map[string]interface{} {
	// Log configuration (excluding sensitive fields for security)
	safeConfig := make(map[string]interface{})
	for k, v := range config {
		if isSensitiveField(k) {
			safeConfig[k] = "[REDACTED]"
		} else {
			safeConfig[k] = v
		}
	}
	log.Printf("Deploying %s with configuration: %+v", appID, safeConfig)

	// Return mock deployment result
	return map[string]interface{}{
		"container_id": fmt.Sprintf("%s-container-123", appID),
		"status":       "deploying",
		"created_at":   time.Now().UTC().Format(time.RFC3339),
	}
}

// isSensitiveField checks if a field name indicates sensitive data
func isSensitiveField(fieldName string) bool {
	sensitivePatterns := []string{
		"password", "token", "secret", "key", "apikey",
	}

	fieldLower := fmt.Sprintf("%v", fieldName)
	for _, pattern := range sensitivePatterns {
		if fmt.Sprintf("%v", fieldLower) == pattern ||
			fmt.Sprintf("%v", fieldName) == pattern {
			return true
		}
	}
	return false
}

// ValidationRequest represents a configuration validation request
type ValidationRequest struct {
	AppID         string                 `json:"app_id"`
	Configuration map[string]interface{} `json:"configuration"`
}

// ValidationResult represents the result of a configuration validation
type ValidationResult struct {
	Field   string `json:"field"`
	Valid   bool   `json:"valid"`
	Message string `json:"message"`
	Type    string `json:"type"` // "error", "warning", "info"
}

// ValidationResponse represents the full validation response
type ValidationResponse struct {
	Valid   bool               `json:"valid"`
	Results []ValidationResult `json:"results"`
	Summary string             `json:"summary"`
}

// handleValidateConfig validates deployment configuration without deploying
func handleValidateConfig() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req ValidationRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		if req.AppID == "" {
			http.Error(w, "app_id is required", http.StatusBadRequest)
			return
		}

		log.Printf("Validating configuration for app: %s", req.AppID)

		// Validate the configuration
		results := validateConfiguration(req.AppID, req.Configuration)

		// Determine overall validity
		valid := true
		for _, result := range results {
			if !result.Valid && result.Type == "error" {
				valid = false
				break
			}
		}

		// Create summary
		errorCount := 0
		warningCount := 0
		for _, result := range results {
			if result.Type == "error" && !result.Valid {
				errorCount++
			} else if result.Type == "warning" && !result.Valid {
				warningCount++
			}
		}

		summary := "Configuration is valid and ready for deployment"
		if errorCount > 0 {
			summary = fmt.Sprintf("%d error(s) found - deployment will fail", errorCount)
		} else if warningCount > 0 {
			summary = fmt.Sprintf("%d warning(s) found - deployment may have issues", warningCount)
		}

		response := ValidationResponse{
			Valid:   valid,
			Results: results,
			Summary: summary,
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(response); err != nil {
			http.Error(w, "Failed to write response", http.StatusInternalServerError)
			log.Printf("Error encoding validation response: %v", err)
		}
	}
}

// validateConfiguration validates all configuration fields for an app
func validateConfiguration(appID string, config map[string]interface{}) []ValidationResult {
	var results []ValidationResult

	// Common validations for all apps
	results = append(results, validateDomain(config)...)
	results = append(results, validatePaths(config)...)
	results = append(results, validatePorts(config)...)
	results = append(results, validatePasswords(config)...)
	results = append(results, validateEmails(config)...)

	// App-specific validations
	switch appID {
	case "nextcloud":
		results = append(results, validateNextcloudConfig(config)...)
	case "immich":
		results = append(results, validateImmichConfig(config)...)
	case "vaultwarden":
		results = append(results, validateVaultwardenConfig(config)...)
	case "jellyfin":
		results = append(results, validateJellyfinConfig(config)...)
	case "navidrome":
		results = append(results, validateNavidromeConfig(config)...)
	case "joplin-server":
		results = append(results, validateJoplinConfig(config)...)
	}

	return results
}

// validateDomain validates domain name fields
func validateDomain(config map[string]interface{}) []ValidationResult {
	var results []ValidationResult

	domain, exists := config["domain"].(string)
	if !exists || domain == "" {
		return results
	}

	// Basic domain format validation
	domainPattern := regexp.MustCompile(`^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$`)
	if !domainPattern.MatchString(domain) {
		results = append(results, ValidationResult{
			Field:   "domain",
			Valid:   false,
			Message: "Invalid domain format",
			Type:    "error",
		})
		return results
	}

	// Check if domain resolves (DNS lookup)
	_, err := net.LookupHost(domain)
	if err != nil {
		results = append(results, ValidationResult{
			Field:   "domain",
			Valid:   false,
			Message: fmt.Sprintf("Domain does not resolve: %s", err.Error()),
			Type:    "warning",
		})
	} else {
		results = append(results, ValidationResult{
			Field:   "domain",
			Valid:   true,
			Message: "Domain is valid and resolves",
			Type:    "info",
		})
	}

	return results
}

// validatePaths validates file system paths
func validatePaths(config map[string]interface{}) []ValidationResult {
	var results []ValidationResult

	pathFields := []string{"storage", "uploadPath", "mediaPath", "musicPath"}

	for _, field := range pathFields {
		if pathValue, exists := config[field].(string); exists && pathValue != "" {
			result := validatePath(field, pathValue)
			results = append(results, result)
		}
	}

	return results
}

// validatePath validates a single file system path
func validatePath(fieldName, path string) ValidationResult {
	// Check if path is absolute
	if !filepath.IsAbs(path) {
		return ValidationResult{
			Field:   fieldName,
			Valid:   false,
			Message: "Path must be absolute (start with /)",
			Type:    "error",
		}
	}

	// Check if parent directory exists and is writable
	parentDir := filepath.Dir(path)
	if _, err := os.Stat(parentDir); os.IsNotExist(err) {
		return ValidationResult{
			Field:   fieldName,
			Valid:   false,
			Message: fmt.Sprintf("Parent directory does not exist: %s", parentDir),
			Type:    "error",
		}
	}

	// Try to create the directory to test write permissions
	if err := os.MkdirAll(path, 0755); err != nil {
		return ValidationResult{
			Field:   fieldName,
			Valid:   false,
			Message: fmt.Sprintf("Cannot create directory (permission denied): %s", err.Error()),
			Type:    "error",
		}
	}

	// Clean up test directory if it was just created
	if info, err := os.Stat(path); err == nil && info.IsDir() {
		// Check if directory is empty before removing
		if entries, err := os.ReadDir(path); err == nil && len(entries) == 0 {
			os.Remove(path) // Only remove if empty
		}
	}

	return ValidationResult{
		Field:   fieldName,
		Valid:   true,
		Message: "Path is valid and writable",
		Type:    "info",
	}
}

// validatePorts validates port configurations
func validatePorts(config map[string]interface{}) []ValidationResult {
	var results []ValidationResult

	portFields := []string{"smtpPort", "port"}

	for _, field := range portFields {
		if portValue, exists := config[field]; exists {
			var port int
			var err error

			switch v := portValue.(type) {
			case string:
				port, err = strconv.Atoi(v)
			case float64:
				port = int(v)
			case int:
				port = v
			default:
				results = append(results, ValidationResult{
					Field:   field,
					Valid:   false,
					Message: "Port must be a number",
					Type:    "error",
				})
				continue
			}

			if err != nil {
				results = append(results, ValidationResult{
					Field:   field,
					Valid:   false,
					Message: "Invalid port number format",
					Type:    "error",
				})
				continue
			}

			if port < 1 || port > 65535 {
				results = append(results, ValidationResult{
					Field:   field,
					Valid:   false,
					Message: "Port must be between 1 and 65535",
					Type:    "error",
				})
			} else {
				results = append(results, ValidationResult{
					Field:   field,
					Valid:   true,
					Message: "Port number is valid",
					Type:    "info",
				})
			}
		}
	}

	return results
}

// validatePasswords validates password strength
func validatePasswords(config map[string]interface{}) []ValidationResult {
	var results []ValidationResult

	passwordFields := []string{"adminPassword", "dbPassword", "adminToken"}

	for _, field := range passwordFields {
		if password, exists := config[field].(string); exists && password != "" {
			result := validatePassword(field, password)
			results = append(results, result)
		}
	}

	return results
}

// validatePassword validates a single password
func validatePassword(fieldName, password string) ValidationResult {
	if len(password) < 8 {
		return ValidationResult{
			Field:   fieldName,
			Valid:   false,
			Message: "Password must be at least 8 characters long",
			Type:    "error",
		}
	}

	// Check for complexity
	hasUpper := regexp.MustCompile(`[A-Z]`).MatchString(password)
	hasLower := regexp.MustCompile(`[a-z]`).MatchString(password)
	hasNumber := regexp.MustCompile(`[0-9]`).MatchString(password)
	hasSpecial := regexp.MustCompile(`[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]`).MatchString(password)

	strength := 0
	if hasUpper {
		strength++
	}
	if hasLower {
		strength++
	}
	if hasNumber {
		strength++
	}
	if hasSpecial {
		strength++
	}

	if strength < 3 {
		return ValidationResult{
			Field:   fieldName,
			Valid:   true,
			Message: "Password is weak - consider adding uppercase, lowercase, numbers, and special characters",
			Type:    "warning",
		}
	}

	return ValidationResult{
		Field:   fieldName,
		Valid:   true,
		Message: "Password strength is good",
		Type:    "info",
	}
}

// validateEmails validates email format
func validateEmails(config map[string]interface{}) []ValidationResult {
	var results []ValidationResult

	emailFields := []string{"email", "adminEmail"}

	for _, field := range emailFields {
		if email, exists := config[field].(string); exists && email != "" {
			emailPattern := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
			if !emailPattern.MatchString(email) {
				results = append(results, ValidationResult{
					Field:   field,
					Valid:   false,
					Message: "Invalid email format",
					Type:    "error",
				})
			} else {
				results = append(results, ValidationResult{
					Field:   field,
					Valid:   true,
					Message: "Email format is valid",
					Type:    "info",
				})
			}
		}
	}

	return results
}

// App-specific validation functions
func validateNextcloudConfig(config map[string]interface{}) []ValidationResult {
	var results []ValidationResult

	// Validate storage path specifically for Nextcloud
	if storage, exists := config["storage"].(string); exists {
		// Nextcloud needs significant disk space
		result := checkDiskSpace(storage, 1024*1024*1024) // 1GB minimum
		results = append(results, ValidationResult{
			Field:   "storage",
			Valid:   result.Valid,
			Message: result.Message,
			Type:    result.Type,
		})
	}

	return results
}

func validateImmichConfig(config map[string]interface{}) []ValidationResult {
	var results []ValidationResult

	// Check if machine learning is enabled and warn about resources
	if ml, exists := config["machinelearning"].(bool); exists && ml {
		results = append(results, ValidationResult{
			Field:   "machinelearning",
			Valid:   true,
			Message: "Machine learning enabled - ensure adequate RAM (8GB+) and CPU resources",
			Type:    "warning",
		})
	}

	return results
}

func validateVaultwardenConfig(config map[string]interface{}) []ValidationResult {
	var results []ValidationResult

	// Check SMTP configuration if provided
	if smtpHost, exists := config["smtpHost"].(string); exists && smtpHost != "" {
		// Try to resolve SMTP host
		if _, err := net.LookupHost(smtpHost); err != nil {
			results = append(results, ValidationResult{
				Field:   "smtpHost",
				Valid:   false,
				Message: fmt.Sprintf("SMTP host does not resolve: %s", err.Error()),
				Type:    "warning",
			})
		}
	}

	return results
}

func validateJellyfinConfig(config map[string]interface{}) []ValidationResult {
	var results []ValidationResult

	// Validate media path exists and has content
	if mediaPath, exists := config["mediaPath"].(string); exists {
		if _, err := os.Stat(mediaPath); err == nil {
			// Check if directory has media files
			entries, err := os.ReadDir(mediaPath)
			if err == nil && len(entries) == 0 {
				results = append(results, ValidationResult{
					Field:   "mediaPath",
					Valid:   true,
					Message: "Media directory exists but appears empty",
					Type:    "warning",
				})
			}
		}
	}

	return results
}

func validateNavidromeConfig(config map[string]interface{}) []ValidationResult {
	var results []ValidationResult

	// Validate scan interval
	if interval, exists := config["scanInterval"]; exists {
		var minutes int
		switch v := interval.(type) {
		case string:
			if parsed, err := strconv.Atoi(v); err == nil {
				minutes = parsed
			}
		case float64:
			minutes = int(v)
		case int:
			minutes = v
		}

		if minutes > 0 && minutes < 5 {
			results = append(results, ValidationResult{
				Field:   "scanInterval",
				Valid:   true,
				Message: "Very frequent scanning may impact performance",
				Type:    "warning",
			})
		}
	}

	return results
}

func validateJoplinConfig(config map[string]interface{}) []ValidationResult {
	var results []ValidationResult

	// Validate max item size
	if maxSize, exists := config["maxItemSize"]; exists {
		var sizeMB int
		switch v := maxSize.(type) {
		case string:
			if parsed, err := strconv.Atoi(v); err == nil {
				sizeMB = parsed
			}
		case float64:
			sizeMB = int(v)
		case int:
			sizeMB = v
		}

		if sizeMB > 100 {
			results = append(results, ValidationResult{
				Field:   "maxItemSize",
				Valid:   true,
				Message: "Large item size may impact sync performance",
				Type:    "warning",
			})
		}
	}

	return results
}

// checkDiskSpace checks available disk space at a path
func checkDiskSpace(path string, requiredBytes int64) ValidationResult {
	// Create the directory if it doesn't exist to test
	if err := os.MkdirAll(path, 0755); err != nil {
		return ValidationResult{
			Valid:   false,
			Message: fmt.Sprintf("Cannot access path: %s", err.Error()),
			Type:    "error",
		}
	}

	// Get filesystem stats
	// Note: This is a simplified check. In production, you'd use syscall.Statfs on Unix
	// or similar platform-specific methods to get actual disk space
	return ValidationResult{
		Valid:   true,
		Message: "Path is accessible (disk space check requires platform-specific implementation)",
		Type:    "info",
	}
}
