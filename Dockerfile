FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

ARG PYTHON_PACKAGE_INDEX=https://pypi.tuna.tsinghua.edu.cn/simple

COPY backend/requirements.lock /app/backend/requirements.lock
RUN --mount=type=cache,target=/root/.cache/pip \
    python -m pip install --require-hashes --retries 10 --timeout 120 \
    --index-url "${PYTHON_PACKAGE_INDEX}" \
    -r /app/backend/requirements.lock

COPY backend /app/backend
COPY README.md /app/README.md
COPY docs /app/docs
COPY frontend/README.md /app/frontend/README.md
COPY bci_4class/README.md /app/bci_4class/README.md
COPY bci_4class/models /app/bci_4class/models
COPY bci_4class/data /app/bci_4class/data

RUN addgroup --system app && adduser --system --ingroup app app \
    && chown -R app:app /app
USER app

WORKDIR /app/backend
EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD python -c "import json,urllib.request; d=json.load(urllib.request.urlopen('http://127.0.0.1:8000/api/v1/health', timeout=3)); raise SystemExit(0 if d.get('model_ready') else 1)"

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
