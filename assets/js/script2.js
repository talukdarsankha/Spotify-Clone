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
    let songs = [];
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



async function main(){
  songs =await getsong("songs/ncs");

play_music(songs[0],true);  

  console.log(songs);
 // show all songs in songlist
   let songUl=document.querySelector(".songlists").getElementsByTagName("ul")[0];
    for (const e of songs) {
      songUl.innerHTML = songUl.innerHTML+`<li>
      <img src="songs.svg" class="invert" alt="musics">
      <div class="info">
          <div> ${e.replaceAll("%20"," ")} </div>
         
          <div>Artist: Harry</div>
      </div>
      <div class="play-now">
          <p>Play Now</p>
          <img src="playbouuton.svg" class="invert" alt="">
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


   playmusic.addEventListener("click",()=>{
    if(currentSong.paused){
      currentSong.play()
       playmusic.src="pausebutton.svg";
    }else{
      currentSong.pause()
      playmusic.src="playbouuton.svg";
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
    })
  

          // try to get folder wise songs after clicking cards
    // Array.from(document.getElementsByClassName("card")).forEach(e=>{
    //   e.addEventListener("click", async ele=>{
    // //  console.log(ele.target);
    // // console.log(ele.currentTarget);
    //    songs =await getsong(`/songs/${ele.currentTarget.dataset.folder}`);
    //   })
    // })

}
main();


