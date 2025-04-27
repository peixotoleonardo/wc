package main

import (
	"fmt"
	"os"
	"strings"
	"sync"
)

type (
	Count struct {
		Filename string
		Bytes    int
		Chars    int
		Lines    int
		Words    int
	}

	CountOptions struct {
		Bytes bool
		Chars bool
		Lines bool
		Words bool
		Help  bool
	}

	Option struct {
		Description string
		Command     string
		Shortcut    string
	}
)

func (f *CountOptions) ClearDefaultValues() {
	f.Bytes = false
	f.Lines = false
	f.Words = false
}

const (
	DEFAULT_BYTES = true
	DEFAULT_LINES = true
	DEFAULT_WORDS = true
)

func NewFlags() CountOptions {
	return CountOptions{
		Bytes: DEFAULT_BYTES,
		Lines: DEFAULT_LINES,
		Words: DEFAULT_WORDS,
	}
}

func NewOption(description, command, shortcut string) Option {
	return Option{
		Description: description,
		Command:     command,
		Shortcut:    shortcut,
	}
}

func countStats(data []byte, countBytes, countChars, countLines, countWords bool) Count {
	count := Count{}
	content := string(data)

	if countBytes {
		count.Bytes = len(data)
	}

	if countChars {
		count.Chars = len([]rune(content))
	}

	if countLines {
		count.Lines = len(strings.Split(content, "\n")) - 1
	}

	if countWords {
		count.Words = len(strings.Fields(content))
	}

	return count
}

func processFiles(files []string, flags CountOptions) ([]Count, error) {
	results := make([]Count, len(files))
	errChan := make(chan error, len(files))

	var wg sync.WaitGroup

	for i, file := range files {
		wg.Add(1)

		go func(index int, filename string) {
			defer wg.Done()

			data, err := os.ReadFile(filename)

			if err != nil {
				errChan <- fmt.Errorf("error reading file %s: %w", file, err)
				return
			}

			count := countStats(data, flags.Bytes, flags.Chars, flags.Lines, flags.Words)
			count.Filename = filename
			results[i] = count
		}(i, file)
	}

	wg.Wait()
	close(errChan)

	for err := range errChan {
		if err != nil {
			return nil, err
		}
	}

	return results, nil
}

func printResults(summaries []Count, flags CountOptions) {
	for _, summary := range summaries {
		var output []string

		if flags.Lines {
			output = append(output, fmt.Sprintf("%8d", summary.Lines))
		}

		if flags.Words {
			output = append(output, fmt.Sprintf("%8d", summary.Words))
		}

		if flags.Chars {
			output = append(output, fmt.Sprintf("%8d", summary.Chars))
		}

		if flags.Bytes {
			output = append(output, fmt.Sprintf("%8d", summary.Bytes))
		}

		fmt.Printf("%s %s\n", strings.Join(output, " "), summary.Filename)
	}
}

func printHelp(options []Option) {
	fmt.Print("Usage: wc [OPTION]... [FILE]...\n\n")
	fmt.Print("Print newline, word, and byte counts for each FILE, and a total line if\n")
	fmt.Print("more than one FILE is specified. A word is a non-zero-length sequence of\n")
	fmt.Print("printable characters delimited by white space.\n\n")
	fmt.Print("With no FILE, or when FILE is -, read standard input.\n\n")
	fmt.Print("The options below may be used to select which counts are printed, always in\n")
	fmt.Print("the following order: newline, word, character, byte, maximum line length.\n\n")

	for _, option := range options {
		fmt.Printf("  -%s, --%s    %s\n", option.Shortcut, option.Command, option.Description)
	}
}

func parse(args []string, options []Option) (CountOptions, []string) {
	flags := NewFlags()
	files := []string{}

	shortcuts := make(map[string]string)

	for _, opt := range options {
		shortcuts[opt.Shortcut] = opt.Command
	}

	hasBeenReset := false

	for _, arg := range args {
		if strings.HasPrefix(arg, "-") {
			if !hasBeenReset {
				hasBeenReset = true
				flags.ClearDefaultValues()
			}

			if strings.HasPrefix(arg, "--") {
				handleCommand(&flags, arg[2:])
				continue
			}

			handleShortFlags(&flags, arg[1:], shortcuts)
		} else {
			files = append(files, arg)
		}
	}

	return flags, files
}

func handleShortFlags(option *CountOptions, shortFlags string, shortcuts map[string]string) {
	for _, shortcut := range shortFlags {
		handleCommand(option, shortcuts[string(shortcut)])
	}
}

func handleCommand(option *CountOptions, command string) {
	switch command {
	case "bytes":
		option.Bytes = true
	case "chars":
		option.Chars = true
	case "lines":
		option.Lines = true
	case "words":
		option.Words = true
	case "help":
		option.Help = true
	}
}

func main() {
	opts := []Option{
		NewOption("print the byte counts", "bytes", "c"),
		NewOption("print the character counts", "chars", "m"),
		NewOption("print the newline counts", "lines", "l"),
		NewOption("print the word counts", "words", "w"),
	}

	flags, files := parse(os.Args[1:], opts)

	if flags.Help {
		printHelp(opts)
		return
	}

	summaries, err := processFiles(files, flags)

	if err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}

	printResults(summaries, flags)
}
