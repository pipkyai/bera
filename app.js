//7913931866:AAFeG5uM1mmJ_BLQ3EDJdxqsLviPgFhIwf8
//https://api.berascan.com/api?module=account&action=balance&address=0xD931C889e54E2fa46dE5fA90397435827396eB65&tag=latest&apikey=7WJBEDCXFYS8U12T1WNKJWH9CGWT4D448A
//350436333

const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');

// Токен вашего Telegram-бота
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
// ID чата, куда будет отправляться сообщение
const CHAT_ID = process.env.CHAT_ID;

const APIWEB = process.env.APIWEB;

// Создаем экземпляр бота
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });

// Переменная для хранения предыдущего значения result
let previousResult = null;

// Функция для выполнения API-запроса
async function fetchData() {
    try {
        // Выполняем API-запрос
        const response = await axios.get(APIWEB);
        return response.data;
    } catch (error) {
        console.error('Ошибка при выполнении API-запроса:', error);
        return null;
    }
}

// Функция для отправки сообщения в Telegram
async function sendToTelegram(message) {
    try {
        await bot.sendMessage(CHAT_ID, message);
        console.log('Сообщение успешно отправлено в Telegram');
    } catch (error) {
        console.error('Ошибка при отправке сообщения в Telegram:', error);
    }
}

// Основная функция
async function main() {
    // Получаем данные из API
    const data = await fetchData();

    if (data && data.result) {
        // Преобразуем result в число, делим на триллион и округляем до целого
        const resultInTrillions = Math.round(Number(data.result) / 1_000_000_000_000);

        // Если result изменился
        if (resultInTrillions !== previousResult) {
            // Отправляем сообщение в Telegram
            const message = `Новое значение result (в триллионах): ${resultInTrillions}`;
            await sendToTelegram(message);

            // Обновляем предыдущее значение result
            previousResult = resultInTrillions;
        } else {
            console.log('Значение result не изменилось');
        }
    } else {
        console.log('Поле result отсутствует в ответе');
    }
}

// Запускаем бота каждую секунду
setInterval(main, 1000);