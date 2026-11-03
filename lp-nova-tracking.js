/**
 * lp-nova-tracking.js
 * Rastreamento da LP X Franchise (empresários / franqueadores-v2).
 *
 * Responsabilidades:
 * 1. Repassar os UTMs (e outros parâmetros de origem) da URL da LP para o
 *    iframe do formulário do CRM.
 * 2. Disparar os eventos do Meta Pixel: video_play, cta_click, form_view,
 *    lead_form e video_progress (uma única vez cada marco, por carregamento
 *    de página).
 *
 * Requisitos:
 * - O Pixel base (fbq init + PageView) já deve estar carregado no <head>.
 * - Este script deve ser chamado no fim do <body>, depois do iframe do
 *   formulário: <script src="lp-nova-tracking.js"></script>
 */
(function () {
  'use strict';

  var FORM_IFRAME_ID = 'nf-3953c02c-0840-427f-892f-7b043b974a1d';
  var FORM_SECTION_ID = 'form';
  var CASE_VIDEO_SELECTOR = '.case-video';
  var CTA_SELECTOR = '.btn-primary, [data-track-cta]';
  // Origem do CRM que hospeda o formulário embutido no iframe.
  var FORM_ORIGIN = 'https://interno.xfranchise.com.br';

  var firedEvents = {};

  function fireEvent(eventName, params) {
    if (firedEvents[eventName]) return;
    firedEvents[eventName] = true;

    if (typeof window.fbq === 'function') {
      window.fbq('trackCustom', eventName, params || {});
    }

    // Log auxiliar para conferência durante os testes (Pixel Helper / console).
    if (window.console && console.debug) {
      console.debug('[lp-nova-tracking] evento disparado:', eventName, params || {});
    }
  }

  // ---------------------------------------------------------------------
  // 1. Repassar UTMs e parâmetros de origem para o iframe do formulário
  // ---------------------------------------------------------------------
  function forwardUtmsToForm() {
    var iframe = document.getElementById(FORM_IFRAME_ID);
    if (!iframe) return;

    var params = new URLSearchParams(window.location.search);
    var keysToForward = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_content',
      'utm_term',
      'gclid',
      'fbclid',
      '_gl',
      'ttclid',
      'msclkid',
      'li_fat_id'
    ];

    var query = [];
    keysToForward.forEach(function (key) {
      var value = params.get(key);
      if (value) query.push(key + '=' + encodeURIComponent(value));
    });
    query.push('_lp=' + encodeURIComponent(window.location.href));
    query.push('_ref=' + encodeURIComponent(document.referrer || ''));
    query.push('_t=' + Date.now());

    iframe.src = iframe.src + (iframe.src.indexOf('?') > -1 ? '&' : '?') + query.join('&');

    // Ajusta a altura do iframe dinamicamente conforme o conteúdo do form.
    window.addEventListener('message', function (event) {
      if (event.origin !== FORM_ORIGIN) return;
      if (event.data && event.data.type === 'np-form-height') {
        iframe.style.height = event.data.height + 'px';
      }
    });
  }

  // ---------------------------------------------------------------------
  // 2. video_play — primeira reprodução do vídeo do case
  // ---------------------------------------------------------------------
  function trackVideoPlay() {
    var video = document.querySelector(CASE_VIDEO_SELECTOR);
    if (!video) return;

    video.addEventListener('play', function () {
      fireEvent('video_play', { video_src: video.currentSrc || video.src });
    }, { once: true });
  }

  // ---------------------------------------------------------------------
  // 3. cta_click — clique no botão principal de CTA
  // ---------------------------------------------------------------------
  function trackCtaClick() {
    document.querySelectorAll(CTA_SELECTOR).forEach(function (cta) {
      cta.addEventListener('click', function () {
        fireEvent('cta_click', {
          cta_label: (cta.textContent || '').trim(),
          cta_href: cta.getAttribute('href') || ''
        });
      });
    });
  }

  // ---------------------------------------------------------------------
  // 4. form_view — seção do formulário entrou na viewport
  // ---------------------------------------------------------------------
  function trackFormView() {
    var formSection = document.getElementById(FORM_SECTION_ID);
    if (!formSection) return;

    if (!('IntersectionObserver' in window)) {
      fireEvent('form_view');
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          fireEvent('form_view');
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(formSection);
  }

  // ---------------------------------------------------------------------
  // 5. lead_form — envio do formulário (mensagem postada pelo iframe do CRM)
  // ---------------------------------------------------------------------
  // Contrato confirmado no bundle do CRM (FormEmbed): ao enviar o lead com
  // sucesso, o iframe faz:
  //   window.parent.postMessage({ source: "napratica-form",
  //     event: "form_submit", form_id, form_name, tenant_id,
  //     lead_data: { name, email, phone }, timestamp }, "*")
  // e, 1.5s depois, se houver redirect_url configurado no form, redireciona
  // a página inteira (window.top.location.href) para a URL de obrigado.
  function isLeadSubmitMessage(data) {
    return !!data
      && typeof data === 'object'
      && data.source === 'napratica-form'
      && data.event === 'form_submit';
  }

  function trackLeadForm() {
    window.addEventListener('message', function (event) {
      if (event.origin !== FORM_ORIGIN) return;
      if (!isLeadSubmitMessage(event.data)) return;

      fireEvent('lead_form', {
        form_id: event.data.form_id,
        form_name: event.data.form_name
      });
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'Lead');
      }
    });
  }

  // ---------------------------------------------------------------------
  // 6. video_progress — 25/50/75/95% do vídeo do case (cada marco uma vez)
  // ---------------------------------------------------------------------
  function trackVideoProgress() {
    var video = document.querySelector(CASE_VIDEO_SELECTOR);
    if (!video) return;

    var marcos = [25, 50, 75, 95];
    var enviados = {};

    video.addEventListener('timeupdate', function () {
      if (!video.duration) return;
      var pct = (video.currentTime / video.duration) * 100;
      marcos.forEach(function (m) {
        if (pct >= m && !enviados[m]) {
          enviados[m] = true;
          if (typeof window.fbq === 'function') {
            window.fbq('trackCustom', 'video_progress', {
              percent: m,
              video_src: video.currentSrc || video.src
            });
          }
          if (window.console && console.debug) {
            console.debug('[lp-nova-tracking] evento disparado: video_progress', m);
          }
        }
      });
    });
  }

  function init() {
    forwardUtmsToForm();
    trackVideoPlay();
    trackVideoProgress();
    trackCtaClick();
    trackFormView();
    trackLeadForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
