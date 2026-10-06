import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowUpRight, Check, ChevronRight, MessageSquare, Phone, X } from 'lucide-react'
import { salon, services, type ServiceId } from '../data'

type Props = { initialService: ServiceId | 'consult'; onClose: () => void }

function localDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export default function Booking({ initialService, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [step, setStep] = useState(0)
  const [service, setService] = useState<string>(initialService)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('Любое время')
  const [name, setName] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)
  const today = localDate(new Date())
  const maxDay = new Date()
  maxDay.setMonth(maxDay.getMonth() + 3)
  const serviceName =
    services.find((item) => item.id === service)?.name ?? 'Консультация — помогите определиться'
  const formattedDate = date
    ? new Date(`${date}T12:00:00`).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
    : 'Обсудим по телефону'
  const message = `Здравствуйте! Хочу записаться в «Клеопатру».\nИмя: ${name.trim()}\nУслуга: ${serviceName}\nЖелаемая дата: ${formattedDate}\nВремя: ${time}${note.trim() ? `\nПожелания: ${note.trim()}` : ''}\nПодскажите, пожалуйста, доступное время и стоимость.`

  useEffect(() => {
    const activeElement = document.activeElement as HTMLElement | null
    const currentDialog = dialog.current
    currentDialog?.showModal()
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      currentDialog?.close()
      document.body.style.overflow = original
      activeElement?.focus()
    }
  }, [])

  useEffect(() => {
    dialog.current?.querySelector<HTMLElement>('[data-step-title]')?.focus()
  }, [step])

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message)
      setCopied(true)
      setCopyError(false)
    } catch {
      setCopyError(true)
    }
  }

  return (
    <dialog
      ref={dialog}
      className="booking-dialog"
      aria-labelledby="booking-title"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="booking-inner">
        <div className="booking-topline">
          <span className="eyebrow">ВРЕМЯ ДЛЯ СЕБЯ</span>
          <button className="icon-button" onClick={onClose} aria-label="Закрыть запись">
            <X size={21} />
          </button>
        </div>
        <div
          className="booking-progress"
          role="progressbar"
          aria-label="Этап записи"
          aria-valuemin={1}
          aria-valuemax={3}
          aria-valuenow={step + 1}
          aria-valuetext={`Шаг ${step + 1} из 3`}
        >
          <span className="is-complete" />
          <span className={step >= 1 ? 'is-complete' : ''} />
          <span className={step >= 2 ? 'is-complete' : ''} />
        </div>
        {step === 0 && (
          <>
            <h2 id="booking-title" data-step-title tabIndex={-1}>
              С чего начнём?
            </h2>
            <p className="booking-lead">Выберите то, что хочется подарить своим волосам.</p>
            <fieldset className="booking-options">
              <legend className="sr-only">Услуга</legend>
              {[...services, { id: 'consult', name: 'Помогите определиться', number: '05' }].map(
                (item) => (
                  <label
                    className={`booking-option ${service === item.id ? 'selected' : ''}`}
                    key={item.id}
                  >
                    <input
                      type="radio"
                      name="service"
                      value={item.id}
                      checked={service === item.id}
                      onChange={() => setService(item.id)}
                    />
                    <span className="option-number">{item.number}</span>
                    <span>{item.name}</span>
                    <span className="radio-mark">{service === item.id && <Check size={12} />}</span>
                  </label>
                ),
              )}
            </fieldset>
            <p className="booking-note">Стоимость и длительность согласуем до визита.</p>
            <button className="button button-dark booking-next" onClick={() => setStep(1)}>
              Выбрать дату <ChevronRight size={17} />
            </button>
          </>
        )}
        {step === 1 && (
          <form
            onSubmit={(event) => {
              event.preventDefault()
              if (!name.trim()) {
                setError('Пожалуйста, укажите ваше имя.')
                return
              }
              if (date && (date < today || date > localDate(maxDay))) {
                setError('Выберите дату в ближайшие три месяца.')
                return
              }
              setError('')
              setStep(2)
            }}
          >
            <h2 id="booking-title" data-step-title tabIndex={-1}>
              Ваш идеальный визит
            </h2>
            <p className="booking-lead">
              Расскажите, когда вам удобно. Точное время подтвердит салон.
            </p>
            <label className="form-field">
              Как к вам обращаться <span aria-hidden="true">*</span>
              <input
                name="name"
                autoComplete="given-name"
                required
                maxLength={60}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Ваше имя"
              />
            </label>
            <div className="form-row">
              <label className="form-field">
                Желаемая дата
                <input
                  type="date"
                  name="date"
                  min={today}
                  max={localDate(maxDay)}
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                />
              </label>
              <label className="form-field">
                Удобное время
                <select value={time} onChange={(event) => setTime(event.target.value)}>
                  <option>Любое время</option>
                  <option>Утром</option>
                  <option>Днём</option>
                  <option>Вечером</option>
                </select>
              </label>
            </div>
            <label className="form-field">
              Пожелания <span className="optional">необязательно</span>
              <textarea
                name="note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                maxLength={400}
                rows={3}
                placeholder="Например, хочу освежить цвет и сохранить длину"
              />
            </label>
            <p className="booking-note">
              Данные останутся в этой форме до отправки сообщения через ваше приложение SMS.
            </p>
            {error && (
              <p role="alert" className="form-error">
                {error}
              </p>
            )}
            <div className="booking-actions">
              <button
                type="button"
                className="back-button"
                onClick={() => setStep(0)}
                aria-label="Назад к услугам"
              >
                <ArrowLeft size={19} />
              </button>
              <button type="submit" className="button button-dark">
                Подготовить заявку <ArrowUpRight size={18} />
              </button>
            </div>
          </form>
        )}
        {step === 2 && (
          <>
            <span className="message-icon">
              <MessageSquare size={25} strokeWidth={1.3} />
            </span>
            <h2 id="booking-title" data-step-title tabIndex={-1}>
              Осталось отправить
            </h2>
            <p className="booking-lead">
              {name.trim()}, ваша заявка готова. Отправьте её по SMS — мы согласуем время и
              стоимость.
            </p>
            <dl className="booking-summary">
              <div>
                <dt>Услуга</dt>
                <dd>{serviceName}</dd>
              </div>
              <div>
                <dt>Дата</dt>
                <dd>{formattedDate}</dd>
              </div>
              <div>
                <dt>Время</dt>
                <dd>{time}</dd>
              </div>
            </dl>
            <a
              className="button button-dark booking-next"
              href={`sms:${salon.phone}?body=${encodeURIComponent(message)}`}
            >
              Отправить SMS <ArrowUpRight size={18} />
            </a>
            <button className="copy-button" onClick={copyMessage}>
              {copied ? (
                <>
                  <Check size={15} /> Текст скопирован
                </>
              ) : (
                'Скопировать текст заявки'
              )}
            </button>
            <span className="sr-only" role="status">
              {copied ? 'Текст заявки скопирован в буфер обмена' : ''}
            </span>
            {copyError && (
              <div className="copy-fallback">
                <p>Скопируйте текст вручную:</p>
                <textarea
                  aria-label="Текст заявки"
                  readOnly
                  value={message}
                  onFocus={(event) => event.target.select()}
                  rows={6}
                />
              </div>
            )}
            <p className="booking-note summary-note">
              Запись будет подтверждена после ответа салона. Если SMS открылись без текста,
              скопируйте заявку. Также можно позвонить нам.
            </p>
            <a className="booking-phone" href={`tel:${salon.phone}`}>
              <Phone size={15} />
              {salon.phoneDisplay}
            </a>
            <button className="text-link edit-request" onClick={() => setStep(1)}>
              <ArrowLeft size={14} /> Изменить пожелания
            </button>
          </>
        )}
      </div>
    </dialog>
  )
}
