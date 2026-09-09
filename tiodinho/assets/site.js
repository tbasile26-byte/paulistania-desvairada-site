
(function(){
 const t=document.querySelector('.mobile-toggle'),m=document.querySelector('.menu'); if(t&&m)t.addEventListener('click',()=>{m.classList.toggle('open');t.setAttribute('aria-expanded',m.classList.contains('open'))});
 const form=document.getElementById('mailingForm'); if(form) form.addEventListener('submit',async e=>{e.preventDefault();const s=document.getElementById('mailingStatus'),b=form.querySelector('button');b.disabled=true;s.textContent='Enviando...';const d=Object.fromEntries(new FormData(form).entries());try{await fetch('https://script.google.com/macros/s/AKfycbx-MNgoT6LdavOZ9CiY4MnoBAYWab8KUnQAQVdGggbZOXaKkqOa4FpTVwhurwIGgp1aHQ/exec',{method:'POST',mode:'no-cors',keepalive:true,headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({...d,tipo_formulario:'mailing',origem:'Site - Tio Dinho'})});s.textContent='Cadastro realizado. Você passa a receber nossas novidades.';form.reset()}catch(err){s.textContent='Não foi possível enviar agora. Fale com a gente pelo WhatsApp.'}finally{b.disabled=false}});
 const footerLinks=document.querySelector('.site-footer .footer-links');
 if(footerLinks&&!footerLinks.querySelector('a[href="politica-de-reservas.html"]')){
  const politica=document.createElement('a');
  politica.href='politica-de-reservas.html';
  politica.textContent='Política de Reservas e Compras';
  const instagram=footerLinks.querySelector('a[href*="instagram.com"]');
  if(instagram) footerLinks.insertBefore(politica,instagram);
  else footerLinks.appendChild(politica);
 }
 const siteScript=[...document.scripts].find(script=>/\/assets\/site\.js(?:\?|$)/.test(script.src));
 const assetBase=siteScript?siteScript.src.replace(/site\.js(?:\?.*)?$/,''):'assets/';
 const chatbotStyle=document.createElement('link');chatbotStyle.rel='stylesheet';chatbotStyle.href=assetBase+'chatbot.css';document.head.appendChild(chatbotStyle);
 const chatbotData=document.createElement('script');chatbotData.src=assetBase+'chatbot-data.js';chatbotData.onload=()=>{const chatbot=document.createElement('script');chatbot.src=assetBase+'chatbot.js';document.body.appendChild(chatbot)};document.body.appendChild(chatbotData); const gaConsent=localStorage.getItem('cca_analytics_consent');
 window.dataLayer=window.dataLayer||[];
 window.gtag=window.gtag||function(){dataLayer.push(arguments)};
 gtag('consent','default',{analytics_storage:gaConsent==='granted'?'granted':'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
 const gaScript=document.createElement('script');gaScript.async=true;gaScript.src='https://www.googletagmanager.com/gtag/js?id=G-38K2VVYPJR';document.head.appendChild(gaScript);
 gtag('js',new Date());gtag('config','G-38K2VVYPJR',{anonymize_ip:true});
 if(!gaConsent){const banner=document.createElement('div');banner.setAttribute('role','dialog');banner.setAttribute('aria-label','Preferências de privacidade');banner.style.cssText='position:fixed;left:16px;right:16px;bottom:16px;z-index:99999;max-width:680px;margin:auto;padding:18px;background:#211310;color:#fff;border:1px solid #c79b58;border-radius:8px;font:14px/1.5 Arial,sans-serif;box-shadow:0 8px 30px #0008';banner.innerHTML='<strong>Privacidade e cookies</strong><p style="margin:8px 0 14px">Usamos o Google Analytics para entender a visitação e melhorar o site. Você pode aceitar ou recusar cookies de medição.</p><div style="display:flex;gap:10px;flex-wrap:wrap"><button data-ga="accept" style="padding:9px 14px;border:0;border-radius:4px;background:#d6ad68;color:#211310;font-weight:700;cursor:pointer">Aceitar medição</button><button data-ga="reject" style="padding:9px 14px;border:1px solid #d6ad68;border-radius:4px;background:transparent;color:#fff;cursor:pointer">Recusar</button></div>';document.body.appendChild(banner);banner.addEventListener('click',e=>{const choice=e.target.dataset.ga;if(!choice)return;const granted=choice==='accept';localStorage.setItem('cca_analytics_consent',granted?'granted':'denied');gtag('consent','update',{analytics_storage:granted?'granted':'denied'});banner.remove()})} const track=(eventName,params={})=>gtag('event',eventName,{...params,page_path:location.pathname});
 document.addEventListener('click',e=>{const el=e.target.closest('a,button');if(!el)return;const href=el.href||el.dataset.href||'';const label=(el.textContent||el.getAttribute('aria-label')||'').trim().replace(/\s+/g,' ').slice(0,100);if(/wa\.me|whatsapp/i.test(href))track('whatsapp_click',{link_text:label,link_url:href});if(/reserv|comprar|checkout/i.test(label+' '+href))track('begin_checkout',{link_text:label,link_url:href});if(/instagram\.com/i.test(href))track('social_click',{social_network:'instagram',link_url:href})});
 document.addEventListener('submit',e=>{if(e.target.id==='mailingForm')track('generate_lead',{form_name:'mailing'})},true);
})();
