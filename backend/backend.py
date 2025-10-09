from fastapi import FastAPI, HTTPException
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, constr
from dotenv import load_dotenv
from passlib.context import CryptContext
import mysql.connector
from mysql.connector import errors
from datetime import datetime
import os

load_dotenv()

DB_CONFIG = dict(
    host=os.getenv("DB_HOST","mfp-db-dev.cj0mg2aea2ln.us-east-2.rds.amazonaws.com"),
    port=int(os.getenv("DB_PORT", "3306")),
    user=os.getenv("DB_USER", "jay"),                
    password=os.getenv("DB_PASSWORD", "jay"),
    database=os.getenv("DB_NAME", "MY_FINANCIAL_PICTURE"),
)

def ts() -> str:
    return datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

app = FastAPI()

allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
extra_origins = (os.getenv("ALLOWED_ORIGINS") or "").strip()
if extra_origins:
    allowed_origins += [o.strip() for o in extra_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db_conn():
    try:
        conn = mysql.connector.connect(
            **DB_CONFIG,
            connection_timeout=5,  # ⏱️ 5 seconds max wait
        )
        print("[DEBUG] DB_HOST:", os.getenv("DB_HOST"))
        print("[DEBUG] DB_USER:", os.getenv("DB_USER"))
        print("[DEBUG] DB_PASSWORD:", os.getenv("DB_PASSWORD"))
        return conn
    except mysql.connector.Error as e:
        print(f"[DB ERROR] Connection failed: {e}")
        return None

class RegisterRequest(BaseModel):
    email: EmailStr
    password: constr(min_length=8)

class RegisterResponse(BaseModel):
    message: str
    user_id: int | None = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

@app.get("/healthz")
def healthz():
    try:
        conn = get_db_conn()
        cur = conn.cursor()
        cur.execute("SELECT 1")
        cur.fetchone()
        return {"status": "ok"}
    except Exception:
        raise HTTPException(status_code=500, detail="DB not reachable")
    finally:
        try:
            cur.close(); conn.close()
        except Exception:
            pass

@app.post("/register", response_model=RegisterResponse)
def register(user: RegisterRequest):
    try:
        conn = get_db_conn()
        cur = conn.cursor(dictionary=True)

        # Check if email exists
        cur.execute("SELECT ID FROM USERS WHERE EMAIL=%s", (user.email,))
        if cur.fetchone():
            raise HTTPException(status_code=409, detail="Email already registered")

        hashed_pw = pwd_context.hash(user.password)

        cur.execute(
            """
            INSERT INTO USERS (EMAIL, PASSWORD_HASH, CREATED_AT, LAST_LOGIN)
            VALUES (%s, %s, %s, %s)
            """,
            (user.email, hashed_pw, ts(), None),
        )
        conn.commit()
        return RegisterResponse(message="User registered successfully", user_id=cur.lastrowid)

    except errors.Error as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        try:
            cur.close(); conn.close()
        except Exception:
            pass

@app.post("/login")
def login(payload: LoginRequest):
    try:
        conn = get_db_conn()
        cur = conn.cursor(dictionary=True)

        cur.execute("SELECT ID, PASSWORD_HASH FROM USERS WHERE EMAIL=%s", (payload.email,))
        row = cur.fetchone()
        if not row or not pwd_context.verify(payload.password, row["PASSWORD_HASH"]):
            raise HTTPException(status_code=401, detail="Invalid email or password")

        cur2 = conn.cursor()
        cur2.execute("UPDATE USERS SET LAST_LOGIN=%s WHERE ID=%s", (ts(), row["ID"]))
        conn.commit()
        cur2.close()

        return {"message": "Login successful", "user_id": row["ID"]}

    except errors.Error:
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        try:
            cur.close(); conn.close()
        except Exception:
            pass


@app.get("/")
def root():
    return {"message": "FastAPI server is running!"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend:app", host="0.0.0.0", port=8000, reload=True)