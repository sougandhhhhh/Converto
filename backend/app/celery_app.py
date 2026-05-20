import os
from celery import Celery
from app.config import REDIS_URL

# Celery configuration
celery_app = Celery(
    "converto",
    broker=REDIS_URL,
    backend=REDIS_URL,
)

# Basic Celery configuration options
celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="UTC",
    enable_utc=True,
    task_acks_late=True,
    worker_prefetch_multiplier=1,
    task_time_limit=300,  # safeguard against runaway tasks
)

# Autodiscover tasks in the app package
celery_app.autodiscover_tasks(["app.tasks"])
