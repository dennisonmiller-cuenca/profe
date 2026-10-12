import 'dotenv/config';
import express from 'express';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {createClient} from '@supabase/supabase-js';
const app=express();
const url=process.env.SUPABASE_URL||'https://byahpjoizwcwgccufisi.supabase.co';
const key=process.env.SUPABASE_PUBLISHABLE_KEY||'sb_publishable_l1IehA77G_uSWEtkqpBj3A_-LIIYv9g';
const supabase=createClient(url,key);
app.post('/api/realtime/session',express.text({type:'application/sdp',limit:'100kb'}),async(req,res)=>{
 try{
  const token=req.get('authorization')?.replace(/^Bearer /i,'');
  if(!token)return res.status(401).send('Authentication required');
  const {data:{user},error}=await supabase.auth.getUser(token);
  if(error||!user)return res.status(401).send('Invalid session');
  const scoped=createClient(url,key,{global:{headers:{Authorization:'Bearer '+token}}});
  const {data:profile,error:profileError}=await scoped.from('profe_learners').select('display_name,goals,preferences,ability_summary,next_lesson').eq('auth_user_id',user.id).single();
  if(profileError||!profile)return res.status(403).send('Learner profile unavailable');
  if(!process.env.OPENAI_API_KEY)return res.status(503).send('OPENAI_API_KEY is not configured');
  const instructions='You are Profe, an adaptive tutor of Ecuadorian Spanish. Focus on real-life speaking and listening, not accent perfection. Use short turns, scaffold carefully, and adapt immediately to feedback. Offer English help when needed. One question at a time. Learner context: '+JSON.stringify(profile);
  const form=new FormData();
  form.set('sdp',req.body);
  form.set('session',JSON.stringify({type:'realtime',model:'gpt-realtime',instructions,audio:{input:{transcription:{model:'gpt-4o-mini-transcribe'}},output:{voice:'alloy'}}}));
  const result=await fetch('https://api.openai.com/v1/realtime/calls',{method:'POST',headers:{Authorization:'Bearer '+process.env.OPENAI_API_KEY},body:form});
  if(!result.ok)return res.status(502).send('Realtime service unavailable');
  res.type('application/sdp').send(await result.text());
 }catch(e){console.error(e);res.status(500).send('Session failed')}
});
app.get('/',(req,res)=>res.sendFile(path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../index.html')));
app.listen(process.env.PORT||3001,()=>console.log('Profe server listening'));
