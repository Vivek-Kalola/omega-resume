package db

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sync"

	"github.com/sirupsen/logrus"
)

const (
	File      = "./db/db.json"
	DefaultID = 1
)

type dbData struct {
	Users   map[int]User   `json:"users"`
	Resumes map[int]Resume `json:"resumes"`
}

type DB struct {
	mu      sync.RWMutex
	users   map[int]User
	resumes map[int]Resume
	logger  *logrus.Logger
}

func NewDB(logger *logrus.Logger) (*DB, error) {
	db := &DB{
		users:   make(map[int]User),
		resumes: make(map[int]Resume),
		logger:  logger,
	}
	err := db.load()
	if err != nil {
		return nil, err
	}
	return db, nil
}

func (db *DB) load() error {
	db.mu.Lock()
	defer db.mu.Unlock()

	dir := filepath.Dir(File)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return fmt.Errorf("failed to create directory: %w", err)
	}

	if _, err := os.Stat(File); os.IsNotExist(err) {
		// File doesn't exist, create it with an empty JSON object "{}"
		if err := db.saveLocked(); err != nil {
			return err
		}
	} else {
		fileData, err := os.ReadFile(File)
		if err != nil {
			return fmt.Errorf("failed to read file: %w", err)
		}

		if len(fileData) == 0 {
			return nil
		}

		var rawMap map[string]json.RawMessage
		if err := json.Unmarshal(fileData, &rawMap); err != nil {
			return err
		}

		_, hasUsers := rawMap["users"]
		_, hasResumes := rawMap["resumes"]

		if hasUsers || hasResumes {
			var data dbData
			if err := json.Unmarshal(fileData, &data); err != nil {
				return err
			}
			if data.Users != nil {
				db.users = data.Users
			}
			if data.Resumes != nil {
				db.resumes = data.Resumes
			}
		} else {
			if err := json.Unmarshal(fileData, &db.resumes); err != nil {
				return err
			}
			// Migrate it immediately
			db.saveLocked()
		}
		return nil
	}

	return nil
}

func (db *DB) save() error {
	db.mu.Lock()
	defer db.mu.Unlock()
	return db.saveLocked()
}

func (db *DB) saveLocked() error {
	dataToSave := dbData{
		Users:   db.users,
		Resumes: db.resumes,
	}
	data, err := json.MarshalIndent(dataToSave, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(File, data, os.ModePerm)
}

func (db *DB) UpsertResume(resume Resume) (int, error) {
	db.mu.Lock()
	defer db.mu.Unlock()

	if resume.ID <= 0 {
		resume.ID = len(db.resumes) + 1
	}

	db.resumes[resume.ID] = resume

	err := db.saveLocked()
	if err != nil {
		return -1, err
	}

	return resume.ID, nil
}

func (db *DB) GetResume(id int) (Resume, bool) {
	db.mu.Lock()
	defer db.mu.Unlock()

	resume, ok := db.resumes[id]
	return resume, ok
}

func (db *DB) GetDefaultResume() (Resume, bool) {
	return db.GetResume(DefaultID)
}

func (db *DB) DeleteResume(id int) error {
	db.mu.Lock()
	defer db.mu.Unlock()

	delete(db.resumes, id)

	return db.saveLocked()
}

func (db *DB) GetUserByUsername(username string) (User, bool) {
	db.mu.RLock()
	defer db.mu.RUnlock()
	for _, u := range db.users {
		if u.Username == username {
			return u, true
		}
	}
	return User{}, false
}

func (db *DB) GetUserByID(id int) (User, bool) {
	db.mu.RLock()
	defer db.mu.RUnlock()
	u, ok := db.users[id]
	return u, ok
}

func (db *DB) UpsertUser(user User) (int, error) {
	db.mu.Lock()
	defer db.mu.Unlock()

	if user.ID <= 0 {
		user.ID = len(db.users) + 1
	}

	db.users[user.ID] = user

	err := db.saveLocked()
	if err != nil {
		return -1, err
	}

	return user.ID, nil
}
