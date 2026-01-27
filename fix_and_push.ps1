# 以管理员身份运行此脚本
# 右键点击此文件 -> 使用 PowerShell 运行（或以管理员身份运行）

# 添加 hosts 条目
$hostsPath = "C:\Windows\System32\drivers\etc\hosts"
$giteeIP = "180.76.199.13"
$entry = "$giteeIP gitee.com"

# 检查是否已存在
$content = Get-Content $hostsPath -Raw
if ($content -notmatch "gitee\.com") {
    Add-Content -Path $hostsPath -Value $entry
    Write-Host "已添加 hosts 条目: $entry" -ForegroundColor Green
} else {
    Write-Host "hosts 条目已存在" -ForegroundColor Yellow
}

# 推送到 Gitee
Set-Location "C:\Users\13726\Desktop\SaaS-POS-System-main\SaaS-POS-System-main"
git push gitee main

Write-Host ""
Write-Host "按任意键退出..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
