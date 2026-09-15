import asyncio
import logging
import os
import re

import httpx
from aiogram import Bot, Dispatcher, Router, F
from aiogram.filters import CommandStart
from aiogram.types import Message
from dotenv import load_dotenv
from google import genai
from google.genai import errors as gemini_errors

load_dotenv()

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
CRM_API_URL = os.getenv("CRM_API_URL", "http://localhost:3001").rstrip("/")
CRM_API_SECRET = os.getenv("CRM_API_SECRET", "vespera_crm_secret_key_2026")

if not TELEGRAM_BOT_TOKEN:
    raise RuntimeError("TELEGRAM_BOT_TOKEN is not set in .env")
if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is not set in .env")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

bot = Bot(token=TELEGRAM_BOT_TOKEN)
dp = Dispatcher()
router = Router()
dp.include_router(router)

gemini_client = genai.Client(api_key=GEMINI_API_KEY)

TELEGRAM_MAX_MESSAGE_LENGTH = 4096

PHONE_RE = re.compile(r"(?:\+?\d[\d\s\-()]{7,19}\d)")


def extract_phone(text: str) -> str | None:
    match = PHONE_RE.search(text)
    if not match:
        return None
    raw = match.group(0).strip()
    digits = re.sub(r"\D", "", raw)
    if len(digits) < 10:
        return None
    return raw


async def send_lead_to_crm(name: str, contact: str, message_text: str) -> bool:
    payload = {
        "name": name[:200],
        "contact": contact[:200],
        "message": message_text[:2000],
        "source": "telegram",
    }
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.post(
                f"{CRM_API_URL}/api/leads",
                headers={
                    "Content-Type": "application/json",
                    "x-crm-api-secret": CRM_API_SECRET,
                },
                json=payload,
            )
            response.raise_for_status()
            logger.info("Lead sent to CRM: %s", response.text)
            return True
    except httpx.HTTPError as e:
        logger.error("CRM lead error: %s", e)
        return False


def split_message(text: str, max_length: int = TELEGRAM_MAX_MESSAGE_LENGTH) -> list[str]:
    if len(text) <= max_length:
        return [text]
    parts = []
    while text:
        if len(text) <= max_length:
            parts.append(text)
            break
        chunk = text[:max_length]
        last_newline = chunk.rfind("\n")
        if last_newline > 0:
            chunk = text[:last_newline]
        parts.append(chunk)
        text = text[len(chunk):]
    return parts


async def send_long_message(message: Message, text: str) -> None:
    parts = split_message(text)
    for part in parts:
        await message.answer(part)


@router.message(CommandStart())
async def cmd_start(message: Message) -> None:
    await message.answer(
        "Привет! Я бот, работающий на базе Google Gemini AI.\n\n"
        "Спросите меня о чём угодно — я отвечу.\n"
        "Если вы напишете номер телефона, я автоматически отправлю вашу "
        "заявку менеджеру в CRM.\n"
        "Чтобы очистить историю диалога, используйте команду /clear."
    )


@router.message(F.text == "/clear")
async def cmd_clear(message: Message) -> None:
    await message.answer("История диалога очищена. Можете задать новый вопрос.")


@router.message(F.text)
async def handle_message(message: Message) -> None:
    user_text = message.text.strip()
    if not user_text:
        await message.answer("Пожалуйста, отправьте текстовое сообщение.")
        return

    logger.info(
        "User %s (id=%d) sent: %s",
        message.from_user.username or message.from_user.first_name,
        message.from_user.id,
        user_text[:100],
    )

    phone = extract_phone(user_text)
    lead_created = False
    if phone:
        user_display_name = message.from_user.full_name or message.from_user.username or "Telegram-пользователь"
        lead_created = await send_lead_to_crm(
            name=user_display_name,
            contact=phone,
            message_text=user_text,
        )

    status_message = await message.answer("печатает...")

    try:
        response = await asyncio.to_thread(
            gemini_client.models.generate_content,
            model="gemini-3.6-flash",
            contents=user_text,
        )

        reply_text = response.text if response.text else None

        if not reply_text or not reply_text.strip():
            await status_message.edit_text(
                "К сожалению, не удалось получить ответ. Попробуйте переформулировать вопрос."
            )
            return

        await status_message.delete()
        if lead_created:
            await message.answer(
                "Ваша заявка с номером телефона отправлена менеджеру в CRM. "
                "Мы свяжемся с вами в ближайшее время."
            )
        await send_long_message(message, reply_text.strip())

    except gemini_errors.ClientError as e:
        logger.error("Gemini API error: %s", e)
        await status_message.edit_text(
            "Произошла ошибка при обращении к Gemini API. Пожалуйста, попробуйте позже."
        )
    except Exception as e:
        logger.error("Unexpected error: %s", e)
        await status_message.edit_text(
            "Произошла непредвиденная ошибка. Попробуйте ещё раз позже."
        )


async def main() -> None:
    logger.info("Starting bot...")
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
