# Distributed Task Management System

A production-style distributed background job processing system built using:

- Node.js
- Express
- Redis
- BullMQ
- Worker Threads
- Elasticsearch

This project simulates real-world async task infrastructure including retry logic, idempotency handling, dead-letter queues, and horizontal worker scaling.

---

# Table of Contents

- Overview
- Architecture
- Features (Phase 1–3)
- Tech Stack
- Project Structure
- API Specification
- Retry & Backoff Strategy
- Idempotency Design
- Worker Design
- Scalability Considerations
- Failure Handling
- Running the Project
- Future Enhancements
- Resume Value

---

# Overview

This system allows clients to submit tasks that are processed asynchronously using Redis-backed queues. It ensures reliability using retries and dead-letter queues while maintaining safety via idempotency guarantees.

It is designed to mimic real production backend infrastructure.

---

# Architecture

Client  
→ API Service (Express)  
→ Redis (BullMQ Queue)  
→ Worker Service  
→ Worker Threads (CPU jobs)  
→ Elasticsearch (Task indexing & search)

Multiple API and Worker instances can run behind a load balancer.

---

# Features (Phase 1–3)

## Phase 1 – Core Queue System

- Task creation API
- Redis-backed queue using BullMQ
- Worker service for job processing
- Task status tracking
- Priority support
- Delayed job scheduling
- Concurrency control

---

## Phase 2 – Reliability & Retry

- Automatic retry mechanism
- Configurable max attempts
- Exponential backoff strategy
- Dead-letter queue for permanent failures
- Graceful worker shutdown
- Structured logging

---

## Phase 3 – Idempotency & Production Readiness

- Idempotency-Key header support
- Duplicate job prevention using Redis
- Multi-instance safe design
- Horizontal scaling
- Elasticsearch indexing
- Search API for tasks

---

# Tech Stack

- Node.js
- Express
- TypeScript
- Redis
- BullMQ
- Elasticsearch
- Worker Threads
- Docker (optional)
- Winston or Pino (logging)

---

# Project Structure

```
distributed-task-system/
│
├── src/
│   ├── api/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── middlewares/
│   │
│   ├── queue/
│   │   ├── queue.ts
│   │   ├── producer.ts
│   │   └── deadletter.ts
│   │
│   ├── worker/
│   │   ├── worker.ts
│   │   ├── processor.ts
│   │   └── workerThread.ts
│   │
│   ├── services/
│   │   ├── task.service.ts
│   │   └── search.service.ts
│   │
│   ├── config/
│   │   ├── redis.ts
│   │   └── elastic.ts
│   │
│   ├── utils/
│   │   └── logger.ts
│   │
│   └── app.ts
│
├── docker-compose.yml
├── package.json
└── README.md
```

---

# API Specification

## 1. Create Task

POST `/tasks`

Headers:

```
Idempotency-Key: unique-string
```

Body:

```json
{
  "type": "image-processing",
  "payload": {
    "imageUrl": "https://example.com/image.jpg"
  },
  "priority": 2,
  "scheduledAt": "2026-02-25T10:00:00Z"
}
```

Response:

```json
{
  "taskId": "uuid",
  "status": "queued"
}
```

---

## 2. Get Task Status

GET `/tasks/:id`

Response:

```json
{
  "taskId": "uuid",
  "status": "active",
  "attemptsMade": 1,
  "result": null,
  "error": null
}
```

---

## 3. Search Tasks (Phase 3)

GET `/tasks/search?status=completed&type=image-processing`

Backed by Elasticsearch.

---

# Retry & Backoff Strategy

Each job is configured with:

- attempts: 5
- backoff: exponential
- initial delay: 5000ms

If all attempts fail:

- Job moves to Dead Letter Queue
- Failure reason is stored
- Logged for observability

---

# Idempotency Design

To prevent duplicate job execution:

- Client sends `Idempotency-Key`
- Redis stores mapping:

```
idempotency:{key} → taskId
```

If key already exists:

- Return existing taskId
- Do NOT enqueue a new job

This ensures safe client retries.

---

# Worker Design

Worker process responsibilities:

- Consume jobs from BullMQ
- Process jobs based on type
- Offload CPU-heavy work to Worker Threads
- Update job status
- Index completed tasks in Elasticsearch
- Handle graceful shutdown

---

# Scalability Considerations

- Stateless API layer
- Shared Redis instance
- Multiple worker instances
- Horizontal scaling supported
- Concurrency configuration via BullMQ

---

# Failure Handling

Scenarios covered:

- Worker crash during processing
- Redis restart
- Duplicate task submission
- Max retry exhaustion
- Delayed job execution
- Partial system failure

---

# Running the Project

### 1. Start dependencies

```
docker-compose up -d
```

Services:

- Redis
- Elasticsearch

---

### 2. Install dependencies

```
npm install
```

---

### 3. Start API server

```
npm run dev
```

---

### 4. Start worker

```
npm run worker
```

---

# Future Enhancements

- Prometheus metrics
- Grafana dashboard
- Rate limiting per user
- Circuit breaker
- Kafka integration
- Multi-queue sharding
- Distributed tracing

---

# Resume Value

This project demonstrates:

- Distributed systems understanding
- Asynchronous processing
- Retry and failure handling
- Idempotency guarantees
- Dead-letter queue design
- Worker thread usage
- Horizontal scalability
- Search integration

It reflects real backend infrastructure design used in production systems.
