import {initializeApp} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import {getAuth,onAuthStateChanged,signInAnonymously,signInWithEmailAndPassword,signOut} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import {getFirestore,collection,doc,getDoc,onSnapshot,addDoc,updateDoc,deleteDoc,runTransaction,serverTimestamp} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
export async function createFirebase(config){
  const app=initializeApp(config), auth=getAuth(app), db=getFirestore(app);
  let session={uid:null,admin:false}; const listeners=new Set(); let sequence=0;
  async function refresh(user){const seq=++sequence; let admin=false;if(user&&!user.isAnonymous){try{admin=(await getDoc(doc(db,'admins',user.uid))).exists();}catch{admin=false;}}if(seq!==sequence)return;session={uid:user?.uid||null,admin};listeners.forEach(f=>f(session));}
  await auth.authStateReady();
  if(!auth.currentUser)await signInAnonymously(auth);
  await refresh(auth.currentUser);
  onAuthStateChanged(auth,user=>{void refresh(user);});
  const requireAdmin=()=>{if(!session.admin)throw Error('관리자 권한이 필요합니다.');};
  const watch=(ref,fn,error)=>onSnapshot(ref,snap=>fn(snap.docs.map(d=>({...d.data(),id:d.id}))),error);
  return {mode:'firebase',getSession:()=>session,
    onSession(fn){listeners.add(fn);fn(session);return()=>listeners.delete(fn);},
    watchTeas(fn,error){return watch(collection(db,'teas'),fn,error);},
    watchReviews(id,fn,error){return watch(collection(db,'teas',id,'reviews'),fn,error);},
    async login(email,password){const result=await signInWithEmailAndPassword(auth,email,password);const adminDoc=await getDoc(doc(db,'admins',result.user.uid));if(!adminDoc.exists()){await signOut(auth);await signInAnonymously(auth);await refresh(auth.currentUser);throw Error('등록된 관리자 계정이 아닙니다.');}await refresh(result.user);},
    async logout(){await signOut(auth);await signInAnonymously(auth);await refresh(auth.currentUser);},
    async saveTea(id,fields){requireAdmin();if(id){await updateDoc(doc(db,'teas',id),{...fields,updatedAt:serverTimestamp()});}else{await addDoc(collection(db,'teas'),{...fields,archived:false,createdAt:serverTimestamp(),updatedAt:serverTimestamp()});}},
    async archiveTea(id,archived){requireAdmin();await updateDoc(doc(db,'teas',id),{archived,updatedAt:serverTimestamp()});},
    async saveReview(id,fields){const uid=auth.currentUser?.uid;if(!uid)throw Error('인증 연결을 확인해 주세요.');const ref=doc(db,'teas',id,'reviews',uid);await runTransaction(db,async tx=>{const old=await tx.get(ref);const payload={...fields,updatedAt:serverTimestamp()};if(old.exists())tx.update(ref,payload);else tx.set(ref,{...payload,createdAt:serverTimestamp()});});},
    async deleteReview(id,rid){requireAdmin();await deleteDoc(doc(db,'teas',id,'reviews',rid));}
  };
}
