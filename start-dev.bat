@echo off
echo Starting QLBH Development Environment...
echo.

echo Installing dependencies...
call npm install

echo.
echo Starting JSON Server and Vite Dev Server...
call npm run dev

pause

