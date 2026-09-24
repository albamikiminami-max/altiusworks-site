(function(){
  const langButtons=document.querySelectorAll('.lang-button');
  const i18nElements=document.querySelectorAll('.i18n');
  const langImages=document.querySelectorAll('.lang-image');
  const altImages=document.querySelectorAll('[data-alt-ja][data-alt-en]');
  const menuButton=document.querySelector('.menu-button');
  const mobileNav=document.querySelector('.mobile-nav');

  function applyLanguage(lang){
    const normalized=lang==='en'?'en':'ja';
    document.documentElement.lang=normalized;
    document.querySelectorAll('[data-title-ja][data-title-en]').forEach(el=>{
      document.title=normalized==='en'?el.dataset.titleEn:el.dataset.titleJa;
    });
    const meta=document.querySelector('meta[name="description"]');
    if(meta && meta.dataset.ja && meta.dataset.en) meta.setAttribute('content',normalized==='en'?meta.dataset.en:meta.dataset.ja);
    i18nElements.forEach(el=>{const v=el.dataset[normalized];if(typeof v==='string')el.innerHTML=v;});
    langImages.forEach(img=>{const key=normalized==='ja'?'Ja':'En';const src=img.dataset['src'+key];const alt=img.dataset['alt'+key];if(src)img.src=src;if(alt)img.alt=alt;});
    altImages.forEach(img=>{if(img.classList.contains('lang-image'))return;img.alt=normalized==='en'?img.dataset.altEn:img.dataset.altJa;});
    langButtons.forEach(btn=>{const active=btn.dataset.lang===normalized;btn.classList.toggle('is-active',active);btn.setAttribute('aria-pressed',String(active));});
    if(menuButton){menuButton.setAttribute('aria-label',normalized==='en'?(menuButton.dataset.ariaEn||'Open menu'):(menuButton.dataset.ariaJa||'メニューを開く'));}
    const nextInput=document.getElementById('form-next');
    const urlInput=document.getElementById('form-url');
    try{
      if(nextInput){const nextUrl=new URL('thanks.html',window.location.href);if(normalized==='en')nextUrl.searchParams.set('lang','en');nextInput.name='_next';nextInput.value=nextUrl.href;}
      if(urlInput){const formUrl=new URL(window.location.href);formUrl.hash='contact';urlInput.name='_url';urlInput.value=formUrl.href;}
    }catch(e){}
    try{localStorage.setItem('altiusworks-language',normalized)}catch(e){}
    try{const url=new URL(window.location.href);if(normalized==='en')url.searchParams.set('lang','en');else url.searchParams.delete('lang');history.replaceState(null,'',url)}catch(e){}
  }
  langButtons.forEach(btn=>btn.addEventListener('click',()=>{if(document.documentElement.dataset.languageDraft==='ja-only' && btn.dataset.lang==='en'){alert('英語版は次の工程で反映予定です。現在は日本語版の骨格をご確認ください。');return;}applyLanguage(btn.dataset.lang);}));
  let initial='ja';try{const q=new URLSearchParams(location.search).get('lang');initial=q==='en'?'en':(localStorage.getItem('altiusworks-language')||'ja')}catch(e){}
  if(document.documentElement.dataset.languageDraft==='ja-only') initial='ja';
  applyLanguage(initial);
  if(menuButton&&mobileNav){menuButton.addEventListener('click',()=>{const open=mobileNav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));});mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobileNav.classList.remove('open');menuButton.setAttribute('aria-expanded','false')}));}
})();
