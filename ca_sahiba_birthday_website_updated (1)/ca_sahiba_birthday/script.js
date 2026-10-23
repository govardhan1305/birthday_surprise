// Shared floating petals/hearts on all pages except the cinematic opening.
if (!document.body.classList.contains('opening-page')) {
  const symbols = ['♡', '✿', '♥', '✧'];
  setInterval(() => {
    const item = document.createElement('span');
    item.className = 'floaty';
    item.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    item.style.left = Math.random() * 100 + 'vw';
    item.style.color = ['#ff9fc9', '#f7c5df', '#eaa4d0'][Math.floor(Math.random() * 3)];
    item.style.fontSize = (12 + Math.random() * 17) + 'px';
    item.style.animationDuration = (7 + Math.random() * 6) + 's';
    document.body.appendChild(item);
    setTimeout(() => item.remove(), 14000);
  }, 850);
}

// The archery opening now leads directly to cake.html.
const shootButton = document.getElementById('shootButton');
if (shootButton) {
  shootButton.addEventListener('click', () => {
    if (shootButton.disabled) return;
    shootButton.disabled = true;
    shootButton.classList.add('shooting');
    const hint = document.getElementById('openingHint');
    if (hint) hint.textContent = 'A little birthday magic is on its way...';
    const heart = document.querySelector('.target-heart');
    if (heart) {
      heart.animate([
        { transform: 'scale(1)', opacity: 1, filter: 'brightness(1)' },
        { transform: 'scale(1.8)', opacity: 1, filter: 'brightness(2)' },
        { transform: 'scale(2.4)', opacity: 0, filter: 'brightness(2)' }
      ], { duration: 850, easing: 'ease-out' });
    }
    setTimeout(() => {
      document.body.animate([{opacity:1},{opacity:0}], {duration:650,fill:'forwards'});
      setTimeout(() => { window.location.href = 'cake.html'; }, 650);
    }, 850);
  });
}

// Cake interaction.
const cake = document.getElementById('cake');
if (cake) {
  const knife = document.getElementById('knife');
  const blowBtn = document.getElementById('blowBtn');
  const cutBtn = document.getElementById('cutBtn');
  const hint = document.getElementById('hint');
  const reveal = document.getElementById('reveal');
  const stage = document.getElementById('cakeStage');
  let candlesOut = false, cakeCut = false, dragging = false, startX = 0, startY = 0, movedAcross = false, knifeOffsetX = 0, knifeOffsetY = 0;

  blowBtn.addEventListener('click', () => {
    if (candlesOut) return;
    candlesOut = true;
    document.querySelectorAll('.flame').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.smoke').forEach(el => el.classList.add('show'));
    blowBtn.disabled = true;
    cutBtn.disabled = false;
    hint.textContent = 'Make a wish! Drag the knife across the cake, or tap Cut the Cake.';
  });

  function confetti() {
    const symbols = ['💗','✨','🌸','💕','🎉','🌷'];
    for (let i=0; i<65; i++) {
      const piece = document.createElement('span');
      piece.className = 'confetti';
      piece.textContent = symbols[Math.floor(Math.random()*symbols.length)];
      piece.style.left = Math.random()*100+'vw';
      piece.style.animationDelay = Math.random()*1.5+'s';
      piece.style.fontSize = (12+Math.random()*18)+'px';
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 5500);
    }
  }

  function cutCake() {
    if (!candlesOut || cakeCut) return;
    cakeCut = true;
    cake.classList.add('cut');
    knife.style.opacity = '0';
    knife.style.pointerEvents = 'none';
    cutBtn.disabled = true;
    hint.textContent = 'You did it! Your birthday surprise is here. 💗';
    setTimeout(() => {
      reveal.classList.add('show');
      reveal.scrollIntoView({behavior:'smooth',block:'center'});
      confetti();
    }, 850);
  }
  cutBtn.addEventListener('click', cutCake);

  knife.addEventListener('pointerdown', e => {
    if (!candlesOut || cakeCut) return;
    dragging = true; movedAcross = false; startX = e.clientX; startY = e.clientY;
    const r = knife.getBoundingClientRect();
    knifeOffsetX = e.clientX-r.left; knifeOffsetY = e.clientY-r.top;
    knife.setPointerCapture(e.pointerId); e.preventDefault();
  });
  knife.addEventListener('pointermove', e => {
    if (!dragging || cakeCut) return;
    const r = stage.getBoundingClientRect();
    const x = e.clientX-r.left-knifeOffsetX, y = e.clientY-r.top-knifeOffsetY;
    knife.style.left = Math.max(-5,Math.min(stage.clientWidth-100,x))+'px';
    knife.style.top = Math.max(0,Math.min(stage.clientHeight-35,y))+'px';
    if (Math.abs(e.clientX-startX)>70 && Math.abs(e.clientY-startY)<75) movedAcross = true;
  });
  function endDrag(){ if(!dragging)return; dragging=false; if(candlesOut&&movedAcross&&!cakeCut)cutCake(); }
  knife.addEventListener('pointerup',endDrag);
  knife.addEventListener('pointercancel',endDrag);
  knife.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&candlesOut){e.preventDefault();cutCake();}});
}
