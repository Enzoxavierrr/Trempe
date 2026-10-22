import { useMemo, useReducer } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { BrasaDot } from '../components/BrasaDot';
import s from './Reserva.module.css';

type State = {
  guests: number;
  dayIdx: number;
  time: string | null;
  name: string;
  phone: string;
  email: string;
  notes: string;
  confirmed: boolean;
};

type Action =
  | { type: 'guests'; n: number }
  | { type: 'day'; i: number }
  | { type: 'time'; t: string }
  | { type: 'field'; key: 'name' | 'phone' | 'email' | 'notes'; value: string }
  | { type: 'confirm' }
  | { type: 'edit' };

const initial: State = {
  guests: 2,
  dayIdx: 0,
  time: null,
  name: '',
  phone: '',
  email: '',
  notes: '',
  confirmed: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'guests':
      return { ...state, guests: action.n };
    case 'day':
      return { ...state, dayIdx: action.i, time: null };
    case 'time':
      return { ...state, time: action.t };
    case 'field':
      return { ...state, [action.key]: action.value };
    case 'confirm':
      return { ...state, confirmed: true };
    case 'edit':
      return { ...state, confirmed: false };
  }
}

const SLOTS = ['19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'];
const GUEST_OPTS = [1, 2, 3, 4, 5, 6, 7, 8];

function buildDays() {
  const out = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const wk =
      i === 0
        ? 'hoje'
        : d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
    out.push({
      wk,
      num: String(d.getDate()),
      aria: d.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      }),
      short: d
        .toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })
        .replace(/\./g, ''),
    });
  }
  return out;
}

function cx(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export function Reserva() {
  const [state, dispatch] = useReducer(reducer, initial);
  const reduce = useReducedMotion();

  const days = useMemo(buildDays, []);

  // Horários indisponíveis — hoje lota cedo, outros dias lotam no pico
  const unavailable = useMemo(
    () => (state.dayIdx === 0 ? ['20:00', '20:30'] : ['21:00']),
    [state.dayIdx],
  );

  const ready = !!state.time && state.name.trim().length > 0 && state.phone.trim().length > 0;

  const hint = !state.time
    ? 'Escolha um horário para continuar.'
    : !state.name.trim() || !state.phone.trim()
      ? 'Falta seu nome e telefone.'
      : 'Tudo certo. É só confirmar.';

  const guestsLabel = state.guests === 1 ? '1 pessoa' : `${state.guests} pessoas`;
  const dayLabel = days[state.dayIdx].short;
  const timeLabel = state.time ?? '—';
  const firstName = state.name.trim().split(' ')[0] || 'até já';

  const handleConfirm = () => {
    if (ready) dispatch({ type: 'confirm' });
  };

  return (
    <div className={s.page}>
      <header className={s.header}>
        <Link to="/" className={s.brand}>
          Trempe
        </Link>
        <Link to="/" className={s.back}>
          ← Voltar à história
        </Link>
      </header>

      <AnimatePresence mode="wait">
        {!state.confirmed ? (
          <motion.main
            key="editing"
            className={s.main}
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={s.intro}>
              <h1 className={s.title}>
                Reserve
                <br />
                sua <span className={s.italic}>mesa</span>
                <BrasaDot />
              </h1>
              <p>Quatro passos. A confirmação chega no seu telefone.</p>
            </div>

            <div className={s.grid}>
              <div className={s.steps}>
                {/* 01 pessoas */}
                <fieldset className={s.step}>
                  <legend className={s.stepLegend}>
                    01
                    <br />
                    Quantas pessoas
                  </legend>
                  <div className={s.stepField}>
                    {GUEST_OPTS.map((n) => {
                      const on = state.guests === n;
                      return (
                        <motion.button
                          key={n}
                          type="button"
                          aria-pressed={on}
                          whileTap={{ scale: 0.94 }}
                          className={cx(s.guestBtn, on && s.guestBtnOn)}
                          onClick={() => dispatch({ type: 'guests', n })}
                        >
                          {n}
                        </motion.button>
                      );
                    })}
                  </div>
                  <p className={s.stepHint}>
                    Mais de 8 pessoas? Fale com a gente: (00) 0000-0000
                  </p>
                </fieldset>

                {/* 02 dia */}
                <fieldset className={s.step}>
                  <legend className={s.stepLegend}>
                    02
                    <br />
                    Qual dia
                  </legend>
                  <div className={s.stepField}>
                    {days.map((d, i) => {
                      const on = state.dayIdx === i;
                      return (
                        <motion.button
                          key={i}
                          type="button"
                          aria-pressed={on}
                          aria-label={d.aria}
                          whileTap={{ scale: 0.94 }}
                          className={cx(s.dayBtn, on && s.dayBtnOn)}
                          onClick={() => dispatch({ type: 'day', i })}
                        >
                          <span className={s.dayWk}>{d.wk}</span>
                          <span className={s.dayNum}>{d.num}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </fieldset>

                {/* 03 horário */}
                <fieldset className={s.step}>
                  <legend className={s.stepLegend}>
                    03
                    <br />
                    Que horas
                  </legend>
                  <div className={s.stepField}>
                    {SLOTS.map((t) => {
                      const off = unavailable.includes(t);
                      const on = state.time === t;
                      return (
                        <motion.button
                          key={t}
                          type="button"
                          disabled={off}
                          aria-pressed={on}
                          whileTap={off ? undefined : { scale: 0.95 }}
                          className={cx(
                            s.slotBtn,
                            on && s.slotBtnOn,
                            off && s.slotBtnDead,
                          )}
                          onClick={() => dispatch({ type: 'time', t })}
                        >
                          {t}
                        </motion.button>
                      );
                    })}
                  </div>
                </fieldset>

                {/* 04 dados */}
                <fieldset className={s.step}>
                  <legend className={s.stepLegend}>
                    04
                    <br />
                    Seus dados
                  </legend>
                  <div className={s.dataField}>
                    <div className={cx(s.inputWrap, s.col2)}>
                      <label htmlFor="r-nome">Nome</label>
                      <input
                        id="r-nome"
                        type="text"
                        autoComplete="name"
                        value={state.name}
                        placeholder="Como devemos te chamar"
                        className={s.input}
                        onChange={(e) =>
                          dispatch({ type: 'field', key: 'name', value: e.target.value })
                        }
                      />
                    </div>
                    <div className={s.inputWrap}>
                      <label htmlFor="r-tel">Telefone / WhatsApp</label>
                      <input
                        id="r-tel"
                        type="tel"
                        autoComplete="tel"
                        value={state.phone}
                        placeholder="(00) 00000-0000"
                        className={s.input}
                        onChange={(e) =>
                          dispatch({ type: 'field', key: 'phone', value: e.target.value })
                        }
                      />
                    </div>
                    <div className={s.inputWrap}>
                      <label htmlFor="r-email">E-mail (opcional)</label>
                      <input
                        id="r-email"
                        type="email"
                        autoComplete="email"
                        value={state.email}
                        placeholder="voce@email.com"
                        className={s.input}
                        onChange={(e) =>
                          dispatch({ type: 'field', key: 'email', value: e.target.value })
                        }
                      />
                    </div>
                    <div className={cx(s.inputWrap, s.col2)}>
                      <label htmlFor="r-obs">Algo que a cozinha deva saber?</label>
                      <textarea
                        id="r-obs"
                        rows={2}
                        value={state.notes}
                        placeholder="Aniversário, restrição alimentar, cadeira de bebê…"
                        className={s.textarea}
                        onChange={(e) =>
                          dispatch({ type: 'field', key: 'notes', value: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </fieldset>
              </div>

              {/* RESUMO */}
              <aside aria-label="Resumo da reserva" className={s.summary}>
                <div className={s.summaryHead}>
                  <span>Sua reserva</span>
                  <motion.span
                    aria-hidden="true"
                    className={s.summaryEmber}
                    animate={
                      reduce
                        ? {}
                        : {
                            boxShadow: [
                              '0 0 0 0 rgba(167,50,28,0)',
                              '0 0 0 8px rgba(167,50,28,0.25)',
                              '0 0 0 0 rgba(167,50,28,0)',
                            ],
                          }
                    }
                    transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </div>
                <p className={s.summaryText}>
                  <AnimatedField value={guestsLabel} />,
                  <br />
                  <span className={s.italic}>
                    <AnimatedField value={dayLabel} />
                  </span>
                  ,
                  <br />
                  às <AnimatedField value={timeLabel} />.
                </p>
                <dl className={s.summaryList}>
                  <div className={s.summaryRow}>
                    <dt>Mesa</dt>
                    <dd>Salão, perto do fogo</dd>
                  </div>
                  <div className={s.summaryRow}>
                    <dt>Tolerância</dt>
                    <dd>15 min</dd>
                  </div>
                  <div className={s.summaryRow}>
                    <dt>Cancelamento</dt>
                    <dd>Até 2h antes</dd>
                  </div>
                </dl>
                <motion.button
                  type="button"
                  className={s.confirmBtn}
                  disabled={!ready}
                  whileTap={ready ? { scale: 0.97 } : undefined}
                  onClick={handleConfirm}
                >
                  Confirmar reserva
                </motion.button>
                <p className={s.hint}>{hint}</p>
              </aside>
            </div>
          </motion.main>
        ) : (
          <motion.main
            key="confirmed"
            className={s.doneMain}
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.p
              className={s.doneLabel}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              Reserva confirmada
            </motion.p>
            <motion.h1
              className={s.doneTitle}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              Até <span className={s.italic}>logo</span>,
              <br />
              {firstName}
              <BrasaDot />
            </motion.h1>
            <motion.div
              className={s.doneFoot}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <p>
                {guestsLabel}, {dayLabel}, às {timeLabel}. A trempe vai estar no fogo.
              </p>
              <div className={s.doneActions}>
                <button
                  type="button"
                  className={s.pillOutline}
                  onClick={() => dispatch({ type: 'edit' })}
                >
                  Alterar reserva
                </button>
                <Link to="/" className={s.pillSolid}>
                  Voltar ao início
                </Link>
              </div>
            </motion.div>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Soft crossfade when the summary values change. */
function AnimatedField({ value }: { value: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{value}</>;
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={value}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.3 }}
        style={{ display: 'inline-block' }}
      >
        {value}
      </motion.span>
    </AnimatePresence>
  );
}
