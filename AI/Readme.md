Install the dependencies:
pip install -r requirements.txt

npm install


Run this on three different terminals:
uvicorn main:app --reload

node client.js
node response.js

celery -A celery_config.celery_app worker --loglevel=info