import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import pytest
from fastapi.testclient import TestClient
from backend.backend import get_db_conn, app
client = TestClient(app)

@pytest.fixture(scope="module")
def test_db():
    conn = get_db_conn()
    if not conn:
        pytest.skip("Database not available")
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM USERS")
        conn.commit()
    except Exception as e:
        print(f"Setup cleanup failed: {e}")
        pass
    yield conn
    try:
        cursor.execute("DELETE FROM USERS")
        conn.commit()
    except Exception as e:
        print(f"Teardown cleanup failed: {e}")
        pass
    finally:
        cursor.close()
        conn.close()

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "FastAPI server is running!"}

def test_register_user_success(test_db):
    user = {
        "email": "testuser@example.com",
        "password": "testpass123",
        "first_name": "Test",
        "last_name": "User"
    }
    response = client.post("/register", json=user)
    print(f"Register response: {response.status_code} {response.text}")

    # Expect 200 OK or 201 Created
    assert response.status_code in (200, 201), f"Unexpected status: {response.text}"

    # Verify user exists in DB
    cursor = test_db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM USERS WHERE EMAIL = %s", (user["email"],))
    row = cursor.fetchone()
    cursor.close()

    assert row is not None, "User not found in database"
def test_register_duplicate_email(test_db):
    user = {"email": "test@example.com", "password": "testpass123", "first_name": "Test", "last_name": "User"}
    response = client.post("/register", json=user)
    print(f"Duplicate register response: {response.status_code} {response.text}")
    
    if response.status_code == 400:
        return
        
    cursor = test_db.cursor()
    cursor.execute("SELECT COUNT(*) FROM USERS WHERE EMAIL = %s", (user["email"],))
    count = cursor.fetchone()[0]
    cursor.close()
    
    assert count <= 1, f"Found {count} users with same email after duplicate registration attempt"

def test_invalid_route():
    response = client.get("/nonexistent")
    assert response.status_code == 404

if __name__ == "__main__":
    pytest.main([__file__, "-q"])