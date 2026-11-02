@echo off
cd /d "%~dp0"
where node >nul 2>&1
if errorlevel 1 (
 echo Instale o Node.js LTS em https://nodejs.org e abra este arquivo novamente.
 pause
 exit /b 1
)
if not exist node_modules (
 echo Instalando dependencias. Aguarde...
 call npm ci --no-audit --no-fund
 if errorlevel 1 (
  echo Falha na instalacao. Verifique sua conexao com a internet.
  pause
  exit /b 1
 )
)
echo Para encerrar o jogo, feche esta janela.
call npm run dev -- --host 127.0.0.1 --open
pause
