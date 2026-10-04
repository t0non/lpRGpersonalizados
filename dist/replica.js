// Local interactions for the preserved public RG Presentes pages.
(() => {
  const one = s => document.querySelector(s);
  const all = s => [...document.querySelectorAll(s)];
  const home = 'Home-module__bzKCIa__';
  const slides = all(`.${home}bannerSlide`);
  const dots = all(`.${home}bannerDot`);
  let current = 0;
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
  all('button[aria-controls="presentes-rail"]').forEach((button,i)=>{
    const rail=one('#presentes-rail');
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
  if(searchForm)searchForm.addEventListener('submit',e=>{e.preventDefault();location.href='/produtos?q='+encodeURIComponent(searchForm.querySelector('input').value.trim());});
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
})();
