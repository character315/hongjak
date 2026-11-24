// Node.js 22+: node --test backend/tests/demo.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {createDemo} from '../../frontend/js/demo.js';
const memory=new Map();
globalThis.localStorage={getItem:k=>memory.get(k)??null,setItem:(k,v)=>memory.set(k,v)};
test('local demo: catalog, permissions, reviews, archive, restore and persistence',async()=>{
  const db=createDemo();let teas,reviews;
  db.watchTeas(v=>teas=v);assert.equal(teas.length,3);
  const fields={name:'테스트차',brand:'테스트',category:'블렌드티',stock:'available',description:'',imageUrl:''};
  await assert.rejects(db.saveTea(null,fields));
  await db.login();assert.equal(db.getSession().admin,true);
  await db.saveTea(null,fields);assert.equal(teas.length,4);const id=teas.find(t=>t.name==='테스트차').id;
  await db.saveTea(id,{...fields,name:'수정차'});assert.equal(teas.find(t=>t.id===id).name,'수정차');
  db.watchReviews(id,v=>reviews=v);await db.logout();await db.saveReview(id,{author:'부원',rating:5,body:'좋은 차'});assert.equal(reviews.length,1);
  await db.saveReview(id,{author:'부원',rating:4,body:'수정'});assert.equal(reviews.length,1);assert.equal(reviews[0].body,'수정');
  await assert.rejects(db.deleteReview(id,reviews[0].id));await db.login();await db.archiveTea(id,true);assert.equal(teas.find(t=>t.id===id).archived,true);
  await assert.rejects(db.saveReview(id,{author:'부원',rating:4,body:'차단'}));await db.archiveTea(id,false);assert.equal(reviews.length,1);await db.deleteReview(id,reviews[0].id);assert.equal(reviews.length,0);
  const reloaded=createDemo();reloaded.watchTeas(v=>assert.equal(v.length,4));assert.equal(reloaded.getSession().admin,false);
});
