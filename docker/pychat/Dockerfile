FROM node:18-alpine as build


WORKDIR /app

COPY ./web .
# COPY ./web/package*.json ./
# COPY ./web/yarn.lock ./

RUN yarn
RUN yarn build

# WORKDIR /

# COPY ./web/package*.json ./
# COPY ./web/yarn.lock ./

# RUN yarn

# COPY ./web/src ./src
# COPY ./web/public ./public

# RUN yarn build


FROM python:3.11.8-bookworm
# WORKDIR /server
WORKDIR /opt/pychat

COPY ./requirements.txt ./

# COPY . /app
RUN pip install -U pip
RUN pip install -r requirements.txt
EXPOSE 3021 11180

COPY --from=build /app/build /opt/pychat/web/build

COPY ./server ./server

CMD ["python", "server/ocpp_cs/main.py"]

# CMD ["python", "-m", "server"]

# CMD ["python", "-m", "server"]
