FROM python:3.11.8-bookworm
WORKDIR /app
COPY . /app
RUN pip install -U pip
RUN pip install -r requirements.txt
EXPOSE 3021 11180
CMD ["python", "main.py"]