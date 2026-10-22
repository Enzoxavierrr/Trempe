import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { BrasaDot } from '../components/BrasaDot';
import { Reveal } from '../components/Reveal';
import s from './Landing.module.css';

type MenuItem = { name: string; desc: string; price: string };

const MENU: MenuItem[] = [
  { name: 'Milho na brasa', desc: 'queijo curado, pimenta-de-cheiro', price: 'R$ 28' },
  { name: 'Abóbora das cinzas', desc: 'castanha, missô', price: 'R$ 42' },
  { name: 'Peixe do dia', desc: 'folha de bananeira, caju', price: 'R$ 78' },
  { name: 'Costela 12 horas', desc: 'lenha, farofa de mandioca', price: 'R$ 92' },
  { name: 'Banana na brasa', desc: 'rapadura, canela', price: 'R$ 24' },
];

const CHAPTERS = [
  { id: 'cap1', num: '01', title: 'A primeira brasa' },
  { id: 'cap2', num: '02', title: 'A feira' },
  { id: 'cap3', num: '03', title: 'O tempo do fogo' },
  { id: 'cap4', num: '04', title: 'O cardápio' },
  { id: 'cap5', num: '05', title: 'A mesa' },
];

export function Landing() {
  const reduce = useReducedMotion();

  return (
    <div className={s.page}>
      {/* HEADER */}
      <header className={s.header}>
        <span className={s.brand}>Trempe</span>
        <nav aria-label="Capítulos" className={s.chapters}>
          {CHAPTERS.map((c) => (
            <a key={c.id} href={`#${c.id}`}>
              <span className={s.chapterNum}>{c.num}</span>
              {c.title}
            </a>
          ))}
        </nav>
        <Link to="/reservar" className={s.cta}>
          Reservar
        </Link>
      </header>

      {/* HERO */}
      <section className={s.hero}>
        <motion.h1
          className={s.heroTitle}
          initial={reduce ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          Tudo começou
          <br />
          com uma <span className={s.italic}>brasa</span>
          <BrasaDot />
        </motion.h1>
        <motion.p
          className={s.heroSub}
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          trem·pe, s.f. — o apoio de ferro que segura a panela sobre o fogo.
          <br />
          <br />
          Uma história em cinco capítulos — e um convite no final.
        </motion.p>
      </section>

      {/* CAP 01 */}
      <section id="cap1" className={s.chapter}>
        <Reveal as="p">
          <p className={s.chapterLabel}>
            Capítulo 01
            <br />
            [ANO]
          </p>
        </Reveal>
        <div className={s.chapterBody}>
          <Reveal>
            <div className={s.chapterText}>
              <h2>
                A primeira <span className={s.italic}>brasa</span>
              </h2>
              <p>
                Num fogão a lenha de família, alguém aprendeu cedo que o fogo não se
                apressa. Ele se cuida. [CONTE AQUI A ORIGEM REAL DA CASA.]
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div aria-hidden="true" className={s.shape}>
              <motion.div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'var(--brasa)',
                }}
                animate={reduce ? {} : { scale: [1, 1.15, 1] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* CAP 02 */}
      <section id="cap2" className={s.chapter}>
        <Reveal>
          <p className={s.chapterLabel}>
            Capítulo 02
            <br />
            Toda semana
          </p>
        </Reveal>
        <div className={s.chapterBody}>
          <Reveal>
            <div className={s.chapterText}>
              <h2>
                A <span className={s.italic}>feira</span> decide
              </h2>
              <p>
                O cardápio não nasce na cozinha, nasce na banca. O que chega de manhã
                vira prato à noite — e o que acaba, acabou.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div
              aria-hidden="true"
              className={s.shape}
              style={{ position: 'relative' }}
            >
              <motion.div
                style={{
                  position: 'absolute',
                  width: 120,
                  height: 120,
                  left: 60,
                  top: 24,
                  borderRadius: '50%',
                  background: 'var(--amber)',
                }}
                animate={reduce ? {} : { y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div
                style={{
                  position: 'absolute',
                  width: 240,
                  height: 120,
                  left: 0,
                  bottom: 0,
                  borderRadius: '120px 120px 0 0',
                  background: 'var(--olive)',
                }}
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* CAP 03 */}
      <section id="cap3" className={s.chapter}>
        <Reveal>
          <p className={s.chapterLabel}>
            Capítulo 03
            <br />
            12 horas
          </p>
        </Reveal>
        <div className={s.timeChapter}>
          <Reveal>
            <h2 className={s.timeTitle}>
              O fogo tem
              <br />o seu <span className={s.accent}>tempo</span>.
            </h2>
          </Reveal>
          <div className={s.timeRow}>
            <Reveal delay={0.1}>
              <motion.div
                aria-hidden="true"
                className={s.bigEmber}
                animate={
                  reduce
                    ? {}
                    : {
                        boxShadow: [
                          '0 0 0 0 rgba(167,50,28,0)',
                          '0 0 0 36px rgba(167,50,28,0.08)',
                          '0 0 0 0 rgba(167,50,28,0)',
                        ],
                      }
                }
                transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
              />
            </Reveal>
            <Reveal delay={0.2} as="p">
              <p className={s.timeCopy}>
                A costela fica a noite inteira sobre a lenha. A abóbora dorme nas
                cinzas. Nada sai antes da hora — nem a gente.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CAP 04 — CARDÁPIO */}
      <section id="cap4" className={s.menuSection}>
        <Reveal>
          <p className={s.chapterLabel}>
            Capítulo 04
            <br />
            Desta semana
          </p>
        </Reveal>
        <div className={s.menuBody}>
          <Reveal>
            <h2>
              O que o fogo <span className={s.italic}>entregou</span>
            </h2>
          </Reveal>
          <ul className={s.menuList} style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {MENU.map((item, i) => (
              <motion.li
                key={item.name}
                className={s.menuItem}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-15% 0px' }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className={s.menuItemText}>
                  <span className={s.menuName}>{item.name}</span>
                  <span className={s.menuDesc}>{item.desc}</span>
                </div>
                <span className={s.menuPrice}>{item.price}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* CAP 05 — A MESA */}
      <section id="cap5" className={s.table}>
        <div className={s.tableInner}>
          <Reveal>
            <p className={s.tableLabel}>
              Capítulo 05
              <br />O final é seu
            </p>
          </Reveal>
          <div className={s.tableBody}>
            <div className={s.tableHead}>
              <Reveal>
                <h2 className={s.tableTitle}>
                  Falta só
                  <br />
                  <span className={s.italic}>você</span> na mesa.
                </h2>
              </Reveal>
              <Reveal delay={0.15}>
                <motion.div
                  aria-hidden="true"
                  className={s.tableShape}
                  animate={reduce ? {} : { rotate: [0, 360] }}
                  transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: 'var(--brasa)',
                    }}
                  />
                </motion.div>
              </Reveal>
            </div>
            <div className={s.tableFoot}>
              <dl className={s.infoGrid}>
                <div className={s.infoItem}>
                  <dt>Endereço</dt>
                  <dd>Rua da Lenha, 00 — Centro</dd>
                </div>
                <div className={s.infoItem}>
                  <dt>Horário</dt>
                  <dd>Qua a Dom · 19h–23h</dd>
                </div>
                <div className={s.infoItem}>
                  <dt>Telefone</dt>
                  <dd>(00) 0000-0000</dd>
                </div>
              </dl>
              <Link to="/reservar" className={s.reserveBtn}>
                Reservar mesa
                <BrasaDot size="0.5em" color="var(--brasa)" pulse={false} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* RODAPÉ */}
      <footer className={s.footer}>
        <span>Trempe</span>
        <a href="#">Instagram</a>
        <span>[CIDADE]</span>
      </footer>
    </div>
  );
}
