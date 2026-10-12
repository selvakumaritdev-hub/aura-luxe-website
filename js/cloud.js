(function(){
var C=window.AURA_FIREBASE,rp=null;
var L=['https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js','https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js'];
function init(){
  if(rp)return rp;
  rp=new Promise(function(res,rej){
    (function n(i){
      if(i>=L.length){try{firebase.initializeApp(C);res(firebase.firestore())}catch(e){rej(e)}return}
      var s=document.createElement('script');s.src=L[i];s.onload=function(){n(i+1)};
      s.onerror=function(){rej({code:'sdk-blocked (ad blocker or no internet)'})};document.head.appendChild(s)
    })(0)
  });
  return rp;
}
window.auraSave=function(col,data){
  if(!C)return Promise.resolve({ok:false,err:'no-config'});
  return init().then(function(db){
    data.createdAt=firebase.firestore.FieldValue.serverTimestamp();
    var t=new Promise(function(_,rej){setTimeout(function(){rej({code:'timeout (check Firestore rules or database edition)'})},8000)});
    return Promise.race([db.collection(col).add(data),t]).then(function(r){return{ok:true,id:r.id}});
  }).catch(function(e){console.error('Aura save failed:',e);return{ok:false,err:(e&&(e.code||e.message))||'unknown'}});
};
if(C)init().catch(function(){});
})();
