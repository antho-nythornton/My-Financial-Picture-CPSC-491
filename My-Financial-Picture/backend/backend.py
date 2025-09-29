from fastapi import FastAPI, HTTPException
import mysql.connector
from mysql.connector import Error
from passlib.context import CryptContext
import os
from pydantic import BaseModel
from starlette.middleware.cors import CORSMiddleware
from datetime import datetime 


app = FastAPI()


origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="CapstoneProject",
            database="MY_FINANCIAL_PICTURE"
        )
        return connection
    except Error as e:
        print("Database connection failed: ", e)
        return None

@app.get("/")
def root():
    return {"message": "FastAPI server is running!"}

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str

@app.post("/register")
def register(user: RegisterRequest):
    connection_ = get_db_connection()
    hashed_pw = pwd_context.hash(user.password)

    if not connection_:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    cursor = connection_.cursor()
    hashed_pw = pwd_context.hash(user.password)
    created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    try:
        cursor.execute(
            "INSERT INTO users (email, password_hash, created_at) VALUES ( %s, %s, %s)",
            (user.email, hashed_pw, created_at)
        )
        connection_.commit()
    except mysql.connector.Error as e:
        connection_.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cursor.close()
        connection_.close()

    return {"message": "User registered successfully"}

@app.get("/test")
def test_connection():
    connection_ = get_db_connection()
    if not connection_:
        return {"message": "Database connection failed"}
    
    cursor = connection_.cursor(dictionary=True)
    cursor.execute("SELECT * FROM your_table LIMIT 5")
    result = cursor.fetchall()
    cursor.close()
    connection_.close()
    return result


class LoginRequest(BaseModel):
    email: str
    password: str
    
@app.post("/login")
def login(request: LoginRequest):
    try:
        connection_ = get_db_connection()

        cursor = connection_.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE email=%s", (request.email,))
        user = cursor.fetchone()
        if not user:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        if not pwd_context.verify(request.password, user['PASSWORD_HASH']):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        return {"message": "Login successful!"}
    except Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        connection_.close()
