import os
import argparse


def generate_markdown(directory, output_file, exclude_dirs=None, exclude_files=None):
    """
    Generates a Markdown file containing all source code files from the specified directory,
    excluding specified directories and files.

    Args:
        directory (str): The target directory to search for source code files.
        output_file (str): The path to the output Markdown file.
        exclude_dirs (list, optional): List of directory names to exclude. Defaults to None.
        exclude_files (list, optional): List of file names to exclude. Defaults to None.
    """
    exclude_dirs = exclude_dirs or []
    exclude_files = exclude_files or []

    with open(output_file, 'w', encoding='utf-8') as md_file:
        for root, dirs, files in os.walk(directory):
            # Modify dirs in-place to exclude specified directories
            dirs[:] = [d for d in dirs if d not in exclude_dirs]

            for file in files:
                if file in exclude_files:
                    continue  # Skip excluded files
                
                # Add or remove file extensions as needed
                if file.endswith(('.ts', '.js', '.jsx', '.tsx', '.html', '.css', '.json', '.ejs', '.md')):
                    file_path = os.path.join(root, file)
                    relative_path = os.path.relpath(file_path, directory)
                    md_file.write(f"## `{relative_path}`\n\n")
                    
                    # Determine the language for syntax highlighting based on file extension
                    if file.endswith('.ts') or file.endswith('.tsx'):
                        language = 'typescript'
                    elif file.endswith('.js') or file.endswith('.jsx'):
                        language = 'javascript'
                    elif file.endswith('.html'):
                        language = 'html'
                    elif file.endswith('.css'):
                        language = 'css'
                    elif file.endswith('.json'):
                        language = 'json'
                    elif file.endswith('.md'):
                        language = 'markdown'
                    elif file.endswith('.ejs'):
                        language = 'ejs'
                    else:
                        language = ''  # No specific language

                    if language:
                        md_file.write(f"```{language}\n")
                    else:
                        md_file.write("```\n")
                    
                    with open(file_path, 'r', encoding='utf-8') as code_file:
                        code = code_file.read()
                        md_file.write(code)
                    
                    md_file.write("\n```\n\n")
    print(f"Markdown file '{output_file}' has been generated successfully.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate a Markdown file with source code from a directory.")
    parser.add_argument('directory', type=str, help='The target directory to search for source code files.')
    parser.add_argument('-o', '--output', type=str, default='source_code.md', help='The output Markdown file name.')
    parser.add_argument('-ed', '--exclude_dirs', type=str, nargs='*', default=[], help='List of directories to exclude.')
    parser.add_argument('-ef', '--exclude_files', type=str, nargs='*', default=[], help='List of files to exclude.')

    args = parser.parse_args()

    generate_markdown(
        directory=args.directory,
        output_file=args.output,
        exclude_dirs=args.exclude_dirs,
        exclude_files=args.exclude_files
    )
