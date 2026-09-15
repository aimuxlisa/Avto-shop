import asyncio
import logging
import os
import sys
from datetime import datetime

from aiogram import Bot, Dispatcher, F
from aiogram.enums import ChatAction
from aiogram.filters import Command, CommandStart
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.types import Message
from dotenv import load_dotenv
from google import genai

load_dotenv()

BOT_TOKEN = os.environ.get("BOT_TOKEN", "").strip()
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "").strip()

if not BOT_TOKEN or not GEMINI_API_KEY:
    print(
        "Ошибка: BOT_TOKEN или GEMINI_API_KEY не заданы.\n"
        "Скопируйте .env.example в .env и заполните значения."
    )
    sys.exit(1)

MODEL_NAME = "gemini-2.5-flash"
MAX_MESSAGE_LENGTH = 4096
FEEDBACK_FILE = "feedback.txt"
ADMIN_CHAT_ID = os.environ.get("ADMIN_CHAT_ID", "").strip()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()
gemini_client = genai.Client(api_key=GEMINI_API_KEY)


class FeedbackStates(StatesGroup):
    waiting_text = State()


async def ask_gemini(prompt: str) -> str:
    response = await gemini_client.aio.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
    )
    text = (response.text or "").strip()
    if not text:
        return "Извините, Gemini вернул пустой ответ. Попробуйте переформулировать вопрос."
    return text


def split_message(text: str, limit: int = MAX_MESSAGE_LENGTH) -> list[str]:
    if len(text) <= limit:
        return [text]

    chunks: list[str] = []
    current = ""
    for paragraph in text.split("\n"):
        candidate = (current + ("\n" if current else "") + paragraph) if current else paragraph
        if len(candidate) > limit and current:
            chunks.append(current)
            current = paragraph
        else:
            current = candidate
    if current:
        chunks.append(current)

    trimmed = []
    for chunk in chunks:
        while len(chunk) > limit:
            trimmed.append(chunk[:limit])
            chunk = chunk[limit:]
        trimmed.append(chunk)
    return trimmed


async def show_typing(chat_id: int) -> None:
    try:
        while True:
            await bot.send_chat_action(chat_id=chat_id, action=ChatAction.TYPING)
            await asyncio.sleep(4.5)
    except asyncio.CancelledError:
        pass
    except Exception:
        pass


@dp.message(CommandStart())
async def handle_start(message: Message, state: FSMContext) -> None:
    await state.clear()
    logger.info("Запуск диалога от пользователя id=%d (%s)", message.from_user.id, message.from_user.username or "no-username")
    await message.answer(
        "Привет! Я AvtoHu-бот.\n\n"
        "Я отвечаю на вопросы с помощью искусственного интеллекта Google Gemini.\n"
        "Просто напишите мне любое сообщение — и я постараюсь помочь.\n\n"
        "Команды:\n"
        "/start - показать это сообщение\n"
        "/feedback - оставить отзыв владельцу бота\n"
        "/cancel - отменить текущее действие"
    )


@dp.message(Command("feedback"))
async def handle_feedback_start(message: Message, state: FSMContext) -> None:
    await state.set_state(FeedbackStates.waiting_text)
    await message.answer(
        "Напишите ваш отзыв, вопрос или пожелание одним сообщением — "
        "оно будет передано владельцу бота.\n\n/cancel - отменить"
    )


@dp.message(Command("cancel"))
async def handle_feedback_cancel(message: Message, state: FSMContext) -> None:
    if await state.get_state() is None:
        await message.answer("Отменять нечего.")
        return
    await state.clear()
    await message.answer("Отменено. Можете задать вопрос как обычно.")


@dp.message(F.text, FeedbackStates.waiting_text)
async def handle_feedback_text(message: Message, state: FSMContext) -> None:
    feedback = message.text.strip()
    if not feedback:
        await message.answer("Пустой отзыв. Напишите текст отзыва.")
        return
    await state.clear()

    user = message.from_user
    identity = user.username or user.full_name or f"id{user.id}"
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    record = f"[{timestamp}] {identity} (id={user.id}): {feedback}\n"

    try:
        with open(FEEDBACK_FILE, "a", encoding="utf-8") as fh:
            fh.write(record)
        logger.info("Отзыв сохранён в %s", FEEDBACK_FILE)
    except OSError:
        logger.exception("Не удалось записать отзыв в файл")

    if ADMIN_CHAT_ID:
        try:
            await bot.send_message(
                ADMIN_CHAT_ID,
                f"Новый отзыв\nОт: {identity} (id={user.id})\n\n{feedback}",
            )
        except Exception:
            logger.exception("Не удалось отправить отзыв владельцу")

    await message.answer("Спасибо за ваш отзыв! Он передан владельцу бота.")


@dp.message(F.text)
async def handle_text(message: Message) -> None:
    text = message.text.strip()
    if not text or text.startswith("/"):
        return

    typing_task = asyncio.create_task(show_typing(message.chat.id))
    try:
        answer = await ask_gemini(text)
    except Exception:
        logger.exception("Ошибка при обращении к Gemini")
        answer = (
            "Произошла ошибка при обращении к Gemini. "
            "Пожалуйста, повторите попытку чуть позже."
        )
    finally:
        typing_task.cancel()
        await asyncio.gather(typing_task, return_exceptions=True)

    for chunk in split_message(answer):
        await message.answer(chunk)


async def main() -> None:
    await bot.delete_webhook(drop_pending_updates=True)
    logger.info("Бот запущен")
    await dp.start_polling(bot)


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except (KeyboardInterrupt, SystemExit):
        logger.info("Бот остановлен")