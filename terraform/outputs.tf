output "storage_account_name" {
  value = azurerm_storage_account.storage_account.name
}

output "blob_container_url" {
  value = azurerm_storage_blob.blob_file.url
}
