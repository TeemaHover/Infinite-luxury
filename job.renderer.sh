JOB_NAME="ez-dapi"
NOMAD_IP="192.168.2.100"

VERSION="$(node -p "require('./package.json').version")"

cat >${JOB_NAME}.nomad <<EOF
job "${JOB_NAME}" {
  datacenters = ["dc1"]

  update {
    max_parallel      = 1
    health_check      = "checks"
    min_healthy_time  = "10s"
    healthy_deadline  = "5m"
    progress_deadline = "10m"
    auto_revert       = true
    stagger           = "10s"
  }

  group "ez-dapi-group" {
    count = 1
    network {
      port "http" {
        to = 3000
      }
    }

    restart {
      attempts = 3
      delay    = "15s"
      interval = "1m"
      mode     = "delay"
    }

    task "ez-dapi-server" {
      service {
        name = "${JOB_NAME}"
        port = "http"
        tags = ["urlprefix-dapi.lambda.mn/"]

        check {
          type     = "http"
          path     = "/health"
          interval = "2s"
          timeout  = "2s"
        }
      }
      env {
        PORT    = "\${NOMAD_PORT_http}"
        IP    = "\${NOMAD_IP_http}"
        PG_DSN="${PG_DSN}"
        ORA_DB_USERNAME="${ORA_DB_USERNAME}"
        ORA_DB_PASSWORD="${ORA_DB_PASSWORD}"
        ORA_DB_CONNECTSTRING="${ORA_DB_CONNECTSTRING}"
      }

      driver = "docker"

      config {
        image = "${DOCKERHUB_USERNAME}/ez-dash-api:${VERSION}"
        ports = ["http"]
        auth {
          username = "${DOCKERHUB_USERNAME}"
          password = "${DOCKERHUB_TOKEN}"
        }
        volumes = [
          "${JOB_DIR}:/ez-dapi"
        ]
      }

      resources {
        cpu    = 1000 # MHz
        memory = 1024 # MB
        memory_max = 1536 # MB
      }
    }
  }
}
EOF
