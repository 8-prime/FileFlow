FROM golang:latest as backend-build

WORKDIR /app

COPY backend/go.mod backend/go.sum ./

RUN go mod download

COPY backend/ .

RUN ls -la

RUN CGO_ENABLED=1 GOOS=linux go build -o /fileflow ./cmd/api/main.go

FROM node:alpine AS frontend-build

WORKDIR /app
COPY frontend/package.json .
RUN npm install
RUN npm i --save-dev @types/node
COPY frontend .
RUN npm run build

FROM nginx:bookworm AS build-release-stage

WORKDIR /

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY run.sh /run.sh

COPY --from=backend-build /fileflow /fileflow
COPY --from=frontend-build /app/dist /usr/share/nginx/html

ENV PORT=8080
ENV DB_FILE_PATH=/etc/fileflow/data.db
ENV FS_FILE_PATH=/etc/fileflow/uploads

RUN chmod +x /run.sh
ENTRYPOINT ["/run.sh"]