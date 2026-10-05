// Local interactions for the preserved public RG Presentes pages.
(() => {
  const one = s => document.querySelector(s);
  const all = s => [...document.querySelectorAll(s)];
  const home = 'Home-module__bzKCIa__';
  const slides = all(`.${home}bannerSlide`);
  const dots = all(`.${home}bannerDot`);
  const announcementMessages = all('.rg-announcement-message');
  let current = 0;
  if(announcementMessages.length>1&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
    let announcementIndex=0;
    setInterval(()=>{
      announcementMessages[announcementIndex].classList.remove('is-active');
      announcementIndex=(announcementIndex+1)%announcementMessages.length;
      announcementMessages[announcementIndex].classList.add('is-active');
    },2800);
  }
  function showSlide(index) {
    current = index;
    slides.forEach((slide,i) => {
      slide.classList.toggle(home+'bannerSlideActive', i===index);
      const a=slide.querySelector('a');a.tabIndex=i===index?0:-1;a.setAttribute('aria-hidden',String(i!==index));
    });
    dots.forEach((dot,i)=>{dot.classList.toggle(home+'bannerDotActive',i===index);dot.setAttribute('aria-selected',String(i===index));});
  }
  dots.forEach((dot,i)=>{
    dot.addEventListener('click',()=>showSlide(i));
    dot.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();const next=(current+(e.key==='ArrowRight'?1:slides.length-1))%slides.length;showSlide(next);dots[next].focus();}});
  });
  if(slides.length>1&&!matchMedia('(prefers-reduced-motion: reduce)').matches)setInterval(()=>{if(!document.hidden&&!one(`.${home}bannerHero:focus-within`))showSlide((current+1)%slides.length);},6000);
  all('.rg-word-hero__word').forEach(el=>{
    const words=(el.dataset.words||'').split(',').map(w=>w.trim()).filter(Boolean);
    if(words.length<2||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    let i=0;
    setInterval(()=>{
      i=(i+1)%words.length;
      el.classList.add('is-changing');
      setTimeout(()=>{el.textContent=words[i];el.classList.remove('is-changing');},220);
    },2200);
  });
  all('button[aria-controls$="-rail"]').forEach((button)=>{
    const rail=one(`#${button.getAttribute('aria-controls')}`);
    const controls=[...document.querySelectorAll(`button[aria-controls="${button.getAttribute('aria-controls')}"]`)];
    const i=controls.indexOf(button);
    if(!rail)return;
    button.addEventListener('click',()=>rail.scrollBy({left:(i?1:-1)*(rail.clientWidth*.8),behavior:'smooth'}));
    const update=()=>{button.disabled=i?rail.scrollLeft+rail.clientWidth>=rail.scrollWidth-3:rail.scrollLeft<=3;};
    rail.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);update();
  });
  all('button[aria-label="Abrir menu"]').forEach(button=>button.addEventListener('click',()=>{
    const open=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(open));
    if(button.getAttribute('aria-controls')==='home-navigation')one('#home-navigation').classList.toggle(home+'navigationOpen',open);
    else {
      let menu=one('#mobile-navigation');
      if(!menu){menu=one('.desktop-nav').cloneNode(true);menu.id='mobile-navigation';menu.className='replica-mobile-nav';one('.store-header').append(menu);}
      menu.hidden=!open;
    }
  }));
  const searchForm=one('form[role="search"]');
  if(searchForm)searchForm.addEventListener('submit',e=>{
    e.preventDefault();
    const query=searchForm.querySelector('input').value.trim();
    const text=query?`Ola! Estou procurando por ${query} no site. Podem me ajudar?`:'Ola! Quero ver opcoes de presentes personalizados. Podem me ajudar?';
    window.open(`https://wa.me/553194181954?text=${encodeURIComponent(text)}`,'_blank','noopener');
  });
  all(`.${home}categories`).forEach(rail=>{
    let dragging=false,startX=0,startScroll=0;
    rail.addEventListener('pointerdown',e=>{
      dragging=true;startX=e.clientX;startScroll=rail.scrollLeft;rail.setPointerCapture(e.pointerId);
    });
    rail.addEventListener('pointermove',e=>{
      if(!dragging)return;
      rail.scrollLeft=startScroll-(e.clientX-startX);
    });
    ['pointerup','pointercancel','pointerleave'].forEach(type=>rail.addEventListener(type,()=>{dragging=false;}));
  });
  const grid=one('.catalog-grid');
  if(grid){
    const categories=['blusas','canecas','chaveiros','sacolas','lixas','cadernos','garrafas','vidros'];
    const cards=[...grid.children];const input=one('.catalog-search input');const links=all('.filter-list a');
    const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    function filter(){
      const params=new URLSearchParams(location.search);const category=params.get('categoria')||'';const query=params.get('q')||'';
      if(input.value!==query)input.value=query;
      let count=0;
      cards.forEach((card,i)=>{card.hidden=Boolean(category&&category!==categories[i]||query&&!normalize(card.textContent).includes(normalize(query)));if(!card.hidden)count++;});
      links.forEach(a=>{const selected=(new URL(a.href).searchParams.get('categoria')||'')===category;a.classList.toggle('selected',selected);selected?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current');});
      one('.catalog-count').replaceChildren(document.createTextNode(`${count} ${count===1?'possibilidade':'possibilidades'} para fazer alguém sorrir `));
      const note=document.createElement('span');note.textContent='Produção sob encomenda';one('.catalog-count').append(note);
      let empty=one('#catalog-empty');if(!empty){empty=document.createElement('p');empty.id='catalog-empty';empty.textContent='Nenhum produto encontrado. Tente outra busca ou categoria.';grid.after(empty);}empty.hidden=count>0;
    }
    input.addEventListener('input',()=>{const u=new URL(location.href);input.value.trim()?u.searchParams.set('q',input.value):u.searchParams.delete('q');history.replaceState(null,'',u);filter();});
    links.forEach(a=>a.addEventListener('click',e=>{if(e.ctrlKey||e.metaKey||e.shiftKey)return;e.preventDefault();const u=new URL(a.href);if(input.value)u.searchParams.set('q',input.value);history.pushState(null,'',u);filter();}));
    window.addEventListener('popstate',filter);filter();
  }
  const quantity=one('#quantity');
  if(quantity){
    const decrease=one('button[aria-label="Diminuir quantidade"]');const increase=one('button[aria-label="Aumentar quantidade"]');const idea=one('#gift-idea');const cta=one('.detail-cta');
    function update(){const q=Math.min(10000,Math.max(1,parseInt(quantity.value,10)||1));quantity.value=q;decrease.disabled=q<=1;increase.disabled=q>=10000;const u=new URL(cta.href);u.searchParams.set('text',`Ola! Vi ${one('.detail-copy h1').textContent} no site e gostaria de fazer um orcamento. Quantidade desejada: ${q}.${idea.value.trim()?' Minha ideia: '+idea.value.trim():''}`);cta.href=u.href;}
    decrease.addEventListener('click',()=>{quantity.value=Number(quantity.value)-1;update();});increase.addEventListener('click',()=>{quantity.value=Number(quantity.value)+1;update();});quantity.addEventListener('input',update);idea.addEventListener('input',update);
    all('.photo-thumbnails button').forEach(button=>button.addEventListener('click',()=>{all('.photo-thumbnails button').forEach(b=>{b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',String(b===button));});one('.detail-photo img').src=button.querySelector('img').src;}));update();
  }
  all(`.${home}unboxingVideo`).forEach(video => {
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    const play = () => {
      if (video.currentTime < .2) {
        try { video.currentTime = .35; } catch {}
      }
      video.play().catch(() => {});
    };
    video.addEventListener('loadedmetadata', play, { once: true });
    video.addEventListener('canplay', play, { once: true });
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) play();
        });
      }, { threshold: .25 });
      observer.observe(video);
    } else {
      play();
    }
  });
})();
