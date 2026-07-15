package main

import (
	"flag"
	"omega-resume/internal/api"
	"omega-resume/internal/db"
	"os"
	"strings"

	"github.com/sirupsen/logrus"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	addUserFlag := flag.String("adduser", "", "Add a new user in format username:password")
	flag.Parse()

	logger := logrus.New()
	logger.SetFormatter(&logrus.JSONFormatter{})
	logger.SetLevel(logrus.DebugLevel)

	database, err := db.NewDB(logger)
	if err != nil {
		logger.Fatal(err)
	}

	if *addUserFlag != "" {
		parts := strings.SplitN(*addUserFlag, ":", 2)
		if len(parts) != 2 {
			logger.Fatal("Invalid format for -adduser. Use username:password")
		}
		username := parts[0]
		password := parts[1]

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
		if err != nil {
			logger.Fatal("Failed to hash password: ", err)
		}

		user := db.User{
			Username:     username,
			PasswordHash: string(hashedPassword),
		}

		_, err = database.UpsertUser(user)
		if err != nil {
			logger.Fatal("Failed to add user: ", err)
		}

		logger.Infof("Successfully added user: %s", username)
		os.Exit(0)
	}

	err = api.NewServer(8443, database, logger)
	if err != nil {
		logger.Fatal(err)
	}
}
