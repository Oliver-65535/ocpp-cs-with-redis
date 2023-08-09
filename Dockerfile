FROM python:3.10.12-bookworm
WORKDIR /app
COPY . /app
RUN pip install -U pip
RUN pip install -r requirements.txt
EXPOSE 11180
CMD ["python", "main.py"]