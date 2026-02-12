from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from sqlmodel import Session
from database.session import get_session
from services.ai_agent import AIAgentService
from middleware.auth import JWTBearer
from schemas.chat import ChatRequest, ChatResponse, ConversationListResponse, ConversationDetailResponse
from models.user import User
from models.chat import Conversation, Message, MessageRole
from core.config import settings
import logging


router = APIRouter(prefix="/api/v1", tags=["chat"])

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@router.post("/users/{user_id}/chat", response_model=ChatResponse)
def chat_endpoint(
    user_id: str,
    chat_request: ChatRequest,
    session: Session = Depends(get_session),
    token: str = Depends(JWTBearer())
):
    """
    Chat endpoint that accepts natural language messages from users and responds using AI.

    Args:
        user_id: ID of the user sending the message
        chat_request: Request containing the user's message and optional conversation_id
        session: Database session for operations
        token: JWT token for authentication

    Returns:
        ChatResponse: AI response with details of any tool calls made
    """
    logger.info(f"Received chat request from user {user_id} with message: '{chat_request.message[:50]}...'")

    # Validate user exists
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} does not exist"
        )

    # Verify that the user ID in the path matches the authenticated user
    # For this implementation, we're assuming JWT middleware provides the authenticated user info
    # In a real implementation, you would extract the user ID from the JWT token
    # and verify it matches the user_id in the path for security

    try:
        # Initialize AI Agent Service
        agent_service = AIAgentService()

        # Process the chat request
        result = agent_service.process_chat_request(
            session=session,
            user_id=user_id,
            message_content=chat_request.message,
            conversation_id=chat_request.conversation_id
        )

        # Log successful processing
        logger.info(f"Successfully processed chat request for user {user_id}, conversation {result['conversation_id']}")

        # Return the response
        return ChatResponse(**result)

    except Exception as e:
        logger.error(f"Error processing chat request for user {user_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing chat request: {str(e)}"
        )


@router.get("/users/{user_id}/conversations")
def get_user_conversations(
    user_id: str,
    session: Session = Depends(get_session),
    token: str = Depends(JWTBearer())
):
    """
    Get a list of all conversations for the specified user.

    Args:
        user_id: ID of the user requesting conversations
        session: Database session for operations
        token: JWT token for authentication

    Returns:
        List of conversation metadata
    """
    from models.chat import Conversation

    logger.info(f"Fetching conversations for user {user_id}")

    # Validate user exists
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} does not exist"
        )

    # Get all conversations for the user
    from sqlmodel import select
    conversations = session.exec(select(Conversation).where(Conversation.user_id == user_id)).all()

    # Format the response
    conversation_list = []
    for conv in conversations:
        conversation_list.append({
            "id": conv.id,
            "created_at": conv.created_at,
            "updated_at": conv.updated_at
        })

    logger.info(f"Returned {len(conversation_list)} conversations for user {user_id}")

    return {"conversations": conversation_list}


@router.get("/users/{user_id}/conversations/{conversation_id}")
def get_conversation_detail(
    user_id: str,
    conversation_id: str,
    session: Session = Depends(get_session),
    token: str = Depends(JWTBearer())
):
    """
    Get detailed information about a specific conversation.

    Args:
        user_id: ID of the user requesting the conversation
        conversation_id: ID of the conversation to retrieve
        session: Database session for operations
        token: JWT token for authentication

    Returns:
        Detailed conversation information including messages
    """
    from models.chat import Conversation, Message, MessageRole

    logger.info(f"Fetching conversation {conversation_id} for user {user_id}")

    # Validate user exists
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} does not exist"
        )

    # Get the conversation and verify it belongs to the user
    conversation = session.get(Conversation, conversation_id)
    if not conversation or conversation.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Conversation with ID {conversation_id} does not exist or does not belong to user {user_id}"
        )

    # Get messages for the conversation
    from sqlmodel import select
    messages = session.exec(select(Message).where(Message.conversation_id == conversation_id).order_by(Message.timestamp)).all()

    # Format the messages
    formatted_messages = []
    for msg in messages:
        formatted_messages.append({
            "role": msg.role.value,
            "content": msg.content,
            "timestamp": msg.timestamp
        })

    logger.info(f"Returning conversation {conversation_id} with {len(formatted_messages)} messages")

    return {
        "conversation": {
            "id": conversation.id,
            "created_at": conversation.created_at,
            "updated_at": conversation.updated_at,
            "messages": formatted_messages
        }
    }