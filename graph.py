from __future__ import annotations

from typing import Any, Dict, List
from operator import add

from langgraph.graph import StateGraph
from langgraph.runtime import Runtime
from typing_extensions import TypedDict
from langchain_openai import ChatOpenAI
from langchain_core.messages import BaseMessage, HumanMessage, SystemMessage

# 1. Definindo o Estado Conversacional
# O estado agora é um TypedDict que acumula mensagens.
class State(TypedDict):
    messages: List[BaseMessage]

# 2. Definindo o Contexto (Opcional, mas mantido)
class Context(TypedDict):
    # Parâmetro configurável para o system prompt
    system_prompt: str

llm = ChatOpenAI(model="gpt-4o-mini")

async def call_model(state: State, runtime: Runtime[Context]) -> Dict[str, Any]:
    """
    Invoca o LLM com o histórico completo de mensagens e retorna a nova resposta.
    """
    
    # Define um prompt padrão caso nenhum seja fornecido
    system_prompt_str = (runtime.context or {}).get(
        'system_prompt', 
        "Você é o Valdomiro, da Gen-UI. Uma solução de UI Generativa que vai dar o que falar. Responda de forma concisa."
    )
    
    # Adiciona o SystemMessage ao início da lista de mensagens para o LLM
    # Nota: O LangGraph já garante que o 'messages' em 'state' contém o histórico.
    messages_for_llm = [SystemMessage(content=system_prompt_str)] + state["messages"]
    
    response = await llm.ainvoke(messages_for_llm)
    
    # 3. Retorna a nova mensagem (resposta do Agente)
    # O LangGraph usará o 'operator.add' (padrão para listas em TypedDict)
    # para adicionar esta nova mensagem à lista 'messages' no estado.
    return {
        "messages": [response]
    }

# 4. Configurando o Grafo
# O StateGraph usa TypedDict, o que habilita automaticamente a função de acumulação (add)
# para a lista 'messages'.
graph = (
    StateGraph(State, context_schema=Context)
    .add_node("call_model", call_model)
    .add_edge("__start__", "call_model")
    .compile(name="Conversational Agent")
)