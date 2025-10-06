import pytest
from fastapi.testclient import TestClient
from backend import app, get_db_connection
import mysql.connector
from passlib.context import CryptContext

client = TestClient(app)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@pytest.fixture(scope="module")
def test_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users")
    cursor.execute("DELETE FROM budgets")
    cursor.execute("DELETE FROM transactions")
    cursor.execute("DELETE FROM institutions")
    cursor.execute("DELETE FROM goals")
    conn.commit()
    yield conn  
    cursor.execute("DELETE FROM users")
    cursor.execute("DELETE FROM budgets")
    cursor.execute("DELETE FROM transactions")
    cursor.execute("DELETE FROM institutions")
    cursor.execute("DELETE FROM goals")
    conn.commit()
    cursor.close()
    conn.close()

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "FastAPI server is running!"}

def test_register_user_success(test_db):
    user_data = {
        "username": "testuser",
        "email": "testuser@example.com",
        "password": "testpassword"
    }
    response = client.post("/register", json=user_data)
    assert response.status_code == 200
    assert response.json()["message"] == "User registered successfully"

    cursor = test_db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE email=%s", (user_data["email"],))
    user = cursor.fetchone()
    assert user is not None
    assert user["email"] == user_data["email"]
    cursor.close()

def test_register_duplicate_email(test_db):
    user_data = {
        "username": "testuser",
        "email": "testuser@example.com",
        "password": "testpassword"
    }
    response = client.post("/register", json=user_data)
    assert response.status_code == 400
    assert "duplicate" in response.json()["detail"].lower()

def test_invalid_route():
    response = client.get("/invalid-route")
    assert response.status_code == 404
