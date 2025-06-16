@echo off
echo Checking if Ollama is running...

REM Check if Ollama is already running by trying to connect to its API
curl -s http://localhost:11434/api/tags > nul
if %errorlevel% equ 0 (
    echo Ollama is already running!
) else (
    echo Starting Ollama server...
    start /B ollama serve
    
    REM Wait for Ollama to start
    echo Waiting for Ollama to start...
    :WAIT_LOOP
    timeout /t 2 /nobreak > nul
    curl -s http://localhost:11434/api/tags > nul
    if %errorlevel% neq 0 (
        echo Still waiting for Ollama to start...
        goto WAIT_LOOP
    )
    echo Ollama server is now running!
)

echo Starting Flask API server...
python app.py
