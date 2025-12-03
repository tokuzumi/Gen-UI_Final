from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from graph import graph

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Input(BaseModel):
    message: str

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/chat")
def chat(input: Input):
    initial_state = {"messages": [input.message]}
    result = graph.invoke(initial_state)
    return result
