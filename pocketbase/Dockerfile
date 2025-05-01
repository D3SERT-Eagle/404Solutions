FROM alpine

WORKDIR /pb
COPY pocketbase /pb/pocketbase
RUN chmod +x /pb/pocketbase

CMD ["./pocketbase", "serve", "--http=0.0.0.0:8090"]
