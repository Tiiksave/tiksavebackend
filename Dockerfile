FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

EXPOSE 10000

CMD ["gunicorn","app:app","--bind","0.0.0.0:10000","--workers","1","--threads","4","--timeout","300"]
