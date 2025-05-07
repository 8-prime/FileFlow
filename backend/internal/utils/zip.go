package utils

import (
	"archive/zip"
	"fmt"
	"io"
	"os"
)

type FileInfo struct {
	Path      string // Path where the file is located
	NameInZip string // Name to use inside the zip archive
}

func AddFileToZip(zipWriter *zip.Writer, fileInfo FileInfo) error {
	// Open the source file
	file, err := os.Open(fileInfo.Path)
	if err != nil {
		return fmt.Errorf("failed to open file %s: %w", fileInfo.Path, err)
	}
	defer file.Close()

	// Get file info to determine size and modification time
	stat, err := file.Stat()
	if err != nil {
		return fmt.Errorf("failed to stat file %s: %w", fileInfo.Path, err)
	}

	// Create a header for this file in the zip
	header := &zip.FileHeader{
		Name:     fileInfo.NameInZip,
		Method:   zip.Deflate,
		Modified: stat.ModTime(),
	}

	// Create the file in the zip archive
	writer, err := zipWriter.CreateHeader(header)
	if err != nil {
		return fmt.Errorf("failed to create zip header for %s: %w", fileInfo.NameInZip, err)
	}

	// Stream the file content to the zip archive
	if _, err = io.Copy(writer, file); err != nil {
		return fmt.Errorf("failed to copy %s to zip: %w", fileInfo.Path, err)
	}

	return nil
}
