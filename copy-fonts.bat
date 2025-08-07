@echo off
echo Creating public/assets/fonts directory...
if not exist "public\assets\fonts" mkdir "public\assets\fonts"

echo Copying Rabar font to public directory...
copy "assets\fonts\Rabar_021.ttf" "public\assets\fonts\"

echo Font files copied successfully!
pause
