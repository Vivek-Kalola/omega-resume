package handler

import (
	"net/http"
	"omega-resume/internal/db"
	"omega-resume/internal/pdf"

	"github.com/gin-gonic/gin"
)

type ResumeHandler struct {
	db *db.DB
}

func NewResumeHandler(db *db.DB) *ResumeHandler {
	return &ResumeHandler{db: db}
}

func (h *ResumeHandler) GetMyResume(context *gin.Context) {
	userID := context.GetInt("userID")
	resume, ok := h.db.GetResume(userID)
	if !ok {
		context.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "Resume not found"})
		return
	}
	context.JSON(http.StatusOK, resume)
}

func (h *ResumeHandler) CreateMyResume(context *gin.Context) {
	userID := context.GetInt("userID")
	resume := &db.Resume{}

	err := context.ShouldBindBodyWithJSON(resume)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Lock the resume to this user
	resume.ID = userID

	id, err := h.db.UpsertResume(*resume)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "Resume uploaded successfully", "id": id})
}

func (h *ResumeHandler) DeleteMyResume(context *gin.Context) {
	userID := context.GetInt("userID")
	err := h.db.DeleteResume(userID)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	context.Status(http.StatusOK)
}

func (h *ResumeHandler) GenerateHTML(context *gin.Context) {
	resume := &db.Resume{}

	err := context.ShouldBindBodyWithJSON(resume)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	html, err := pdf.GenerateHTML(resume)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	context.JSON(http.StatusOK, gin.H{"html": html})
}

func (h *ResumeHandler) GeneratePDF(context *gin.Context) {
	resume := &db.Resume{}

	err := context.ShouldBindBodyWithJSON(resume)

	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	pdfBytes, err := pdf.GeneratePDF(resume)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	context.Header("Content-Disposition", "inline; filename=tailored-resume.pdf")
	context.Data(http.StatusOK, "application/pdf", pdfBytes)
}

func (h *ResumeHandler) GenerateMyPDF(context *gin.Context) {
	userID := context.GetInt("userID")
	resume, ok := h.db.GetResume(userID)
	if !ok {
		context.AbortWithStatus(http.StatusNotFound)
		return
	}
	pdfBytes, err := pdf.GeneratePDF(&resume)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	context.Header("Content-Disposition", "inline; filename=resume.pdf")
	context.Data(http.StatusOK, "application/pdf", pdfBytes)
}
