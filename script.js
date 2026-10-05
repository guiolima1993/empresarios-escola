// Ano dinâmico no rodapé
document.getElementById('year').textContent = new Date().getFullYear();

// Itens "trancados" que revelam o conteúdo ao clicar (cadeado -> desbloqueado)
document.querySelectorAll('.unlock-item').forEach((item) => {
  item.addEventListener('click', () => {
    if (item.classList.contains('unlocked')) return;
    item.classList.add('unlocked');
    const icon = item.querySelector('.unlock-icon');
    if (icon) icon.textContent = '🔓';
  });
});

// Accordion do FAQ
document.querySelectorAll('.faq-item').forEach((item) => {
  const question = item.querySelector('.faq-question');
  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach((openItem) => {
      if (openItem !== item) openItem.classList.remove('open');
    });
    item.classList.toggle('open', !isOpen);
  });
});

// Selo da Cheirin Bão: aparece só enquanto a seção dos fundadores está visível
const cornerBadge = document.getElementById('cornerBadge');
const foundersSection = document.getElementById('foundersSection');

if (cornerBadge && foundersSection) {
  const coffeeDecor = document.querySelector('.coffee-decor');
  const observer = new IntersectionObserver(
    ([entry]) => {
      cornerBadge.classList.toggle('visible', entry.isIntersecting);
      if (coffeeDecor) {
        coffeeDecor.classList.toggle('beans-in', entry.isIntersecting);
      }
    },
    { threshold: 0.2 }
  );
  observer.observe(foundersSection);
}

// Carrossel automático de logos das empresas parceiras
const partnerLogos = [
  'logo-aa-fruit-show-clube.png',
  'logo-aa-purssimo.png',
  'logo-aa-roots-start.png',
  'logo-academia-corpo-e-saude.png',
  'logo-acolhe-vida.png',
  'logo-al-sultan.png',
  'logo-alfabetizei.png',
  'logo-alucell.png',
  'logo-alugo.png',
  'logo-ar-de-limpeza.png',
  'logo-arca-pneus.png',
  'logo-assessoria-alpha-clube.png',
  'logo-ativus-pharma.png',
  'logo-avantar-seguros.png',
  'logo-aventura-kids.png',
  'logo-be-insanos.png',
  'logo-belari-gelato-clube.png',
  'logo-bem-querer.png',
  'logo-beng-aa.png',
  'logo-bm-vagas.png',
  'logo-boca-pop.png',
  'logo-body-health.png',
  'logo-box-one.png',
  'logo-br-barbearia-clube.png',
  'logo-br-pragas.png',
  'logo-brasil-berry.png',
  'logo-brazero-caf.png',
  'logo-brech-de-luxo-novo-de-novo.png',
  'logo-bruum-motos-master-motos.png',
  'logo-calebito-clube.png',
  'logo-campinas-celulares.png',
  'logo-chicken-town.png',
  'logo-conexo-praia.png',
  'logo-cs-sade.png',
  'logo-cu-de-minas.png',
  'logo-da-pa-virada.png',
  'logo-delicce-ice.png',
  'logo-depilese.png',
  'logo-dimpudim.png',
  'logo-discover-on.png',
  'logo-dr-farol.png',
  'logo-eh-gol.png',
  'logo-ekim.png',
  'logo-emici-burguer.png',
  'logo-espettus-na-brasa.png',
  'logo-essense-market.png',
  'logo-estao-campineira.png',
  'logo-facilitoy.png',
  'logo-facility-lar.png',
  'logo-facilmart-clube.png',
  'logo-falaguasta.png',
  'logo-for-rental.png',
  'logo-gelateria-moderna.png',
  'logo-grupo-way-foods.png',
  'logo-gut-gelados.png',
  'logo-haro.png',
  'logo-healthy-money.png',
  'logo-heris-do-hambrguer-esc.png',
  'logo-house-forneria.png',
  'logo-hummm-pizzas.png',
  'logo-ib-aa.png',
  'logo-ibrap-educao.png',
  'logo-ice-cream-roll.png',
  'logo-igo-mobilidade.png',
  'logo-ikka.png',
  'logo-ilha-bella-sorvetes-ltda.png',
  'logo-izu-master-roll.png',
  'logo-janpro.png',
  'logo-kaskata.png',
  'logo-kasko-clube.png',
  'logo-koocki.png',
  'logo-l-motos-litoral-mobilidade.png',
  'logo-la-femme.png',
  'logo-lave-e-pegue-clube.png',
  'logo-lave-go.png',
  'logo-lavme.png',
  'logo-lembrelembre.png',
  'logo-lian-sorvetes.png',
  'logo-limas-centro-automotivo.png',
  'logo-limpezaca.png',
  'logo-maroma-conselho.png',
  'logo-mega-cursos-brasil.png',
  'logo-mercado-do-sorvete.png',
  'logo-mikro-market-clube.png',
  'logo-more-cookies-clube.png',
  'logo-mov-fit.png',
  'logo-nacional-multas.png',
  'logo-oh-delicia-aa.png',
  'logo-optica-menina-dos-olhos.png',
  'logo-payperlav.png',
  'logo-pegg-market-clube.png',
  'logo-personaliza.png',
  'logo-piaseg-seguros.png',
  'logo-pigmentare.png',
  'logo-pizza-prime-clube.png',
  'logo-ponto-alpha-caf-clube.png',
  'logo-pra-comer-mdv.png',
  'logo-pride-commerce.png',
  'logo-prime-car-wash.png',
  'logo-rede-muniz-ecosspeed.png',
  'logo-rosa-mania.png',
  'logo-royal-parma.png',
  'logo-saldavee.png',
  'logo-salgados-quatro-estaes.png',
  'logo-sense-spa-express.png',
  'logo-seo-venncio.png',
  'logo-sessma.png',
  'logo-shiva-pastis.png',
  'logo-slimcenter.png',
  'logo-smart-system-garabetti.png',
  'logo-solsten.png',
  'logo-solumedi.png',
  'logo-sorvebom.png',
  'logo-star-happy-mdv.png',
  'logo-station-burger.png',
  'logo-studio-doutoras.png',
  'logo-studio-meu-cilios.png',
  'logo-sua-coxinha.png',
  'logo-sunflower.png',
  'logo-sushi-loko.png',
  'logo-terramaznia.png',
  'logo-tica-goes.png',
  'logo-ticas-joonker.png',
  'logo-top-english.png',
  'logo-trem-bo-deli.png',
  'logo-trevo-aa-clube.png',
  'logo-trx.png',
  'logo-uepa-sorvetes.png',
  'logo-vacinemais-clinica.png',
  'logo-vaviv.png',
  'logo-viriato-caf.png',
  'logo-vsd-seguros-start.png',
  'logo-yolo-tica.png',
  'logo-zerah.png',
  'logo-zeralotes.png',
];

const logoMarqueeTrack = document.getElementById('logoMarqueeTrack');
if (logoMarqueeTrack) {
  // Duplica a lista para o loop ficar contínuo (sem salto visível no fim da faixa)
  const doubled = [...partnerLogos, ...partnerLogos];
  logoMarqueeTrack.innerHTML = doubled
    .map((file) => `<img src="img/logos/${file}" alt="">`)
    .join('');

  // Mede a largura exata de uma volta completa (só depois que todas as imagens
  // carregarem) e usa esse valor em pixels no loop, em vez de 50% estimado —
  // assim o loop nunca deixa espaço vazio nem "pula" no ponto de emenda.
  const imgs = Array.from(logoMarqueeTrack.querySelectorAll('img'));
  const waitForImages = Promise.all(
    imgs.map((img) =>
      img.complete
        ? Promise.resolve()
        : new Promise((resolve) => {
            img.addEventListener('load', resolve, { once: true });
            img.addEventListener('error', resolve, { once: true });
          })
    )
  );

  const setMarqueeWidth = () => {
    const fullWidth = logoMarqueeTrack.scrollWidth;
    const halfWidth = fullWidth / 2;
    logoMarqueeTrack.style.setProperty('--marquee-shift', `-${halfWidth}px`);
  };

  waitForImages.then(setMarqueeWidth);
  window.addEventListener('resize', setMarqueeWidth);
}

// Contador animado dos números de destaque (sobe de 0 até o valor final ao entrar na tela)
function animateStatNumber(el) {
  const target = parseInt(el.dataset.target, 10);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(eased * target);
    el.textContent = prefix + value.toLocaleString('pt-BR') + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

const statNumbers = document.querySelectorAll('.stat-number[data-target]');
if (statNumbers.length) {
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateStatNumber(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  statNumbers.forEach((el) => statsObserver.observe(el));
}

// Envio do formulário de captura
const form = document.getElementById('captureForm');
const formSuccess = document.getElementById('formSuccess');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const data = Object.fromEntries(new FormData(form).entries());

  // TODO: integrar com o endpoint/CRM/Webhook responsável por receber o lead.
  // Exemplo:
  // fetch('https://seu-endpoint.com/leads', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data),
  // });

  console.log('Lead capturado:', data);

  form.hidden = true;
  formSuccess.hidden = false;
});

// Proteção básica de conteúdo (dissuasão contra cópia casual)
document.addEventListener('contextmenu', (e) => {
  if (!e.target.closest('input, textarea')) e.preventDefault();
});

document.addEventListener('dragstart', (e) => {
  if (e.target.tagName === 'IMG') e.preventDefault();
});

document.addEventListener('copy', (e) => {
  if (!e.target.closest('input, textarea')) e.preventDefault();
});

document.addEventListener('keydown', (e) => {
  const k = e.key.toLowerCase();
  const editing = e.target.closest('input, textarea');
  if (
    e.key === 'F12' ||
    (e.ctrlKey && !editing && ['s', 'u', 'p', 'c'].includes(k)) ||
    (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k))
  ) {
    e.preventDefault();
  }
});
