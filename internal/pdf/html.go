package pdf

import (
	"bytes"
	"fmt"
	"html/template"
	"omega-resume/internal/db"
	"strings"

	"github.com/sirupsen/logrus"
	"github.com/yuin/goldmark"
	"github.com/yuin/goldmark/renderer/html"
)

func GenerateHTML(resume *db.Resume) (string, error) {
	funcMap := template.FuncMap{
		"markdown": func(s string) template.HTML {
			var buf bytes.Buffer
			md := goldmark.New(
				goldmark.WithRendererOptions(
					html.WithUnsafe(),
				),
			)
			if err := md.Convert([]byte(s), &buf); err != nil {
				return template.HTML(s) // Fallback to raw string if conversion fails
			}
			return template.HTML(strings.TrimSpace(buf.String()))
		},
	}

	tmpl, err := template.New("resume.gohtml").Funcs(funcMap).ParseFiles("./db/resume.gohtml")
	if err != nil {
		return "", fmt.Errorf("error parsing template: %v", err)
	}

	var htmlBuffer bytes.Buffer
	if err := tmpl.Execute(&htmlBuffer, resume); err != nil {
		return "", fmt.Errorf("error executing template: %v", err)
	}

	return htmlBuffer.String(), nil
}

func main() {
	logger := logrus.New()
	logger.SetFormatter(&logrus.JSONFormatter{})
	logger.SetLevel(logrus.DebugLevel)

	database, err := db.NewDB(logger)
	if err != nil {
		logger.Fatal(err)
	}

	resume, ok := database.GetDefaultResume()

	resume.PersonalInfo.Title = "Product Engineer"
	resume.PersonalInfo.Tags = "Immediate Joiner • 8+ Yoe • Observability • Video • FinTech"

	if !ok {
		logger.Fatal("No default resume")
	}

	html, err := GeneratePDF(&resume)

	if err != nil {
		logger.Fatal(err)
	}

	fmt.Println(html)
}
