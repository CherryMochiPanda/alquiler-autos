# Script de limpieza: eliminar archivos legacy y firebase package

Write-Host "Iniciando limpieza del proyecto..."

# Eliminar firebase.js
if (Test-Path "src\firebase.js") {
    Remove-Item "src\firebase.js" -Force
    Write-Host "✓ Eliminado: src\firebase.js"
} else {
    Write-Host "✗ No encontrado: src\firebase.js"
}

# Eliminar toastStore.js
if (Test-Path "src\utils\toastStore.js") {
    Remove-Item "src\utils\toastStore.js" -Force
    Write-Host "✓ Eliminado: src\utils\toastStore.js"
} else {
    Write-Host "✗ No encontrado: src\utils\toastStore.js"
}

# Desinstalar firebase package
Write-Host "Desintalando firebase del package.json..."
npm uninstall firebase

Write-Host "✓ Limpieza completada"
