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

  langButtons.forEach(btn=>btn.addEventListener('click',()=>applyLanguage(btn.dataset.lang)));

  /* Cross-page menu jump: remember the HOME section first, then open HOME without a hash.
     This prevents the browser from briefly painting the top of HOME before the target section. */
  document.querySelectorAll('a[href^="index.html#"]').forEach(link=>{
    link.addEventListener('click',event=>{
      const href=link.getAttribute('href')||'';
      const hashIndex=href.indexOf('#');
      if(hashIndex<0) return;
      const hash=href.slice(hashIndex);
      if(!hash) return;

      event.preventDefault();
      const currentFile=(location.pathname.split('/').pop()||'index.html').toLowerCase();
      if(currentFile==='index.html'){
        const target=document.querySelector(hash);
        if(target){
          target.scrollIntoView({behavior:'smooth',block:'start'});
          history.replaceState(null,'',hash);
        }
        return;
      }

      let stored=false;
      try{sessionStorage.setItem('altiusworks-anchor-target',hash);stored=true}catch(e){}
      const homeUrl=new URL('index.html',window.location.href);
      if(document.documentElement.lang==='en') homeUrl.searchParams.set('lang','en');
      if(!stored) homeUrl.hash=hash;
      window.location.assign(homeUrl.href);
    });
  });

  let initial='ja';
  try{
    const q=new URLSearchParams(location.search).get('lang');
    const saved=localStorage.getItem('altiusworks-language');
    initial=q==='en'?'en':q==='ja'?'ja':(saved==='en'?'en':'ja');
  }catch(e){}
  applyLanguage(initial);

  function revealAnchorTarget(){
    let hash='';
    try{hash=sessionStorage.getItem('altiusworks-anchor-target')||location.hash||''}catch(e){hash=location.hash||''}
    if(!hash){
      document.documentElement.style.visibility='visible';
      return;
    }

    const target=document.querySelector(hash);
    if(!target){
      try{sessionStorage.removeItem('altiusworks-anchor-target')}catch(e){}
      document.documentElement.style.visibility='visible';
      if('scrollRestoration' in history) history.scrollRestoration='auto';
      return;
    }

    /* Force this cross-page jump to be instant. The site normally uses
       html{scroll-behavior:smooth}, so behavior:'auto' would still animate
       from the top of HOME in some browsers. */
    const previousScrollBehavior=document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior='auto';
    if(document.body) document.body.style.scrollBehavior='auto';

    const targetTop=target.getBoundingClientRect().top + window.scrollY - 95;
    window.scrollTo(0,Math.max(0,targetTop));

    requestAnimationFrame(()=>{
      requestAnimationFrame(()=>{
        document.documentElement.style.visibility='visible';
        document.documentElement.style.scrollBehavior=previousScrollBehavior;
        if(document.body) document.body.style.scrollBehavior='';
        try{sessionStorage.removeItem('altiusworks-anchor-target')}catch(e){}
        if(location.hash!==hash) history.replaceState(null,'',hash);
        if('scrollRestoration' in history) history.scrollRestoration='auto';
      });
    });
  }

  if(document.documentElement.style.visibility==='hidden'){
    if(document.readyState==='complete') revealAnchorTarget();
    else window.addEventListener('load',revealAnchorTarget,{once:true});
  }

  if(menuButton&&mobileNav){
    menuButton.addEventListener('click',()=>{const open=mobileNav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));});
    mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobileNav.classList.remove('open');menuButton.setAttribute('aria-expanded','false');}));
  }

  if(document.documentElement.classList.contains('home-intro-pending')){
    try{sessionStorage.setItem('altiusworks-home-intro','1')}catch(e){}
    window.setTimeout(()=>document.documentElement.classList.remove('home-intro-pending'),1700);
  }
})();
