package pdf

import (
	"context"
	"fmt"
	"omega-resume/internal/db"
	"os"

	"github.com/chromedp/cdproto/page"
	"github.com/chromedp/chromedp"
)

func GeneratePDF(resume *db.Resume) ([]byte, error) {

	html, err := GenerateHTML(resume)

	if err != nil {
		return nil, err
	}

	// This is the most reliable way to feed complex HTML/CSS into chromedp.
	tmpfile, err := os.CreateTemp("", "resume-*.html")
	if err != nil {
		return nil, fmt.Errorf("failed to create temp file: %v", err)
	}
	// Ensure we clean up the temporary file after execution
	defer tmpfile.Close()
	defer os.Remove(tmpfile.Name())

	if _, err := tmpfile.Write([]byte(html)); err != nil {
		return nil, fmt.Errorf("failed to write to temp file: %v", err)
	}
	if err := tmpfile.Close(); err != nil {
		return nil, fmt.Errorf("failed to close temp file: %v", err)
	}

	// 3. Set up the Chromedp context
	ctx, cancel := chromedp.NewContext(context.Background())
	defer cancel()

	// 4. Generate the PDF
	var pdfBuffer []byte
	err = chromedp.Run(ctx,
		// Navigate to the local HTML file we just created
		chromedp.Navigate("file://"+tmpfile.Name()),

		// Wait for the body to be rendered to ensure fonts/styles are loaded
		chromedp.WaitVisible("body", chromedp.ByQuery),

		// Execute the PrintToPDF command
		chromedp.ActionFunc(func(ctx context.Context) error {
			buf, _, err := page.PrintToPDF().
				WithPrintBackground(true). // Include background colors/images
				//WithPaperWidth(8.27).      // A4 width in inches (use 8.5 for US Letter)
				//WithPaperHeight(11.69).    // A4 height in inches (use 11 for US Letter)
				WithMarginTop(0).
				WithMarginBottom(0).
				WithMarginLeft(0).
				WithMarginRight(0).
				Do(ctx)

			if err != nil {
				return err
			}
			pdfBuffer = buf
			return nil
		}),
	)

	if err != nil {
		return nil, fmt.Errorf("failed to generate PDF via chromedp: %v", err)
	}

	return pdfBuffer, nil
}
