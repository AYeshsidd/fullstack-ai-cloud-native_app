import logging
from typing import Dict, Any, List, Optional
from openai import OpenAI
from sqlmodel import Session, select
from datetime import datetime
import json
from models.chat import Conversation, Message, ToolCall, MessageRole
from models.todo import TodoTask
from schemas.chat import ToolCallSchema
from database.session import get_session
from core.config import settings


class AIAgentService:
    """
    Service class to handle AI agent interactions and MCP tool calling.
    """

    def __init__(self):
        """
        Initialize the AI Agent Service with OpenAI client.
        """
        self.client = OpenAI(api_key=settings.openai_api_key)
        self.model_name = settings.model_name

        # Set up logging
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)

        # Define available tools based on MCP tools from Spec-1
        self.tools = [
            {
                "type": "function",
                "function": {
                    "name": "add_task",
                    "description": "Add a new todo task for a user",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {"type": "string", "description": "The ID of the user"},
                            "title": {"type": "string", "description": "The title of the task"},
                            "description": {"type": "string", "description": "Optional description of the task"}
                        },
                        "required": ["user_id", "title"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "list_tasks",
                    "description": "List todo tasks for a user",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {"type": "string", "description": "The ID of the user"},
                            "status": {"type": "string", "description": "Filter tasks by status: all, pending, or completed", "enum": ["all", "pending", "completed"]}
                        },
                        "required": ["user_id"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "update_task",
                    "description": "Update an existing todo task for a user",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {"type": "string", "description": "The ID of the user"},
                            "task_id": {"type": "string", "description": "The ID of the task to update"},
                            "title": {"type": "string", "description": "New title for the task"},
                            "description": {"type": "string", "description": "New description for the task"}
                        },
                        "required": ["user_id", "task_id"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "complete_task",
                    "description": "Mark a todo task as completed for a user",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {"type": "string", "description": "The ID of the user"},
                            "task_id": {"type": "string", "description": "The ID of the task to mark as completed"}
                        },
                        "required": ["user_id", "task_id"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "delete_task",
                    "description": "Delete a todo task for a user",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {"type": "string", "description": "The ID of the user"},
                            "task_id": {"type": "string", "description": "The ID of the task to delete"}
                        },
                        "required": ["user_id", "task_id"]
                    }
                }
            }
        ]

    def get_conversation_history(self, session: Session, conversation_id: str) -> List[Dict[str, Any]]:
        """
        Retrieve conversation history from database.

        Args:
            session: Database session
            conversation_id: ID of the conversation to retrieve

        Returns:
            List of messages in the conversation
        """
        self.logger.info(f"Fetching conversation history for conversation ID: {conversation_id}")

        # Get all messages in the conversation, ordered by timestamp
        messages = session.exec(
            select(Message)
            .where(Message.conversation_id == conversation_id)
            .order_by(Message.timestamp)
        ).all()

        # Convert messages to the format expected by OpenAI
        formatted_messages = []
        for msg in messages:
            formatted_messages.append({
                "role": msg.role.value,
                "content": msg.content
            })

        self.logger.info(f"Retrieved {len(formatted_messages)} messages from conversation history")
        return formatted_messages

    def create_new_conversation(self, session: Session, user_id: str) -> Conversation:
        """
        Create a new conversation in the database.

        Args:
            session: Database session
            user_id: ID of the user initiating the conversation

        Returns:
            Newly created Conversation object
        """
        self.logger.info(f"Creating new conversation for user: {user_id}")

        conversation = Conversation(user_id=user_id)
        session.add(conversation)
        session.commit()
        session.refresh(conversation)

        self.logger.info(f"Created new conversation with ID: {conversation.id}")
        return conversation

    def save_message_to_db(self, session: Session, conversation_id: str, role: MessageRole, content: str) -> Message:
        """
        Save a message to the database.

        Args:
            session: Database session
            conversation_id: ID of the conversation
            role: Role of the message sender
            content: Content of the message

        Returns:
            Saved Message object
        """
        self.logger.info(f"Saving message to DB for conversation {conversation_id}, role: {role}")

        message = Message(
            conversation_id=conversation_id,
            role=role,
            content=content
        )

        session.add(message)
        session.commit()
        session.refresh(message)

        self.logger.info(f"Saved message with ID: {message.id}")
        return message

    def save_tool_call_to_db(self, session: Session, conversation_id: str, message_id: str,
                           tool_name: str, tool_input: dict, tool_output: Optional[dict] = None) -> ToolCall:
        """
        Save a tool call record to the database.

        Args:
            session: Database session
            conversation_id: ID of the conversation
            message_id: ID of the message that triggered this tool call
            tool_name: Name of the tool that was called
            tool_input: Input parameters passed to the tool
            tool_output: Output returned by the tool

        Returns:
            Saved ToolCall object
        """
        self.logger.info(f"Saving tool call to DB - Tool: {tool_name}, Conversation: {conversation_id}")

        tool_call = ToolCall(
            conversation_id=conversation_id,
            message_id=message_id,
            tool_name=tool_name,
            tool_input=tool_input,
            tool_output=tool_output
        )

        session.add(tool_call)
        session.commit()
        session.refresh(tool_call)

        self.logger.info(f"Saved tool call with ID: {tool_call.id}")
        return tool_call

    def call_tool(self, tool_name: str, tool_args: Dict[str, Any], user_id: str) -> Dict[str, Any]:
        """
        Call an MCP tool based on the AI's decision.

        Args:
            tool_name: Name of the tool to call
            tool_args: Arguments for the tool
            user_id: User ID (validated separately)

        Returns:
            Result of the tool call
        """
        self.logger.info(f"Calling tool: {tool_name} with args: {tool_args}")

        # Make sure the user_id in args matches the one passed for security
        tool_args["user_id"] = user_id

        try:
            # In a real implementation, we'd call the actual MCP tools via HTTP
            # For now, we'll simulate the tool calls by directly calling the functions
            if tool_name == "add_task":
                from mcp.tools.add_task import add_task as mcp_add_task
                from mcp.tool_schemas import AddTaskInput

                # Prepare input for the MCP tool
                input_data = AddTaskInput(**tool_args)

                # We'll use a temporary session to call the function directly
                # This is a simplified approach - in production, you'd call the HTTP endpoints
                from ..database.session import engine
                with Session(engine) as session:
                    result = mcp_add_task(input_data, session)
                    # Convert the result to a dictionary format
                    if hasattr(result, '__dict__'):
                        result_dict = result.__dict__
                    else:
                        result_dict = {"id": result.id, "title": result.title, "completed": result.completed}
                    return result_dict

            elif tool_name == "list_tasks":
                from mcp.tools.list_tasks import list_tasks as mcp_list_tasks
                from mcp.tool_schemas import ListTasksInput

                # Prepare input for the MCP tool
                input_data = ListTasksInput(**tool_args)

                # Use temporary session
                from ..database.session import engine
                with Session(engine) as session:
                    result = mcp_list_tasks(input_data, session)
                    # Convert the result to a dictionary format
                    if hasattr(result, '__dict__'):
                        result_dict = result.__dict__
                    else:
                        result_dict = {"tasks": [task.__dict__ for task in result.tasks]}
                    return result_dict

            elif tool_name == "update_task":
                from mcp.tools.update_task import update_task as mcp_update_task
                from mcp.tool_schemas import UpdateTaskInput

                # Prepare input for the MCP tool
                input_data = UpdateTaskInput(**tool_args)

                # Use temporary session
                from ..database.session import engine
                with Session(engine) as session:
                    result = mcp_update_task(input_data, session)
                    # Convert the result to a dictionary format
                    if hasattr(result, '__dict__'):
                        result_dict = result.__dict__
                    else:
                        result_dict = {"id": result.id, "title": result.title, "completed": result.completed}
                    return result_dict

            elif tool_name == "complete_task":
                from mcp.tools.complete_task import complete_task as mcp_complete_task
                from mcp.tool_schemas import CompleteTaskInput

                # Prepare input for the MCP tool
                input_data = CompleteTaskInput(**tool_args)

                # Use temporary session
                from ..database.session import engine
                with Session(engine) as session:
                    result = mcp_complete_task(input_data, session)
                    # Convert the result to a dictionary format
                    if hasattr(result, '__dict__'):
                        result_dict = result.__dict__
                    else:
                        result_dict = {"id": result.id, "title": result.title, "completed": result.completed}
                    return result_dict

            elif tool_name == "delete_task":
                from mcp.tools.delete_task import delete_task as mcp_delete_task
                from mcp.tool_schemas import DeleteTaskInput

                # Prepare input for the MCP tool
                input_data = DeleteTaskInput(**tool_args)

                # Use temporary session
                from ..database.session import engine
                with Session(engine) as session:
                    result = mcp_delete_task(input_data, session)
                    # Convert the result to a dictionary format
                    if hasattr(result, '__dict__'):
                        result_dict = result.__dict__
                    else:
                        result_dict = {"success": result.success, "message": result.message}
                    return result_dict

            else:
                self.logger.error(f"Unknown tool: {tool_name}")
                return {"error": f"Unknown tool: {tool_name}"}

        except Exception as e:
            self.logger.error(f"Error calling tool {tool_name}: {str(e)}")
            return {"error": str(e)}

    def process_chat_request(self, session: Session, user_id: str, message_content: str,
                           conversation_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Process a chat request from a user.

        Args:
            session: Database session
            user_id: ID of the user making the request
            message_content: Content of the user's message
            conversation_id: Optional ID of an existing conversation

        Returns:
            Dictionary containing the AI response and details of any tool calls
        """
        self.logger.info(f"Processing chat request for user: {user_id}, conversation: {conversation_id}")

        # Get or create conversation
        if conversation_id:
            conversation = session.get(Conversation, conversation_id)
            if not conversation or conversation.user_id != user_id:
                raise ValueError("Conversation not found or does not belong to user")
        else:
            conversation = self.create_new_conversation(session, user_id)
            conversation_id = conversation.id

        # Save user message to database
        user_message = self.save_message_to_db(
            session, conversation_id, MessageRole.user, message_content
        )

        # Prepare messages for the AI
        messages = [{"role": "system", "content": "You are a helpful assistant that helps users manage their todo list. Use the provided tools to add, list, update, complete, or delete tasks. Always respond in a friendly and helpful way."}]

        # Add conversation history
        history = self.get_conversation_history(session, conversation_id)
        messages.extend(history)

        # Add the current user message
        messages.append({"role": "user", "content": message_content})

        # Call OpenAI with tools
        response = self.client.chat.completions.create(
            model=self.model_name,
            messages=messages,
            tools=self.tools,
            tool_choice="auto"
        )

        response_message = response.choices[0].message
        tool_calls = response_message.tool_calls

        # Process tool calls if any
        tool_call_results = []
        if tool_calls:
            self.logger.info(f"Processing {len(tool_calls)} tool calls")

            for tool_call in tool_calls:
                function_name = tool_call.function.name
                function_args = json.loads(tool_call.function.arguments)

                # Call the tool and get result
                tool_result = self.call_tool(function_name, function_args, user_id)

                # Save tool call to database
                tool_call_db = self.save_tool_call_to_db(
                    session,
                    conversation_id,
                    user_message.id,
                    function_name,
                    function_args,
                    tool_result
                )

                # Record the tool call result
                tool_call_results.append(
                    ToolCallSchema(
                        name=function_name,
                        input=function_args,
                        output=tool_result,
                        status="error" if "error" in tool_result else "success"
                    )
                )

                # Add the tool result to messages for follow-up
                messages.append({
                    "tool_call_id": tool_call.id,
                    "role": "tool",
                    "name": function_name,
                    "content": json.dumps(tool_result)
                })

        # If there were tool calls, get a final response from the AI
        if tool_calls:
            final_response = self.client.chat.completions.create(
                model=self.model_name,
                messages=messages
            )
            ai_response_content = final_response.choices[0].message.content
        else:
            ai_response_content = response_message.content

        # Save AI response to database
        ai_message = self.save_message_to_db(
            session, conversation_id, MessageRole.assistant, ai_response_content or ""
        )

        # Get the most recent messages to return
        recent_messages = [
            {"role": MessageRole.user, "content": message_content, "timestamp": user_message.timestamp},
            {"role": MessageRole.assistant, "content": ai_response_content or "", "timestamp": ai_message.timestamp}
        ]

        # Update the conversation's updated_at timestamp
        conversation.updated_at = datetime.utcnow()
        session.add(conversation)
        session.commit()

        # Format the response
        result = {
            "response": ai_response_content or "",
            "conversation_id": conversation_id,
            "tool_calls": [call.dict() for call in tool_call_results],
            "messages": recent_messages
        }

        self.logger.info(f"Finished processing chat request, returning response with {len(tool_call_results)} tool calls")
        return result


