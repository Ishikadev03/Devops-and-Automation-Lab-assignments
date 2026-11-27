# Local-cluster IaC wrapper. Terraform orchestrates declarative Kubernetes manifests
# through kubectl. Run after Minikube is started and kubectl context is configured.
resource "null_resource" "devopsflow_namespace" {
  triggers = {
    manifest_hash = filesha256("${path.module}/../kubernetes/namespace.yaml")
  }
  provisioner "local-exec" {
    command = "kubectl apply -f ${path.module}/../kubernetes/namespace.yaml"
  }
}
output "namespace" { value = "devopsflow" }