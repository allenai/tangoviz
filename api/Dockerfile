FROM python:3.9

WORKDIR /api

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy over the source code
COPY app app/

ENTRYPOINT [ "uvicorn" ]
CMD [ "app.api:app", "--host", "0.0.0.0" ]
