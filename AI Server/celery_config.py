from celery import Celery
from kombu import Queue

celery_app = Celery(
    "worker",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/0"
)

celery_app.conf.update(
    task_acks_late=True,
    worker_prefetch_multiplier=1,
    task_queue_max_priority=10,
    task_routes={
        "worker.process_task": {"queue": "video_tasks"}
    },
    task_default_queue='video_tasks',
    task_default_exchange='video_tasks',
    task_default_exchange_type='direct',
    task_default_routing_key='video_tasks',
)

celery_app.conf.task_queues = (
    Queue('video_tasks', routing_key='video_tasks'),
)

import worker
