from celery import Celery
from kombu import Queue

# Initialize Celery app
celery_app = Celery(
    "worker",
    broker="redis://localhost:6379/0",  # Redis as the message broker
    backend="redis://localhost:6379/0"  # Redis as the result backend
)

# Celery configurations
celery_app.conf.update(
    task_acks_late=True,  # Acknowledge task only after completion
    worker_prefetch_multiplier=1,  # Workers take one task at a time
    task_queue_max_priority=10,  # Support priority queueing (optional)
    task_routes={  # Explicitly define task routes for routing tasks to specific queues
        "worker.process_task": {"queue": "video_tasks"}
    },
    task_default_queue='video_tasks',  # Set the default queue for tasks
    task_default_exchange='video_tasks',  # Default exchange for task routing
    task_default_exchange_type='direct',  # Default exchange type for tasks
    task_default_routing_key='video_tasks',  # Default routing key
)

# Define the task queues
celery_app.conf.task_queues = (
    Queue('video_tasks', routing_key='video_tasks'),
)

# Import worker to ensure Celery registers the task
import worker  # Ensure worker.py is imported

