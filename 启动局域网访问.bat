@echo off
title OMS Demo - 局域网访问服务器
cd /d "%~dp0"

rem 定位 node.exe（优先 PATH，找不到则用默认安装路径）
set "NODE_EXE=node"
where node >nul 2>nul
if errorlevel 1 (
    if exist "C:\Program Files\nodejs\node.exe" (
        set "NODE_EXE=C:\Program Files\nodejs\node.exe"
    ) else (
        echo [错误] 未检测到 Node.js，请先安装：https://nodejs.org/
        pause
        exit /b 1
    )
)

rem 尝试添加防火墙入站规则（需要管理员权限，失败则提示手动执行一次）
netsh advfirewall firewall add rule name="OMS Demo 8081" dir=in action=allow protocol=TCP localport=8081 >nul 2>nul
if errorlevel 1 (
    echo [提示] 未能自动添加防火墙规则。如同事无法访问，请以管理员身份运行一次：
    echo        netsh advfirewall firewall add rule name="OMS Demo 8081" dir=in action=allow protocol=TCP localport=8081
    echo.
)

echo 正在启动 OMS Demo 服务器...
echo 启动后，把下方 Network 地址发给同一局域网的同事即可访问（账号 oms / oms）
echo.

"%NODE_EXE%" server.js

echo.
echo 服务器已停止。
pause
