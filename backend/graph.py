from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated
import operator
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from dotenv import load_dotenv

load_dotenv()

# Configuração do OpenAI (GPT-4o)
llm = ChatOpenAI(
    model="gpt-4o",
    temperature=0.7,
)

class State(TypedDict):
    messages: Annotated[list, operator.add]

def chatbot(state: State):
    system_prompt = SystemMessage(content="Você é o Valdomiro da Gen-UI. Responda de forma concisa e objetiva.")
    messages = [system_prompt] + state["messages"]
    response = llm.invoke(messages)
    return {"messages": [response]}

graph_builder = StateGraph(State)
graph_builder.add_node("chatbot", chatbot)
graph_builder.set_entry_point("chatbot")
graph_builder.add_edge("chatbot", END)

graph = graph_builder.compile()
