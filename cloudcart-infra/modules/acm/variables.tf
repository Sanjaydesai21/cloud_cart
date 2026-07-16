variable "domain_name" {
  description = "Root domain already hosted in Route 53 (sanjaydesai.xyz)"
  type        = string
}

variable "app_subdomain" {
  description = "Full subdomain the certificate is issued for (cloudcart.sanjaydesai.xyz)"
  type        = string
}
