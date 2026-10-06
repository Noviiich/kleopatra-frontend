import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  MapPin,
  Menu,
  Phone,
  Plus,
  Scissors,
  Sparkles,
  X,
} from 'lucide-react'
import Brand, { Emblem } from './components/Brand'
import { assetUrl } from './assets'
import { faqs, inspirations, salon, services, type ServiceId } from './data'

const Booking = lazy(() => import('./components/Booking'))
const nav = [
  { href: '#services', label: 'Услуги' },
  { href: '#philosophy', label: 'Философия' },
  { href: '#inspiration', label: 'Вдохновение' },
  { href: '#contacts', label: 'Контакты' },
]

function App() {
  const [booking, setBooking] = useState<ServiceId | 'consult' | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeService, setActiveService] = useState(0)
  const [category, setCategory] = useState('all')
  const [faq, setFaq] = useState<number | null>(null)
  const [privacy, setPrivacy] = useState(false)
  const [stickyVisible, setStickyVisible] = useState(false)
  const heroRef = useRef<HTMLElement>(null)
  const menuRef = useRef<HTMLDialogElement>(null)
  const menuTriggerRef = useRef<HTMLButtonElement>(null)
  const privacyRef = useRef<HTMLDialogElement>(null)
  const privacyTriggerRef = useRef<HTMLButtonElement>(null)

  function openBooking(service: ServiceId | 'consult' = 'consult') {
    setMenuOpen(false)
    setBooking(service)
  }

  useEffect(() => {
    if (!heroRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry.isIntersecting),
      { threshold: 0.15 },
    )
    observer.observe(heroRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    menuRef.current?.showModal()
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
      menuTriggerRef.current?.focus()
    }
  }, [menuOpen])

  useEffect(() => {
    if (!privacy) return
    privacyRef.current?.showModal()
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
      privacyTriggerRef.current?.focus()
    }
  }, [privacy])

  return (
    <>
      <a className="skip-link" href="#main">
        Перейти к содержимому
      </a>
      <header className="site-header" id="home">
        <Brand />
        <nav className="desktop-nav" aria-label="Основная навигация">
          {nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <a className="header-phone" href={`tel:${salon.phone}`}>
            {salon.phoneDisplay}
          </a>
          <button className="button header-book" onClick={() => openBooking()}>
            Записаться <ArrowUpRight size={17} />
          </button>
          <button
            ref={menuTriggerRef}
            className="icon-button menu-toggle"
            onClick={() => setMenuOpen(true)}
            aria-label="Открыть меню"
            aria-expanded={menuOpen}
          >
            <Menu size={25} />
          </button>
        </div>
      </header>

      <main id="main">
        <section className="hero" ref={heroRef} aria-labelledby="hero-heading">
          <div className="hero-content">
            <div className="hero-eyebrow">
              <span className="little-line" />
              ПАРИКМАХЕРСКАЯ · ОРЁЛ
            </div>
            <h1 id="hero-heading">
              Красота
              <br />
              <em>быть собой.</em>
            </h1>
            <p className="hero-description">
              Ваши волосы. Ваш характер.
              <br />
              Мы лишь помогаем им раскрыться.
            </p>
            <button className="button button-cream hero-cta" onClick={() => openBooking()}>
              Записаться в салон <ArrowUpRight size={19} />
            </button>
            <div className="hero-bottom">
              <a href="#services">
                Откройте для себя Клеопатру <ArrowDown size={16} />
              </a>
              <span>01 — 04</span>
            </div>
          </div>
          <div className="hero-image-wrap">
            <img
              className="hero-image"
              src={assetUrl('images/hero.webp')}
              srcSet={`${assetUrl('images/hero-small.webp')} 640w, ${assetUrl('images/hero-medium.webp')} 800w, ${assetUrl('images/hero.webp')} 1122w`}
              sizes="(max-width: 760px) 100vw, 55vw"
              alt="Мягкие каштановые волны, естественная красота волос"
              width="1122"
              height="1402"
              fetchPriority="high"
            />
            <span className="image-caption">ЕСТЕСТВЕННО. ИНДИВИДУАЛЬНО. ВАШЕ.</span>
            <div className="hero-image-bottom">
              <span>
                Искусство чувствовать
                <br />
                <em>вашу красоту.</em>
              </span>
              <div className="round-seal">
                <span>ВНИМАНИЕ К ДЕТАЛЯМ</span>
                <Emblem />
                <span>КЛЕОПАТРА · ОРЁЛ</span>
              </div>
            </div>
          </div>
        </section>

        <div className="intro-strip section-container">
          <p className="intro-statement">
            Больше, чем новая причёска.
            <br />
            <em>Новое ощущение себя.</em>
          </p>
          <div className="intro-value">
            <Scissors size={23} strokeWidth={1.2} />
            <span>
              Точность в каждой
              <br />
              линии
            </span>
          </div>
          <div className="intro-value">
            <Sparkles size={23} strokeWidth={1.2} />
            <span>
              Бережное отношение
              <br />к вашим волосам
            </span>
          </div>
          <div className="intro-value">
            <Emblem />
            <span>
              Красота, в которой
              <br />
              комфортно вам
            </span>
          </div>
        </div>

        <section
          id="services"
          className="services-section section-container section-space"
          aria-labelledby="services-heading"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                <span />
                01 / МЕНЮ КРАСОТЫ
              </p>
              <h2 id="services-heading">
                Именно то,
                <br />
                <em>что идёт вам.</em>
              </h2>
            </div>
            <p className="section-description">
              Продуманная форма, живой цвет и уход,
              <br className="desktop-break" /> который чувствуется. Выберите своё —
              <br className="desktop-break" /> об остальном позаботимся мы.
            </p>
          </div>
          <div className="services-layout">
            <div className="services-list">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  className={`service-item ${activeService === index ? 'active' : ''}`}
                >
                  <h3>
                    <button
                      className="service-toggle"
                      onClick={() => setActiveService(index)}
                      aria-expanded={activeService === index}
                      aria-controls={`service-panel-${service.id}`}
                    >
                      <span className="service-number">{service.number}</span>
                      <span>{service.name}</span>
                      <span className="service-symbol">
                        {activeService === index ? (
                          <ArrowUpRight size={24} strokeWidth={1.3} />
                        ) : (
                          <Plus size={22} strokeWidth={1.3} />
                        )}
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`service-panel-${service.id}`}
                    hidden={activeService !== index}
                    className="service-panel"
                  >
                    <p>{service.description}</p>
                    <ul>
                      {service.details.map((detail) => (
                        <li key={detail}>{detail}</li>
                      ))}
                    </ul>
                    <button className="text-link" onClick={() => openBooking(service.id)}>
                      Записаться <ArrowUpRight size={17} />
                    </button>
                  </div>
                </div>
              ))}
              <p className="price-note">
                Стоимость зависит от длины волос и выбранной техники.
                <br />
                Все детали обсудим до начала работы.
              </p>
            </div>
            <div className="service-image">
              <img
                key={services[activeService].id}
                src={services[activeService].image}
                srcSet={`${services[activeService].image.replace('.webp', '-small.webp')} 400w, ${services[activeService].image} 800w`}
                sizes="(max-width: 760px) calc(100vw - 48px), 42vw"
                alt={services[activeService].alt}
                loading="lazy"
                width="800"
                height="1000"
              />
              <div className="service-image-label">
                <span>{services[activeService].tag}</span>
                <span>{services[activeService].number} / 04</span>
              </div>
            </div>
          </div>
        </section>

        <section
          id="philosophy"
          className="philosophy-section"
          aria-labelledby="philosophy-heading"
        >
          <div className="section-container philosophy-layout">
            <div className="philosophy-visual">
              <div className="interior-frame">
                <img
                  src={assetUrl('images/salon.webp')}
                  srcSet={`${assetUrl('images/salon-small.webp')} 640w, ${assetUrl('images/salon.webp')} 1100w`}
                  sizes="(max-width: 760px) calc(100vw - 48px), 42vw"
                  alt="Интерьерное вдохновение: тёплый свет, овальное зеркало и уютное кресло"
                  width="1100"
                  height="825"
                  loading="lazy"
                />
                <span className="mood-caption">ЭСТЕТИКА НАШЕГО НАСТРОЕНИЯ</span>
              </div>
              <div className="philosophy-image-caption">
                <span>МЕСТО ДЛЯ ВАС</span>
                <span>И немного времени для себя.</span>
              </div>
            </div>
            <div className="philosophy-content">
              <p className="eyebrow">
                <span />
                02 / ФИЛОСОФИЯ
              </p>
              <h2 id="philosophy-heading">
                Сначала — вы.
                <br />
                <em>Потом — всё остальное.</em>
              </h2>
              <p className="philosophy-lead">
                Хороший образ начинается не с ножниц.
                <br />
                Он начинается с разговора.
              </p>
              <p className="body-copy">
                Как вы живёте, что любите, какой хотите себя видеть. Нам важно услышать вас — чтобы
                отражение в зеркале было не просто красивым, а по-настоящему вашим.
              </p>
              <div className="philosophy-principles">
                <div>
                  <span>01</span>
                  <p>Слушаем и понимаем</p>
                </div>
                <div>
                  <span>02</span>
                  <p>Подчёркиваем индивидуальность</p>
                </div>
                <div>
                  <span>03</span>
                  <p>Заботимся о результате каждый день</p>
                </div>
              </div>
              <a className="text-link" href="#contacts">
                Будем рады знакомству <ArrowUpRight size={17} />
              </a>
            </div>
          </div>
        </section>

        <section
          id="inspiration"
          className="inspiration-section section-container section-space"
          aria-labelledby="inspiration-heading"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                <span />
                03 / ВДОХНОВЕНИЕ
              </p>
              <h2 id="inspiration-heading">
                Ваш следующий
                <br />
                <em>любимый образ.</em>
              </h2>
            </div>
            <div className="inspiration-description">
              <p className="section-description">
                Иногда всё начинается с одного взгляда.
                <br />
                Сохраните настроение, а мы адаптируем
                <br className="desktop-break" /> его под вас.
              </p>
              <span className="editorial-note">Подборка образов для вдохновения</span>
            </div>
          </div>
          <div className="gallery-filters" role="group" aria-label="Фильтр образов">
            {[
              { id: 'all', label: 'Все образы' },
              { id: 'cut', label: 'Стрижки' },
              { id: 'color', label: 'Окрашивание' },
              { id: 'style', label: 'Укладки' },
            ].map((filter) => (
              <button
                key={filter.id}
                aria-pressed={category === filter.id}
                className={category === filter.id ? 'active' : ''}
                onClick={() => setCategory(filter.id)}
              >
                {filter.label}
                {category === filter.id && <span className="filter-dot" />}
              </button>
            ))}
          </div>
          <div className="inspiration-grid">
            {inspirations
              .filter((item) => category === 'all' || item.category === category)
              .map((item, index) => (
                <button
                  className="inspiration-card"
                  key={item.title}
                  onClick={() => openBooking(item.service)}
                  aria-label={`${item.title}. ${item.subtitle}. Записаться на этот образ`}
                >
                  <div className="inspiration-image">
                    <img
                      src={item.image}
                      srcSet={`${item.image.replace('.webp', '-small.webp')} 400w, ${item.image} 800w`}
                      sizes="(max-width: 760px) calc(50vw - 31px), (max-width: 1000px) calc(50vw - 46px), 22vw"
                      alt={item.title}
                      width="800"
                      height="1000"
                      loading="lazy"
                    />
                    <span className="inspiration-image-index" aria-hidden="true">
                      0{index + 1}
                    </span>
                    <span className="inspiration-action">
                      <ArrowUpRight size={22} strokeWidth={1.3} />
                    </span>
                  </div>
                  <div className="inspiration-card-caption">
                    <h3>{item.title}</h3>
                    <p>{item.subtitle}</p>
                  </div>
                </button>
              ))}
          </div>
          <p className="gallery-note">
            Визуальная история бренда: образы созданы для вдохновения и не являются фотографиями
            работ салона.
          </p>
        </section>

        <section className="invitation" aria-labelledby="invitation-heading">
          <div className="invitation-lines" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="invitation-content">
            <Emblem />
            <p className="eyebrow">ПОЗВОЛЬТЕ СЕБЕ НЕМНОГО БОЛЬШЕ</p>
            <h2 id="invitation-heading">
              Хороший день начинается
              <br />
              <em>с любви к себе.</em>
            </h2>
            <p>А новый образ — с одного простого шага.</p>
            <button className="button button-cream" onClick={() => openBooking()}>
              Выбрать время для себя <ArrowUpRight size={18} />
            </button>
            <span className="invitation-footnote">
              <Check size={13} /> Обсудим ваши пожелания перед визитом
            </span>
          </div>
        </section>

        <section
          className="faq-section section-container section-space"
          aria-labelledby="faq-heading"
        >
          <div className="faq-intro">
            <p className="eyebrow">
              <span />
              ПЕРЕД ВИЗИТОМ
            </p>
            <h2 id="faq-heading">
              Всё начинается
              <br />
              <em>с доверия.</em>
            </h2>
            <p className="body-copy">
              Ответы на маленькие вопросы
              <br />
              перед большими переменами.
            </p>
          </div>
          <div className="faq-list">
            {faqs.map((item, index) => (
              <div className={`faq-item ${faq === index ? 'open' : ''}`} key={item.question}>
                <h3>
                  <button
                    aria-expanded={faq === index}
                    aria-controls={`faq-answer-${index}`}
                    onClick={() => setFaq(faq === index ? null : index)}
                  >
                    {item.question}
                    <Plus size={20} strokeWidth={1.4} />
                  </button>
                </h3>
                <div id={`faq-answer-${index}`} hidden={faq !== index} className="faq-answer">
                  <p>{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          id="contacts"
          className="contacts-section section-container"
          aria-labelledby="contacts-heading"
        >
          <div className="contact-main">
            <p className="eyebrow">
              <span />
              04 / ДО ВСТРЕЧИ В КЛЕОПАТРЕ
            </p>
            <h2 id="contacts-heading">
              Ваше место
              <br />
              <em>быть красивой.</em>
            </h2>
            <div className="contact-address">
              <MapPin size={21} strokeWidth={1.3} />
              <div>
                <p>
                  г. {salon.city}, {salon.address}
                </p>
                <span>Время визита согласуем при записи</span>
              </div>
            </div>
            <a className="text-link" href={salon.mapUrl} target="_blank" rel="noopener noreferrer">
              Построить маршрут <ArrowUpRight size={17} />
            </a>
          </div>
          <div className="contact-card">
            <span className="eyebrow">ДАВАЙТЕ НАЧНЁМ С РАЗГОВОРА</span>
            <a className="contact-phone" href={`tel:${salon.phone}`}>
              {salon.phoneDisplay}
            </a>
            <p>
              Поможем выбрать услугу, обсудим детали
              <br />и найдём удобное время для встречи.
            </p>
            <button className="button button-dark" onClick={() => openBooking()}>
              Записаться на визит <ArrowUpRight size={18} />
            </button>
            <a href={`tel:${salon.phone}`} className="contact-call">
              <Phone size={15} /> Или просто позвоните нам
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer section-container">
        <div className="footer-top">
          <Brand footer />
          <p>Ваша красота. Ваша история.</p>
          <a href="#home" className="back-to-top" aria-label="Наверх">
            <ArrowRight size={23} strokeWidth={1.2} />
          </a>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Клеопатра</span>
          <span>С вниманием к вам, в Орле.</span>
          <button ref={privacyTriggerRef} onClick={() => setPrivacy(true)}>
            Конфиденциальность
          </button>
        </div>
      </footer>

      <div
        className={`mobile-booking-bar ${stickyVisible && !booking && !menuOpen ? 'visible' : ''}`}
        inert={!stickyVisible || !!booking || menuOpen}
      >
        <a href={`tel:${salon.phone}`} aria-label="Позвонить в Клеопатру">
          <Phone size={20} />
        </a>
        <button className="button button-dark" onClick={() => openBooking()}>
          Записаться <ArrowUpRight size={18} />
        </button>
      </div>

      {menuOpen && (
        <dialog
          ref={menuRef}
          className="mobile-menu"
          aria-label="Меню сайта"
          onCancel={(event) => {
            event.preventDefault()
            setMenuOpen(false)
          }}
        >
          <div className="mobile-menu-top">
            <Brand />
            <button
              className="icon-button"
              aria-label="Закрыть меню"
              onClick={() => setMenuOpen(false)}
            >
              <X size={24} />
            </button>
          </div>
          <nav aria-label="Мобильная навигация">
            {nav.map((item, index) => (
              <a href={item.href} key={item.href} onClick={() => setMenuOpen(false)}>
                <span>0{index + 1}</span>
                {item.label}
                <ArrowUpRight size={23} />
              </a>
            ))}
          </nav>
          <div className="mobile-menu-bottom">
            <span>
              г. {salon.city}, {salon.address}
            </span>
            <a href={`tel:${salon.phone}`}>{salon.phoneDisplay}</a>
            <button className="button button-dark" onClick={() => openBooking()}>
              Записаться <ArrowUpRight size={18} />
            </button>
          </div>
        </dialog>
      )}

      {booking && (
        <Suspense
          fallback={
            <div role="status" className="loading-booking">
              Открываем запись…
            </div>
          }
        >
          <Booking initialService={booking} onClose={() => setBooking(null)} />
        </Suspense>
      )}

      {privacy && (
        <dialog
          ref={privacyRef}
          className="privacy-dialog"
          aria-labelledby="privacy-heading"
          onCancel={(event) => {
            event.preventDefault()
            setPrivacy(false)
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) setPrivacy(false)
          }}
        >
          <div>
            <button
              className="icon-button privacy-close"
              aria-label="Закрыть информацию"
              onClick={() => setPrivacy(false)}
            >
              <X size={21} />
            </button>
            <p className="eyebrow">КОНФИДЕНЦИАЛЬНОСТЬ</p>
            <h2 id="privacy-heading">Ваши данные</h2>
            <p>
              Форма записи работает в вашем браузере. Введённые имя, дата и пожелания не сохраняются
              на сервере сайта и не передаются салону автоматически.
            </p>
            <p>
              Кнопка «Отправить SMS» открывает ваше приложение для сообщений с подготовленным
              текстом. Вы самостоятельно отправляете сообщение на номер {salon.phoneDisplay}.
              Стоимость SMS зависит от тарифа вашего оператора.
            </p>
            <p>
              На сайте нет аналитических и рекламных cookies. При переходе в Яндекс Карты действуют
              правила этого сервиса. По вопросам переданной салону информации звоните:{' '}
              <a href={`tel:${salon.phone}`}>{salon.phoneDisplay}</a>.
            </p>
            <button className="button button-dark" onClick={() => setPrivacy(false)}>
              Понятно <Check size={17} />
            </button>
          </div>
        </dialog>
      )}
    </>
  )
}

export default App
