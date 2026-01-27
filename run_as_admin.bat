@echo off
powershell -Command "Start-Process powershell -ArgumentList '-ExecutionPolicy Bypass -File \"C:\Users\13726\Desktop\SaaS-POS-System-main\fix_and_push.ps1\"' -Verb RunAs"
