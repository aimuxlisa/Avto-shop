import { BUSINESS_DATA } from '../data/business';

export const PHOTO_DISCLAIMER = 'Для более точной информации свяжитесь по номеру или оставьте свои данные через обратную связь';

export function ensurePhotoDisclaimer(reply: string): string {
  if (reply.includes(PHOTO_DISCLAIMER)) return reply;
  return `${reply}\n\n${PHOTO_DISCLAIMER}`;
}

export function generateApproximatePhotoResponse(): string {
  return `${BUSINESS_DATA.shortName} получил ваше фото! По нему можно сделать лишь приблизительную оценку состояния автомобиля или детали. Чтобы получить точный расчет стоимости диагностики и ремонта, наш специалист должен осмотреть автомобиль в сервисном центре.\n\n${PHOTO_DISCLAIMER}`;
}

export interface GeminiContentPart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string; // base64 string
  };
}

/**
 * Обращение к Google Gemini API (по умолчанию Gemini 3.5 Flash с поддержкой изображений)
 */
export async function callGeminiApi(
  userMessage: string,
  apiKey?: string,
  imageData?: { base64: string; mimeType: string }
): Promise<string> {
  const key = apiKey || (typeof process !== 'undefined' ? (process.env?.NEXT_PUBLIC_GEMINI_API_KEY || process.env?.GEMINI_API_KEY) : undefined);
  const modelName = (typeof process !== 'undefined' ? (process.env?.NEXT_PUBLIC_GEMINI_MODEL || process.env?.GEMINI_MODEL) : undefined) || 'gemini-3.5-flash';

  if (!key) {
    // Интеллектуальный контекстный генератор ответов для автосервиса и маркетплейса AutoHub при отсутствии ключа
    return imageData?.base64 ? generateApproximatePhotoResponse() : generateAutoServiceResponse(userMessage);
  }

  const servicesList = BUSINESS_DATA.services.map((s, i) => `${i + 1}. ${s.name} — ${s.price} (${s.time})`).join('\n');
  const paymentList = BUSINESS_DATA.paymentMethods.map((m) => `• ${m}`).join('\n');

  const systemInstruction = `Ты — профессиональный, экспертный, вежливый и краткий онлайн-консультант премиального автосервиса и маркетплейса "${BUSINESS_DATA.name}".

ДАННЫЕ О КОМПАНИИ:
- Телефон: ${BUSINESS_DATA.phone}, WhatsApp: ${BUSINESS_DATA.whatsapp}, Telegram: ${BUSINESS_DATA.telegram}, Email: ${BUSINESS_DATA.email}
- Адрес: ${BUSINESS_DATA.address}
- График работы: будни ${BUSINESS_DATA.workingHours.weekdays}, выходные ${BUSINESS_DATA.workingHours.weekends}, онлайн-поддержка ${BUSINESS_DATA.workingHours.supportOnline}
- Гарантия: ${BUSINESS_DATA.guarantee}

УСЛУГИ И ЦЕНЫ:
${servicesList}

СПОСОБЫ ОПЛАТЫ:
${paymentList}

ПРАВИЛА:
1. Отвечай емко (2-4 предложения), дружелюбно и по существу НА РУССКОМ ЯЗЫКЕ.
2. Ты консультант автосервиса и маркетплейса — отвечай на любые вопросы клиента по теме автомобилей: диагностика, ремонт, ТО, цены, запись, выбор автомобиля, шины, кузов, электроника, электромобили, гарантия, оплата.
3. На любые вопросы по услугам называй актуальные цены из списка выше и предлагай записаться на удобное время.
4. При вопросах о покупке авто предлагай бесплатный тест-драйв или консультацию в шоуруме.
5. Если клиент просит записать его — вежливо спроси номер телефона и удобное время.
6. Если не знаешь точный ответ — честно предложи проконсультировать со специалистом сервиса и дай контакты.
7. Если прикреплена фотография детали или авто, проанализируй её состояние и дай приблизительную оценку.`;

  const parts: any[] = [];
  
  if (imageData?.base64) {
    parts.push({
      inline_data: {
        mime_type: imageData.mimeType || 'image/jpeg',
        data: imageData.base64
      }
    });
  }

  parts.push({
    text: `${systemInstruction}\n\nВопрос клиента: ${userMessage}`
  });

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }]
        })
      }
    );

    if (!response.ok) {
      // Если модель 3.5-flash еще в preview или недоступна на данном ключе, делаем fallback на 2.0-flash / 1.5-flash
      if (response.status === 404 || response.status === 400) {
        const fallbackRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts }] })
          }
        );
        if (fallbackRes.ok) {
          const fbData = await fallbackRes.json();
          const fbText = fbData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (fbText) return fbText.trim();
        }
      }
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!replyText) {
      throw new Error('Empty response from Gemini');
    }
    return replyText.trim();
  } catch (error) {
    console.warn('Gemini API call error, falling back to local auto-service generator:', error);
    return imageData?.base64 ? generateApproximatePhotoResponse() : generateAutoServiceResponse(userMessage);
  }
}

function generateAutoServiceResponse(query: string): string {
  const text = ` ${query.toLowerCase()} `;

  // Двигатель / Чек / ошибки
  if (text.includes('двигател') || text.includes('чек') || text.includes('check engine') || text.includes('ошибк') || text.includes('датчик') || text.includes('троит') || text.includes('вибрац')) {
    return 'При горящем индикаторе Check Engine или посторонних симптомах наши специалисты проводят полную компьютерную диагностику сканерами дилерского уровня: считываем коды ошибок по двигателю, АБС, подушкам безопасности и кузовной электронике. Стоимость — от 3 500 ₽, за 45 минут.';
  }
  // Масло / фильтры / ТО
  if (text.includes('масло') || text.includes('фильтр') || text.includes('то ') || text.includes('тех. обслужив') || text.includes('техн. обслужив')) {
    return 'Для большинства автомобилей рекомендуем плановое ТО каждые 8 000–10 000 км: замена синтетического масла и фильтров. В наличии оригинальные масла и фильтры Shell, Mobil 1, Motul. Стоимость ТО — от 4 900 ₽, занимает 1 час. Подберём удобное время записи.';
  }
  // Тормоза
  if (text.includes('тормоз') || text.includes('колодк') || text.includes('скрип') || text.includes('диск') || text.includes('столкновен')) {
    return 'Посторонние звуки или скрип при торможении могут свидетельствовать об износе фрикционного слоя колодок или неравномерном износе дисков. Рекомендуем экспресс-проверку тормозной системы — занимает 25 минут, стоимость от 2 500 ₽.';
  }
  // Тест-драйв / покупка
  if (text.includes('тест') || text.includes('драйв') || text.includes('поездка') || text.includes('купить') || text.includes('покупк') || text.includes('цена')) {
    return 'Вы можете записаться на бесплатный тест-драйв любой модели из нашего каталога онлайн прямо на сайте. Доступны Tesla Model 3, BMW X5, Porsche Taycan, Audi e-tron и Mercedes-Benz E-Class. Приезжайте в шоурум или выберем удобное время для доставки тест-драйва.';
  }
  // Кредит / рассрочка / финансы
  if (text.includes('кредит') || text.includes('рассрочк') || text.includes('лизинг') || text.includes('калькулятор') || text.includes('оплат') || text.includes('первый взнос')) {
    return 'Доступно автокредитование со ставкой от 6.9% и первым взносом от 10%. Можете рассчитать ежемесячный платеж на интерактивном калькуляторе на сайте. Также принимаем карты, СБП, безналичный расчёт для юр лиц и рассрочку 0% до 12 месяцев.';
  }
  // Шины / колеса / шиномонтаж
  if (text.includes('шин') || text.includes('колес') || text.includes('диск') || text.includes('балансировк') || text.includes('шиномонтаж') || text.includes('сезонн')) {
    return 'В шинном центре доступен сезонный шиномонтаж на высокоточных стендах Hunter с балансировкой и бережной мойкой колес. Стоимость — от 2 800 ₽. Также доступно сезонное хранение шин.';
  }
  // Подвеска
  if (text.includes('подвеск') || text.includes('амортизатор') || text.includes('стойк') || text.includes('стук') || text.includes('пружин') || text.includes('сайлентблок') || text.includes('шаров')) {
    return 'Стуки и люфты в подвеске — частая причина обращения. Проводим полную диагностику подвески (60 точек): амортизаторы, стойки, сайлентблоки, шаровые опоры на стенде. Стоимость — от 2 500 ₽, займёт 40 минут.';
  }
  // Аккумулятор / не заводится
  if (text.includes('аккумулятор') || text.includes('аккум') || text.includes('батарея') || text.includes('заводит') || text.includes('зарядк') || text.includes('старт') || text.includes('подзаряд')) {
    return 'Проверим состояние аккумулятора и зарядной системы тестером за 15 минут, подберём и заменим АКБ с гарантией 24 месяца. Диагностика — от 1 500 ₽, замена АКБ — от 2 000 ₽.';
  }
  // Кондиционер / климат
  if (text.includes('кондиционер') || text.includes('кондиц') || text.includes('климат') || text.includes('запах') || text.includes('обогрев') || text.includes('компрессор')) {
    return 'Выполняем диагностику и заправку кондиционера, замену компрессора, чистку испарителя. Заправка — от 3 500 ₽, комплексная диагностика климат-системы — от 2 000 ₽.';
  }
  // Кузов / покраска
  if (text.includes('кузов') || text.includes('вмятин') || text.includes('покрас') || text.includes('ржавчин') || text.includes('царапин') || text.includes('след') || text.includes('детил')) {
    return 'Выполняем малярный ремонт элементов кузова, удаление вмятин без покраски (PDR), полировку и нанесение керамического покрытия. Покраска отдельного элемента — от 8 000 ₽, комплексный детейлинг — от 12 000 ₽.';
  }
  // Свечи / зажигание
  if (text.includes('свеч') || text.includes('зажиган') || text.includes('катушк') || text.includes('проводов') || text.includes('троит')) {
    return 'Пропуски зажигания и вибрация часто связаны с износом свечей, катушек или высоковольтных проводов. Диагностика зажигания — от 2 000 ₽, замена свечей — от 1 500 ₽.';
  }
  // ГРМ
  if (text.includes('грм') || text.includes('ремень') || text.includes('цепь') || text.includes('газораспред') || text.includes('натяжител')) {
    return 'Замена ремня или цепи ГРМ с роликами и натяжителями — важный этап ТО, обычно каждые 60 000–100 000 км. Стоимость работ — от 6 000 ₽, с комплектом запчастей — по запросу после подбора по VIN.';
  }
  // Электромобили
  if (text.includes('электрокар') || text.includes('электромобил') || text.includes('tesla') || text.includes('тесла') || text.includes('zeekr') || text.includes('taycan') || text.includes('батаре') || text.includes('электротяг')) {
    return 'Мы специализируемся на диагностике, русификации и обслуживании электромобилей (Tesla Model 3/Y/S/X, Porsche Taycan, Zeekr, Li Auto). Комплексная компьютерная проверка EV — от 6 000 ₽. Проверим состояние батареи и зарядной системы.';
  }
  // Коробка передач
  if (text.includes('коробк') || text.includes('акпп') || text.includes('мкпп') || text.includes('кпп') || text.includes('передач') || text.includes('сцеплен')) {
    return 'Диагностика и обслуживание коробок передач: замена трансмиссионного масла, фильтров, адаптация АКПП. Диагностика — от 3 000 ₽, замена масла в АКПП — от 5 000 ₽.';
  }
  // Радиатор / охлаждение
  if (text.includes('антифриз') || text.includes('охлажд') || text.includes('радиатор') || text.includes('тосол') || text.includes('перегрев')) {
    return 'Проверим систему охлаждения: уровень и состояние антифриза, патрубки, радиатор, термостат, на предмет перегрева. Замена антифриза — от 2 500 ₽, диагностика протечек — от 1 500 ₽.';
  }
  // Стекло / лобовое
  if (text.includes('стекло') || text.includes('лобовое') || text.includes('трещин') || text.includes('скол стекла') || text.includes('замен.*стекл')) {
    return 'Ремонт сколов и трещин лобового стекла без замены — от 2 500 ₽ (предотвращает дальнейшее расхождение трещины). Замена лобового стекла — по подбору модели, подберите по VIN.';
  }
  // Эвакуатор / поломка / экстренная
  if (text.includes('эвакуатор') || text.includes('поломк') || text.includes('буксир') || text.includes('экстренн') || text.includes('слома')) {
    return 'При поломке на дороге организуем вызов эвакуатора и экстренный приём в сервисе. Круглосуточный телефон: ' + BUSINESS_DATA.phone + '.';
  }
  // Выхлоп / катализатор
  if (text.includes('выхлоп') || text.includes('глушител') || text.includes('каталит') || text.includes('сажев') || text.includes('дым')) {
    return 'Диагностика и ремонт системы выпуска: замена глушителя, обслуживание катализатора и сажевого фильтра (DPF/FAP). Диагностика — от 2 500 ₽.';
  }
  // Страховка
  if (text.includes('страхов') || text.includes('осаго') || text.includes('каско') || text.includes('полис')) {
    return 'При покупке автомобиля у нас оформляем ОСАГО на весь период эксплуатации тест-драйва и помогаем со страхованием. По КАСКО проконсультирует наш менеджер: ' + BUSINESS_DATA.phone + '.';
  }
  // Запчасти
  if (text.includes('запчаст') || text.includes('расходник') || text.includes('оригинал') || text.includes('аналог') || text.includes('комплект')) {
    return 'Подбираем оригинальные запчасти и проверенные аналоги (Lemförder, TRW, Bosch, SKF) по VIN-номеру с доставкой за 1–3 рабочих дня. Приезжайте со своими запчастями и маслом — установим с гарантией на работы.';
  }
  // Салон / химчистка
  if (text.includes('химчистк') || text.includes('салон') || text.includes('обивк') || text.includes('запах') || text.includes('чистк')) {
    return 'Химчистка салона (ткань и кожа): удаление пятен, запахов, антибактериальная обработка. Стоимость — от 4 500 ₽, экспресс-химчистка — от 2 500 ₽.';
  }
  // Trade-in / продажа
  if (text.includes('трейд') || text.includes('trade') || text.includes('обмен') || text.includes('продать') || text.includes('оценк') || text.includes('предпродаж')) {
    return 'Оценка по Trade-In и предпродажная подготовка бесплатны! Оценка занимает 30 минут. Подготовим автомобиль к продаже: диагностика, детейлинг, замена расходников — всё в одном пакете.';
  }
  // Запись на сервис
  if (text.includes('записать') || text.includes('запись') || text.includes('записаться') || text.includes('приехать') || text.includes('приём') || text.includes('прийти')) {
    return 'Мы можем записать вас на удобное время! Напишите ваше имя и номер телефона — менеджер подтвердит запись. Или позвоните нам: ' + BUSINESS_DATA.phone + '.';
  }
  // Если ничего не подошло — подсказываем и предлагаем связаться
  return `Спасибо за ваш вопрос! Это действительно важно — чтобы дать точный ответ и расчет, нашим мастерам нужно уточнить детали диагностики. Вы можете связаться с нами напрямую по номеру ${BUSINESS_DATA.phone} (WhatsApp: ${BUSINESS_DATA.whatsapp}), а мы всегда рады помочь онлайн. Могу уточнить подробности: вы уже были у нас на диагностике?`;
}
