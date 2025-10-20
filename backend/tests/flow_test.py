# backend/tests/flow_test.py
import sys
from pathlib import Path
import pytest
from fastapi.testclient import TestClient

# --- Put repo root & backend/ on sys.path ---
ROOT = Path(__file__).resolve().parents[2]   # repo root
BACKEND_DIR = ROOT / "backend"
sys.path.insert(0, str(BACKEND_DIR))
sys.path.insert(0, str(ROOT))

# --- Try normal package import first; fallback to path import ---
try:
    from backend.backend import app, get_db_conn  # type: ignore
except Exception:
    import importlib.util as iu
    spec = iu.spec_from_file_location("backend_app", BACKEND_DIR / "backend.py")
    backend_mod = iu.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(backend_mod)
    app = backend_mod.app
    get_db_conn = backend_mod.get_db_conn

client = TestClient(app)

@pytest.fixture(scope="module")
def test_db():
    conn = get_db_conn()
    if not conn:
        pytest.skip("Database not available")
    cur = conn.cursor()
    try:
        cur.execute("DELETE FROM USERS")
        conn.commit()
    except Exception:
        pass
    yield conn
    try:
        cur.execute("DELETE FROM USERS")
        conn.commit()
    except Exception:
        pass
    finally:
        cur.close()
        conn.close()

def test_root():
    r = client.get("/")
    assert r.status_code == 200
    assert r.json() == {"message": "FastAPI server is running!"}

def test_register_user_success(test_db):
    user = {"email": "flowtestuser@example.com", "password": "testpass123", "first_name": "Flow", "last_name": "Test"}
    r = client.post("/register", json=user)
    assert r.status_code in (200, 201), f"Unexpected status: {r.text}"

    cur = test_db.cursor(dictionary=True)
    cur.execute("SELECT * FROM USERS WHERE EMAIL=%s", (user["email"],))
    row = cur.fetchone()
    cur.close()
    assert row is not None

def test_register_duplicate_email(test_db):
    user = {"email": "dupe@example.com", "password": "testpass123", "first_name": "Dupe", "last_name": "Case"}
    r1 = client.post("/register", json=user)
    assert r1.status_code in (200, 201)

    r2 = client.post("/register", json=user)
    assert r2.status_code in (400, 409)

def test_invalid_route():
    r = client.get("/not-here")
    assert r.status_code == 404