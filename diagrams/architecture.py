"""
DevOpsFlow Microservices Architecture Diagram
Run: cd /tmp && python3 <repo>/diagrams/architecture.py
"""

import os
import sys

sys.path = [p for p in sys.path if "DevOpsFlow-CICD-K8s/diagrams" not in p]

from diagrams import Diagram, Cluster, Edge
from diagrams.aws.compute import EKS, ECR
from diagrams.aws.network import ALB
from diagrams.aws.security import IAMRole, IAMAWSSts
from diagrams.aws.general import User
from diagrams.k8s.compute import Deploy
from diagrams.k8s.network import Service
from diagrams.onprem.ci import GithubActions
from diagrams.onprem.vcs import Github
from diagrams.onprem.container import Docker
from diagrams.onprem.iac import Terraform
from diagrams.onprem.monitoring import Prometheus, Grafana
from diagrams.programming.framework import React
from diagrams.programming.language import Nodejs

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_PATH = os.path.join(REPO_ROOT, "diagrams", "architecture")

graph_attr = {
    "fontsize": "26",
    "fontname": "Helvetica",
    "bgcolor": "white",
    "pad": "0.6",
    "nodesep": "0.8",
    "ranksep": "1.0",
    "dpi": "200",
}

with Diagram(
    "DevOpsFlow — Microservices on AWS EKS with GitHub OIDC",
    filename=OUT_PATH,
    show=False,
    direction="LR",
    graph_attr=graph_attr,
    outformat=["png"],
):
    dev = User("Developer")
    repo = Github("GitHub Repo")

    with Cluster("GitHub Actions Pipeline", graph_attr={
        "bgcolor": "#E3F2FD", "style": "rounded",
        "pencolor": "#1565C0", "penwidth": "2.5",
    }):
        tests = GithubActions("Test & Lint\n(5 parallel jobs)")
        scan = Docker("Trivy Scan\n(matrix)")
        build = Docker("Build 5 Images")

    with Cluster("GitHub OIDC (Keyless)", graph_attr={
        "bgcolor": "#E8F5E9", "style": "rounded",
        "pencolor": "#2E7D32", "penwidth": "2.5",
    }):
        oidc = IAMAWSSts("OIDC Provider")
        sts = IAMRole("STS AssumeRole")

    tf = Terraform("Terraform\nIaC")

    with Cluster("AWS us-east-1", graph_attr={
        "bgcolor": "#FFF3E0", "style": "rounded",
        "pencolor": "#E65100", "penwidth": "2.5",
    }):
        ecr = ECR("ECR\n5 Repositories")

        with Cluster("VPC — 2 AZs", graph_attr={
            "bgcolor": "#FFF8E1", "style": "rounded",
            "pencolor": "#F57F17", "penwidth": "1.5",
        }):
            lb = ALB("Load Balancer")

            with Cluster("EKS Cluster", graph_attr={
                "bgcolor": "#FFFFFF", "style": "rounded",
                "pencolor": "#FF9800", "penwidth": "1.5",
            }):
                eks = EKS("Control Plane")

                with Cluster("Frontend (nginx API GW)", graph_attr={
                    "bgcolor": "#E3F2FD", "style": "rounded",
                    "pencolor": "#64B5F6", "penwidth": "1",
                }):
                    fe = React("React + Nginx\nAPI Gateway")

                with Cluster("Microservices", graph_attr={
                    "bgcolor": "#FFF3E0", "style": "rounded",
                    "pencolor": "#FFB74D", "penwidth": "1",
                }):
                    auth_svc = Nodejs("Auth\n:5001")
                    dash_svc = Nodejs("Dashboard\n:5002")
                    logs_svc = Nodejs("Logs\n:5003")
                    mon_svc = Nodejs("Monitoring\n:5004")

    with Cluster("Observability", graph_attr={
        "bgcolor": "#F3E5F5", "style": "rounded",
        "pencolor": "#6A1B9A", "penwidth": "1.5",
    }):
        prom = Prometheus("Prometheus")
        graf = Grafana("Grafana")

    users = User("Users")

    # Source → CI/CD
    dev >> Edge(label="git push", color="#455A64", style="bold") >> repo
    repo >> Edge(label="trigger", color="#1565C0", style="bold") >> tests
    tests >> Edge(color="#1565C0") >> scan >> Edge(color="#1565C0") >> build

    # OIDC
    build >> Edge(label="OIDC\ntoken", color="#2E7D32", style="bold") >> oidc
    oidc >> Edge(label="validate", color="#2E7D32") >> sts

    # Push + Deploy
    sts >> Edge(label="push 5\nimages", color="#E65100", style="bold") >> ecr
    sts >> Edge(label="kubectl\napply", color="#E65100", style="bold") >> eks

    ecr >> Edge(label="pull", color="#BF360C", style="dashed") >> eks

    # Terraform
    tf >> Edge(color="#7B42BC", style="dashed") >> ecr
    tf >> Edge(color="#7B42BC", style="dashed") >> eks

    # User traffic → frontend → microservices
    users >> Edge(label="HTTPS", color="#6A1B9A", style="bold") >> lb
    lb >> fe

    fe >> Edge(label="/api/auth", color="#E65100") >> auth_svc
    fe >> Edge(label="/api/dashboard", color="#E65100") >> dash_svc
    fe >> Edge(label="/api/logs", color="#E65100") >> logs_svc
    fe >> Edge(label="/api/monitoring", color="#E65100") >> mon_svc

    # Observability
    auth_svc >> Edge(color="#9C27B0", style="dashed") >> prom
    mon_svc >> Edge(color="#9C27B0", style="dashed") >> prom
    prom >> graf
