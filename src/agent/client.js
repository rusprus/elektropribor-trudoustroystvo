import { documentGroups, formPoints, medical, stages } from '../data/guide'

const endpoint = import.meta.env.VITE_AGENT_URL?.trim()

export function agentConfigured() {
  return Boolean(endpoint)
}

/**
 * Точка интеграции агента-консультанта.
 * Если задан VITE_AGENT_URL, сообщение уходит POST-запросом.
 * Иначе отвечает локальная заготовка по тексту инструкции.
 */
export async function askConsultant(message, history) {
  if (!endpoint) {
    return { reply: localReply(message), mode: 'local' }
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      history: history.map(({ role, content }) => ({ role, content })),
    }),
  })

  if (!response.ok) {
    throw new Error(`Агент ответил статусом ${response.status}`)
  }

  const data = await response.json()
  const reply = data.reply || data.message || data.answer
  if (!reply) {
    throw new Error('В ответе агента нет текста')
  }
  return { reply, mode: 'agent' }
}

function localReply(message) {
  const text = message.toLowerCase()

  if (matches(text, ['документ', 'список', 'паспорт', 'снилс', 'инн', 'диплом', 'втб', 'карт', 'временн'])) {
    const lines = documentGroups.flatMap((group) =>
      group.items.map((item) => `• ${item.title}. ${item.note}`),
    )
    return `Для докладной записки нужны документы первого блока:\n\n${lines.join('\n')}`
  }

  if (matches(text, ['уволь', 'заявлен', 'ждать', 'согласован', 'когда писать'])) {
    const wait = stages.find((stage) => stage.id === 'wait')
    return `${wait.lead}\n\n${wait.actions.map((item) => `• ${item}`).join('\n')}`
  }

  if (matches(text, ['медосмотр', 'медицин', 'осмотр', 'врач'])) {
    return `${medical.lead}\n\n${medical.points.map((item) => `• ${item}`).join('\n')}`
  }

  if (matches(text, ['фото', '4×6', '4x6', '3×4', '3x4', 'судимост'])) {
    return [
      'К анкете нужны две фотографии: большая 4×6 см — свежая, маленькая 3×4 см — любая домашняя.',
      'Фотографии в анкету не вклеивайте.',
      'Для службы безопасности также нужна справка об отсутствии судимости с Госуслуг.',
    ].join('\n\n')
  }

  if (matches(text, ['встреч', 'звон', 'приезж', 'понедельник', 'четверг'])) {
    return [
      'Позвоните представителю отдела управления персоналом — телефон указан внизу списка документов — и договоритесь о встрече.',
      'Без предупреждения приезжать не нужно.',
      'С собой: документы по списку, анкета, фотографии и справка об отсутствии судимости.',
      'Приём на работу обычно по понедельникам и четвергам. Другой день можно согласовать.',
    ].join('\n\n')
  }

  if (matches(text, ['родствен']) && matches(text, ['загран', 'границ', 'рубеж', 'проживал'])) {
    const abroad = formPoints.find((point) => point.id === 'p16')
    const body = abroad.points.map((item) => `• ${item}`).join('\n')
    return `Пункт ${abroad.code}. ${abroad.title}.\n\n${body}\n\n«${abroad.quote}»`
  }

  const point = findPoint(text)
  if (point) {
    const body = point.points.map((item) => `• ${item}`).join('\n')
    return point.quote
      ? `Пункт ${point.code}. ${point.title}.\n\n${body}\n\n«${point.quote}»`
      : `Пункт ${point.code}. ${point.title}.\n\n${body}`
  }

  if (matches(text, ['анкет', 'заполн', 'бланк', 'образец'])) {
    return [
      'Анкета заполняется строго по образцу, но своими сведениями.',
      'Сначала прочитайте все варианты ответа в примере и выберите подходящий.',
      'Дату анкеты не ставьте. Подпись можно поставить сразу, расшифровка не нужна.',
      'Могу разобрать отдельный пункт: 6, 11, 13, 14, 15, 16, 17 или 18.',
    ].join('\n\n')
  }

  return [
    'Я заготовка консультанта и отвечаю по этой инструкции.',
    'Спросите про документы, конкретный пункт анкеты, фотографии, встречу, увольнение или медосмотр.',
    'Когда подключат агента, ответы будет давать он — окно чата для этого уже готово.',
  ].join('\n\n')
}

function findPoint(text) {
  const byCode = formPoints.find((point) => {
    const code = String(Number(point.code))
    return new RegExp(`пункт\\s*${code}(?!\\d)`).test(text) || new RegExp(`п\\.?\\s*${code}(?!\\d)`).test(text)
  })
  if (byCode) return byCode

  const topics = [
    { id: 'p6', words: ['семейн', 'брак', 'женат', 'замуж'] },
    { id: 'p11', words: ['загран', 'поезд', 'границ', 'туризм', 'белорус', 'украин', 'абхаз'] },
    { id: 'p13', words: ['воин', 'военкомат', 'призыв', 'билет'] },
    { id: 'p14', words: ['трудов', 'должност', 'стаж', 'работал'] },
    { id: 'p15', words: ['родствен', 'родител', 'ребён', 'ребен', 'супруг'] },
    { id: 'p16', words: ['проживал за', 'заграниц', 'за рубеж'] },
    { id: 'p17', words: ['адрес', 'прописк', 'регистрац'] },
    { id: 'p18', words: ['дополнительн'] },
  ]

  const topic = topics.find((item) => matches(text, item.words))
  return topic ? formPoints.find((point) => point.id === topic.id) : null
}

function matches(text, words) {
  return words.some((word) => text.includes(word))
}
