// Firebase 설정 전 기능 체험용. 실제 데이터가 아니며 이 브라우저에만 저장됩니다.
const key = 'hongjak-demo-v1';
const seed = {teas:[
  {id:'sample-1',name:'얼그레이',brand:'예시 브랜드 A',category:'가향차',stock:'available',description:'베르가못 향의 홍차. 미리보기용 예시입니다.',imageUrl:'',archived:false},
  {id:'sample-2',name:'다즐링',brand:'예시 브랜드 B',category:'싱글오리진',stock:'low',description:'은은한 꽃향과 산뜻한 여운.',imageUrl:'',archived:false},
  {id:'sample-3',name:'캐모마일',brand:'예시 브랜드 C',category:'허브티',stock:'available',description:'부드럽고 편안한 허브차.',imageUrl:'',archived:false}
],reviews:{}};
export function createDemo(){
  let data; try{data=JSON.parse(localStorage.getItem(key))||structuredClone(seed);}catch{data=structuredClone(seed);}
  const uid='demo-user'; let admin=false; const teaListeners=new Set(); const reviewListeners=new Set(); const sessionListeners=new Set();
  const session=()=>({uid,admin});
  const notify=()=>{localStorage.setItem(key,JSON.stringify(data));teaListeners.forEach(f=>f([...data.teas]));reviewListeners.forEach(({id,fn})=>fn(Object.values(data.reviews[id]||{})));};
  const requireAdmin=()=>{if(!admin)throw Error('관리자 권한이 필요합니다.');};
  return {mode:'demo',getSession:session,
    onSession(fn){sessionListeners.add(fn);fn(session());return()=>sessionListeners.delete(fn);},
    watchTeas(fn){teaListeners.add(fn);fn([...data.teas]);return()=>teaListeners.delete(fn);},
    watchReviews(id,fn){const listener={id,fn};reviewListeners.add(listener);fn(Object.values(data.reviews[id]||{}));return()=>reviewListeners.delete(listener);},
    async login(){admin=true;sessionListeners.forEach(f=>f(session()));},
    async logout(){admin=false;sessionListeners.forEach(f=>f(session()));},
    async saveTea(id,fields){requireAdmin();if(id){data.teas=data.teas.map(t=>t.id===id?{...t,...fields}:t);}else{data.teas.push({id:crypto.randomUUID(),...fields,archived:false});}notify();},
    async archiveTea(id,archived){requireAdmin();data.teas=data.teas.map(t=>t.id===id?{...t,archived}:t);notify();},
    async saveReview(id,fields){if(!data.teas.some(t=>t.id===id&&!t.archived))throw Error('보관된 차에는 시음평을 쓸 수 없습니다.');const reviews=data.reviews[id]??={};reviews[uid]={...fields,id:uid,createdAt:reviews[uid]?.createdAt||Date.now()};notify();},
    async deleteReview(id,rid){requireAdmin();delete data.reviews[id][rid];notify();}
  };
}
