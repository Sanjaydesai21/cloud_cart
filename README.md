📚 EduBlitz B2B Medical ERP

A production-ready MERN Stack Medical ERP application deployed using multiple DevOps deployment strategies on AWS.

📌 Project Overview

EduBlitz B2B Medical ERP is a full-stack MERN application developed for managing medical inventory, orders, distributors, customers, and ERP operations.

The main objective of this repository is not only to build a MERN application but also to demonstrate different DevOps deployment strategies used in real-world production environments.

🚀 Deployment Journey

This project has been deployed using four different approaches, allowing me to understand the complete software deployment lifecycle.

1️⃣ Traditional AWS EC2 Deployment
Launch EC2 Instance
Configure Security Groups
Install Node.js
Install PM2
Configure Nginx Reverse Proxy
Deploy React Frontend
Deploy Node Backend
Configure Environment Variables
Enable HTTPS
Technologies
AWS EC2
Ubuntu
Nginx
PM2
Node.js
2️⃣ Docker Deployment

Containerized the complete application using Docker.

Implemented
Multi-stage Dockerfile
Backend Docker Image
Frontend Docker Image
Docker Network
Docker Volumes
Environment Variables
Docker Compose
Technologies
Docker
Docker Compose
3️⃣ Kubernetes Deployment

Migrated Docker containers to Kubernetes for orchestration.

Implemented
Deployments
ReplicaSets
Services
ConfigMaps
Secrets
Rolling Updates
Self-Healing
Scaling
Kubernetes Objects
Deployment
Service
ConfigMap
Secret
Pods
ReplicaSet
4️⃣ CI/CD Pipeline using Jenkins

Built a complete Jenkins Pipeline for automated deployment.

Pipeline stages include:

Git Clone

↓

Install Dependencies

↓

Run Tests

↓

Build Frontend

↓

Build Docker Images

↓

Push Images

↓

Deploy to Kubernetes

↓

Verify Deployment
Jenkins Features
Declarative Pipeline
Automated Build
Automated Deployment
Kubernetes Deployment
AWS Integration
🏗 Architecture
Developer
│
▼
GitHub Repository
│
▼
Jenkins Pipeline
│
┌─────────────────┼─────────────────┐
▼ ▼ ▼
Build Frontend Build Backend Docker Build
│ │ │
└──────────────► Docker Images ◄────┘
│
▼
Kubernetes Cluster
│
┌──────────┴──────────┐
▼ ▼
React Frontend Node Backend
│
▼
MongoDB Database
🛠 Tech Stack
Frontend
React.js
Redux
Bootstrap
Axios
Backend
Node.js
Express.js
Database
MongoDB
DevOps
AWS EC2
Docker
Kubernetes
Jenkins
Git
GitHub
Linux
Nginx
PM2
📂 Project Structure
frontend/
backend/
k8s/
docker/
jenkins/
⚙ Installation
Clone Repository
git clone https://github.com/Sanjaydesai21/edublitz-b2b-medical-erp.git

cd edublitz-b2b-medical-erp
Backend
cd backend

npm install

npm start
Frontend
cd frontend

npm install

npm run dev
🐳 Docker Deployment
docker-compose up --build
☸ Kubernetes Deployment
kubectl apply -f k8s/
⚙ Jenkins Pipeline

Pipeline automatically performs:

Source Code Checkout
Dependency Installation
Build Application
Docker Image Creation
Kubernetes Deployment
Rollout Verification
📊 Features
User Authentication
Medical Inventory Management
Order Management
Dashboard
Customer Management
Distributor Management
Secure APIs
Responsive UI
💡 DevOps Skills Demonstrated

✔ Git & GitHub

✔ Linux Administration

✔ AWS EC2

✔ MongoDB

✔ Docker

✔ Docker Compose

✔ Kubernetes

✔ Jenkins CI/CD

✔ Nginx Reverse Proxy

✔ PM2 Process Management

✔ Environment Variable Management

✔ Production Deployment

✔ Rolling Updates

✔ Kubernetes Services

✔ ConfigMaps & Secrets
