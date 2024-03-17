console.log("javascript");



let currentSong = new Audio();
let songs;
let currFolder;

 async function getsong(folder){
  currFolder=folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
    let response = await a.text();
    console.log(response);

    let div = document.createElement("div");
    div.innerHTML=response;

    let as= div.getElementsByTagName("a");
    songs = [];
    for( let i=0;i<as.length;i++){
        const ele = as[i];
        if(ele.href.endsWith(".mp3")){   // http://127.0.0.1:5500/songs/GirlOnTop-AmyLynn%26theHoneymen.mp3
          //  songs.push(ele.href.split("/songs/")[1]); // GirlOnTop-AmyLynn%26theHoneymen.mp3
          let el =ele.href.split(`/${folder}/`)[1];
        //  songs.push(el.split("-")[0]);  // GirlOnTop
          songs.push(el);
        }
    }
    console.log(songs);
    


    let songUl=document.querySelector(".songlists").getElementsByTagName("ul")[0];
    songUl.innerHTML="";
    for (const e of songs) {
      songUl.innerHTML = songUl.innerHTML+`<li>
      <img src="assets/images/songs.svg" class="invert" alt="musics">
      <div class="info">
          <div> ${e.replaceAll("%20"," ")} </div>
         
          <div>Artist: Harry</div>
      </div>
      <div class="play-now">
          <p>Play Now</p>
          <img src="assets/images/playbouuton.svg" class="invert" alt="">
      </div>
  </li>`
    }
   
  Array.from(document.querySelector(".songlists").getElementsByTagName("li")).forEach(e=>{
    console.log(e);  // here e is <li>
    console.log(e.querySelector(".info").firstElementChild.innerHTML); // now we can get songs name
    e.addEventListener("click",element=>{
      play_music(e.querySelector(".info").firstElementChild.innerHTML.trim());
      // play_music("songs/Blue Ribbons - TrackTribe copy.mp3");
      
    })
    
  });

  return songs;
}


// async function main(){
//   let songs= await getsong();
//   console.log(songs);

//    let songUl=document.querySelector(".songlists").getElementsByTagName("ul")[0];
//     for (const e of songs) {
//       // songUl.innerHTML=songUl.innerHTML+ e;
//       // songUl.innerHTML = songUl.innerHTML+ `<li> ${e.replaceAll("%20","")} </li>`;
//       songUl.innerHTML = songUl.innerHTML+`<li>
//       <img src="songs.svg" class="invert" alt="musics">
//       <div class="info">
//           <div> ${e.replaceAll("%20","")} </div>
         
//           <div>Artist: Harry</div>
//       </div>
//       <div class="play-now">
//           <p>Play Now</p>
//           <img src="playbouuton.svg" class="invert" alt="">
//       </div>
//   </li>`
//     }
   

//   var audio = new Audio(songs[0]);
//   audio.play();
//   audio.addEventListener("loadeddata",()=>{
//     let duration = audio.duration;
//     console.log(duration);
//   });



// }
// main();



const play_music = (music,play=false)=>{
  currentSong.src=`/${currFolder}/`+music; 
  if(!play){
    currentSong.play();
    playmusic.src="pausebutton.svg";
  }
  document.querySelector(".songsinfo").getElementsByTagName("p")[0].innerHTML=decodeURI(music.split("-")[0]);
  document.querySelector(".songtime").getElementsByTagName("p")[0].innerHTML="00: 00";
   
}


function secondsToMinutesAndSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
      return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

  return `${formattedMinutes}:${formattedSeconds}s`;
}

// // Example usage:
// const totalSeconds = 165;
// const formattedTime = secondsToMinutesAndSeconds(totalSeconds);
// console.log(formattedTime); // Output: "02:45"


//display all songs folders in cardcontainer
async function displayFolders(){
  let a = await fetch(`http://127.0.0.1:5500/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML=response;
  let anchors =div.getElementsByTagName("a");

  let cardcontainer = document.querySelector(".cardContainer");
  let array = Array.from(anchors);
  for(let i =0;i<array.length;i++){
    const e = array[i];
    if(e.href.includes("/songs/")){
      console.log(e.href.split("/").slice(-1)[0]);
      let folders = e.href.split("/").slice(-1)[0];
      let a = await fetch(`http://127.0.0.1:5500/songs/${folders}/info.json`);
      let response = await a.json();
       console.log(response);
       cardcontainer.innerHTML=cardcontainer.innerHTML+
       `<div data-folder="${folders}" class="card border border-radius ">

       <div  class="playbutton">
           <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="border-radius: 50%; background-color: green;">
               <circle cx="50%" cy="50%" r="45%" fill="black" />
               <path d="M8 5.5L17 12l-9 6.5z" fill="green" />
             </svg>
       </div>

       <img class="border-radius" src="songs/${folders}/internet.jpeg" alt="cardimg">
       <h2>${response.title}</h2>
       <p>${response.description}</p>
   </div>`
    }
  }
 
         // try to get folder wise songs after clicking cards
         Array.from(document.getElementsByClassName("card")).forEach(e=>{
          e.addEventListener("click", async ele=>{
        //  console.log(ele.target);
        // console.log(ele.currentTarget);
        // console.log(ele.currentTarget.dataset.folder);
           songs =await getsong(`songs/${ele.currentTarget.dataset.folder}`);
           console.log(songs[0]);
           play_music(songs[0]);
          })
        })
}

async function main(){
await getsong("songs/ncs");

play_music(songs[0],true);  

//display all songs folders in cardcontainer
displayFolders();

  console.log(songs);
 // show all songs in songlist



   playmusic.addEventListener("click",()=>{
    if(currentSong.paused){
      currentSong.play()
       playmusic.src="assets/images/pausebutton.svg";
    }else{
      currentSong.pause()
      playmusic.src="assets/images/playbouuton.svg";
    }
  })

  currentSong.addEventListener("timeupdate",()=>{
    console.log(currentSong.currentTime,currentSong.duration);

    document.querySelector(".songtime").getElementsByTagName("p")[0].innerHTML=`${secondsToMinutesAndSeconds(currentSong.currentTime)}/${secondsToMinutesAndSeconds(currentSong.duration)}`;

    document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100+"%";
  })


  document.querySelector(".seekbar").addEventListener("click",e=>{
    console.log(e);
    // console.log(e.target);
    // console.log(e.target.getBoundingClientRect(),e.offsetX);
    let parcent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
    document.querySelector(".circle").style.left=parcent+"%"; 
    console.log(parcent);
    currentSong.currentTime= (currentSong.duration*parcent)/100;

  })

  document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left=0;
  });

  document.querySelector(".crosshamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left="-100%";
  })
 
      // try to play previous music
  document.querySelector("#previousmusic").addEventListener("click",()=>{
    console.log(currentSong);
    console.log(songs);
    // console.log(currentSong.src.split("/songs/")[1]);
    console.log(currentSong.src.split("/").slice(-1));
    let index =  songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    console.log(index);
    if(index-1>=0){
      play_music(songs[index-1]);
    }
  })

    // try to play previous music
    document.querySelector("#nextmusic").addEventListener("click",()=>{
     let index= songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
     console.log(index);
     if(index+1<songs.length){
      play_music(songs[index+1]);
     }
    })

    // try to add event on volume-range
    document.querySelector(".volume-range").addEventListener("change",e=>{
      console.log(e.target,e.target.value);
      currentSong.volume=parseInt(e.target.value)/100;
      if(currentSong.volume>0){
        document.querySelector(".volume-img").src="assets/images/volume.svg";
      }else{
        document.querySelector(".volume-img").src="assets/images/mute.svg";
      }
    })
  

    document.querySelector(".volume-img").addEventListener("click",e=>{
      // console.log(e.target);
      if(e.target.src.includes("volume.svg")){
        e.target.src="assets/images/mute.svg";
        document.querySelector(".volume-range").value=0;
        currentSong.volume=0/100;
      }else{
        e.target.src="assets/images/volume.svg";
        document.querySelector(".volume-range").value=30;
        currentSong.volume=30/100;
      }
      
      
    })
   



}


main();


