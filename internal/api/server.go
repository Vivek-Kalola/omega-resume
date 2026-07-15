package api

import (
	"fmt"
	"net/http"
	"omega-resume/internal/api/handler"
	"omega-resume/internal/db"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

func NewServer(port int, database *db.DB, logger *logrus.Logger) error {
	r := gin.Default()

	resumeHandler := handler.NewResumeHandler(database)

	addRouters(r, database, resumeHandler)

	logger.Info("Starting server on port " + strconv.Itoa(port))
	return r.Run(fmt.Sprintf(":%d", port))
}

func addRouters(r *gin.Engine, database *db.DB, resumeHandler *handler.ResumeHandler) {
	r.HandleMethodNotAllowed = true

	authHandler := handler.NewAuthHandler(database)
	r.POST("/api/login", authHandler.Login)

	r.GET("/healthz", func(c *gin.Context) {
		c.String(http.StatusOK, "OK")
	})

	protected := r.Group("/api")
	protected.Use(handler.AuthMiddleware())

	protected.GET("/resumes/me", resumeHandler.GetMyResume)
	protected.POST("/resumes", resumeHandler.CreateMyResume)
	protected.DELETE("/resumes/me", resumeHandler.DeleteMyResume)
	protected.POST("/resumes/html", resumeHandler.GenerateHTML)
	protected.POST("/resumes/pdf", resumeHandler.GeneratePDF)
	protected.GET("/resumes/me/pdf", resumeHandler.GenerateMyPDF)
}
