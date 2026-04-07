@echo off
echo ==============================================
echo  Building Project Exhibition Executable
echo ==============================================
echo.

echo [1/3] Building frontend assets...
call npm run build

echo.
echo [2/3] Activating virtual environment...
call .venv\Scripts\activate.bat

echo.
echo [3/3] Compiling standalone executable...
:: Compile as a single file, windowed (no console), and include the dist folder
call pyinstaller --noconfirm --onefile --windowed --add-data "dist;dist" main.py

echo.
echo ==============================================
echo  Build Complete!
echo  Executable is located in the "dist" folder.
echo ==============================================
pause
