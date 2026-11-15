export default {
 async fetch(request, env) {
  const origin=request.headers.get("Origin")||"";
  const allowed=env.ALLOWED_ORIGIN||"*";
  const cors={"Access-Control-Allow-Origin":allowed==="*"? "*":allowed,"Access-Control-Allow-Methods":"GET,OPTIONS","Access-Control-Allow-Headers":"Content-Type","Vary":"Origin"};
  if(request.method==="OPTIONS")return new Response(null,{headers:cors});
  const u=new URL(request.url);
  if(u.pathname!=="/api/history")return new Response("Not found",{status:404,headers:cors});
  if(!env.RIOT_API_KEY)return Response.json({error:"Riot API secret missing"},{status:500,headers:cors});
  const gameName=u.searchParams.get("gameName"),tagLine=u.searchParams.get("tagLine"),region=u.searchParams.get("region")||"europe",count=Math.min(30,Math.max(1,Number(u.searchParams.get("count")||20)));
  if(!gameName||!tagLine)return Response.json({error:"Riot ID required"},{status:400,headers:cors});
  if(!["europe","americas","asia","sea"].includes(region))return Response.json({error:"Invalid region"},{status:400,headers:cors});
  const root="https://"+region+".api.riotgames.com",headers={"X-Riot-Token":env.RIOT_API_KEY};
  const get=async url=>{const r=await fetch(url,{headers});if(!r.ok)throw Error("Riot API "+r.status);return r.json();};
  try{
   const account=await get(root+"/riot/account/v1/accounts/by-riot-id/"+encodeURIComponent(gameName)+"/"+encodeURIComponent(tagLine));
   const ids=await get(root+"/lol/match/v5/matches/by-puuid/"+encodeURIComponent(account.puuid)+"/ids?start=0&count="+count+"&queue=420");
   const matches=await Promise.all(ids.map(async id=>{
    const match=await get(root+"/lol/match/v5/matches/"+encodeURIComponent(id));
    const p=match.info.participants.find(x=>x.puuid===account.puuid);
    if(!p)return null;
    return {id,champion:p.championName,win:p.win,kills:p.kills,deaths:p.deaths,assists:p.assists,cs:p.totalMinionsKilled+p.neutralMinionsKilled,items:[p.item0,p.item1,p.item2,p.item3,p.item4,p.item5],duration:match.info.gameDuration,date:match.info.gameEndTimestamp,queue:"Solo/Duo"};
   }));
   return Response.json({account:{gameName:account.gameName,tagLine:account.tagLine},matches:matches.filter(Boolean)},{headers:{...cors,"Cache-Control":"private, max-age=90"}});
  }catch(e){return Response.json({error:e.message},{status:502,headers:cors});}
 }
};