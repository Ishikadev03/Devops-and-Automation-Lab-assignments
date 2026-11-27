# DevOpsFlow — DevOps Automation Capstone

## Project Overview

DevOpsFlow is a task-management application supported by a DevOps automation pipeline. The project demonstrates containerization, CI/CD, Kubernetes deployment, monitoring, centralized logging, security scanning, infrastructure automation, and backup and restore.

## Technology Stack

- **Application:** Node.js
- **Containerization:** Docker, Docker Compose
- **CI/CD:** GitHub Actions
- **Container Registry:** GitHub Container Registry (GHCR)
- **Orchestration:** Kubernetes with Minikube
- **Monitoring:** Prometheus, Grafana
- **Logging:** Grafana Alloy, Loki
- **Security Scanning:** Trivy
- **Infrastructure Automation:** Terraform
- **Configuration Management:** Ansible
- **Database:** PostgreSQL

## Implemented Features

### 1. Application and Containerization
- Task-management application with task creation, updating, and deletion.
- PostgreSQL database integration.
- Dockerfile for building the application image.
- Docker Compose configuration for running the application and supporting services.

### 2. CI/CD Pipeline
- GitHub Actions workflow for application testing and security scanning.
- Automated Docker image build and publishing to GHCR.
- Deployment workflow targeting the local Minikube cluster.
- Kubernetes rollout verification after deployment.

### 3. Kubernetes Deployment
- Dedicated `devopsflow` namespace.
- PostgreSQL deployment and persistent volume claim.
- Stable application deployment with two replicas.
- Canary application deployment with one replica.
- Kubernetes Service configured using NodePort.
- Selector-based canary promotion and rollback scripts.

**Note:** The canary implementation switches the Service selector between stable and canary deployments. It does not implement weighted traffic splitting.

### 4. Monitoring and Logging
- Prometheus for application metrics.
- Grafana dashboard with application availability and memory usage panels.
- Grafana Alloy for collecting Docker container logs.
- Loki for centralized log storage and querying.

### 5. Security Scanning and Testing
- Automated application tests using Node.js test runner.
- Trivy filesystem vulnerability scanning.
- Trivy container/application dependency scanning through the CI workflow.

### 6. Infrastructure and Configuration Automation
- Terraform wrapper to automate application of the Kubernetes namespace manifest through `kubectl`.
- Ansible playbook to check cluster connectivity and apply selected Kubernetes manifests.

**Scope note:** Terraform currently automates the local Kubernetes namespace rather than provisioning cloud infrastructure. The Ansible playbook applies the namespace, application configuration, and PostgreSQL manifests.

### 7. Backup and Restore
- PostgreSQL backup script.
- SQL backup generation.
- Restore validation using a separate temporary database.
- Verification of restored task records.

## Verification Results

The following components were tested during project implementation:

| Component | Verification |
|---|---|
| Application tests | 3 tests passed |
| Trivy filesystem scan | No HIGH/CRITICAL findings reported |
| GitHub Actions CI | Successful |
| Docker image build and GHCR push | Successful |
| GitHub Actions deployment | Successful |
| Kubernetes pods | Running |
| Application health endpoint | Responding |
| Prometheus | Application target up |
| Grafana | Availability and memory panels |
| Loki | Container logs queried successfully |
| Terraform | Validate and apply successful |
| Ansible | Playbook completed without failures |
| PostgreSQL backup | Backup generated |
| Restore validation | Successful in temporary database |

## Repository Structure

```text
Devops-and-Automation-Lab-Assignments/
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── build-deploy.yml
│
└── Capstone Project/
    ├── application/
    ├── kubernetes/
    ├── monitoring/
    ├── terraform/
    ├── ansible/
    ├── scripts/
    ├── backups/
    ├── docs/
    └── Readme.md
```

## Running the Project

### Local Application
1. Install Docker Desktop and enable Docker support.
2. Navigate to the project directory.
3. Start the application using the provided Docker Compose configuration.
4. Access the application through its configured local port.

### Kubernetes Deployment
1. Start Docker Desktop and Minikube.
2. Ensure the Kubernetes context is configured.
3. Run the GitHub Actions deployment workflow or apply the Kubernetes manifests manually.
4. Verify the deployment:

```bash
kubectl get pods -n devopsflow
kubectl get services -n devopsflow
```

5. Test the application health endpoint:

```text
http://localhost:8080/health
```

The local port-forward must be running for this URL to work.

## Learning Outcomes

This project demonstrates practical experience with:

- Building and containerizing an application.
- Automating testing and deployment using GitHub Actions.
- Publishing container images to a registry.
- Deploying and managing Kubernetes workloads.
- Implementing basic canary deployment and rollback.
- Monitoring application availability and memory usage.
- Centralized container log collection.
- Vulnerability scanning and automated testing.
- Infrastructure and configuration automation.
- Database backup and restore validation.

## Project Status

The core DevOpsFlow implementation has been deployed and verified on a local Minikube cluster. The project is intended as a learning-focused DevOps automation capstone.
