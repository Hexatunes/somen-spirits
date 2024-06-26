function getCookie(name) {
    let cookieArr = document.cookie.split(";");

    for(let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");

        if(name == cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }

    // Return null if the cookie by name does not exist
    return null;
}



function actuallySwitchHome(){
  location.href = "./";
}

function switchHome(){
  document.getElementById("padTrans").style.display = "block";
  document.getElementById("padTrans").style.animation = "fadeIn 1s";
  setTimeout(actuallySwitchHome, 1000)
}



function toggleMusic(){
  var musicToggle = getCookie("BGMute")
  if(musicToggle == "true"){
    document.getElementById("toggleMusic").src = "./images/musicOFF.png";
    document.getElementById("bgm").volume = 0.0;
    document.cookie = "BGMute=false";

  }else{
    document.getElementById("toggleMusic").src = "./images/musicON.png";
    document.getElementById("bgm").volume = 0.5;
    document.cookie = "BGMute=true";
  }
}



const songs = ["Harrisville.mp3", "Springdale.mp3", "Blossom.mp3", "SoAlone.mp3", "Uptown.mp3", "SanFantastico.mp3", "OldHarrisville.mp3", "Sakura.mp3"]



var currentTeam = 0;
var selectedYokai = -1;
var teams = []

function intoFinished(){
  document.getElementById("padTrans").style.display = "none";
}

function setUp(){
  const randomSong = Math.floor(Math.random() * songs.length);
  const path = "./audios/music/" + songs[randomSong];
  document.getElementById("bgm").src = path;
  
  var musicToggle = getCookie("BGMute")

  console.log(musicToggle)
  if(musicToggle == "true"){
    document.getElementById("toggleMusic").src = "./images/musicON.png";
    document.getElementById("bgm").volume = 0.5;

  }else if(musicToggle == "false"){
    document.getElementById("toggleMusic").src = "./images/musicOFF.png";
    document.getElementById("bgm").volume = 0.0;
  }else{
    document.getElementById("toggleMusic").src = "./images/musicON.png";
    document.getElementById("bgm").volume = 0.5;
    document.cookie = "BGMute=true";
  }

  document.getElementById("bgm").play()
  document.getElementById("itemList").style.display = "none"

  for (const [key, value] of Object.entries(YOKAI_DATABASE)) {
    var icon = document.createElement("input")
    icon.type = "image"
    icon.src = value["medal"]
    icon.setAttribute("class", "medalList")
    document.getElementById("yokaiList").appendChild(icon)

    var nameInfo = document.createElement("button")
    nameInfo.innerHTML = value["displayName"] + " | Rank: " + value["rank"]
    nameInfo.setAttribute("class", "yokaiOption")
    nameInfo.setAttribute("onclick", `appendYokai("${key}")`)

    var br = document.createElement("br")

    
    document.getElementById("yokaiList").appendChild(nameInfo)
    document.getElementById("yokaiList").appendChild(br)
  }
  
  document.getElementById("padTrans").style.animation = "fadeOut 1s";
  setTimeout(intoFinished, 1000)

  teams = JSON.parse(getCookie("teams"))
  if(!teams){
    document.cookie = `teams=${JSON.stringify([["Untitled Team"]])}`
    teams = [["Untitled Team"]]
  }else if(teams.length == 0){
    teams = [["Untitled Team"]]
    document.cookie = `teams=${JSON.stringify(teams)}`
  }
  console.log(teams)
  document.getElementById("teamSelect").selectedIndex = 0
  refreshTeamList()
  loadTeam()
}

function refreshTeamList(){
  document.getElementById("teamSelect").innerHTML = ""
  for(var i = 0; i < teams.length; i++){
    var addOption = document.createElement("option");
    addOption.innerHTML = teams[i][0];
    document.getElementById("teamSelect").appendChild(addOption)
  }
}

function loadTeam(){
  //code to refresh and load in yokais
  currentTeam = document.getElementById("teamSelect").selectedIndex
  document.getElementById("slot1").src = ""
  document.getElementById("slot2").src = ""
  document.getElementById("slot3").src = ""
  document.getElementById("slot4").src = ""
  document.getElementById("slot5").src = ""
  document.getElementById("slot6").src = ""
  for(let i = 0; i < teams[currentTeam].length - 1; i++){
    document.getElementById("slot" + (i + 1)).src = YOKAI_DATABASE[teams[currentTeam][i + 1]["code"]]["medal"]
  }
}

function createTeam(){
  if(teams.length == 0){
    teams.push([document.getElementById("nameTeam").value])
    document.cookie = `teams=${JSON.stringify(teams)}`
    refreshTeamList()
    document.getElementById("nameTeam").value = ""
    document.getElementById("teamSelect").selectedIndex = 0
    currentTeam = 0
  }else if(teams.length <= 50){
    teams.push([document.getElementById("nameTeam").value])
    document.cookie = `teams=${JSON.stringify(teams)}`
    refreshTeamList()
    document.getElementById("nameTeam").value = ""
  }
  else{
    alert("Too many teams! Why do you need 51 of them?")
  }
}

function renameTeam(){
  teams[currentTeam][0] = document.getElementById("nameTeam").value
  document.getElementById("nameTeam").value = ""
  refreshTeamList()
  document.getElementById("teamSelect").selectedIndex = currentTeam
  document.cookie = `teams=${JSON.stringify(teams)}`
}

function deleteTeam(){
  teams.splice(currentTeam, 1)
  document.cookie = `teams=${JSON.stringify(teams)}`
  refreshTeamList()
  document.getElementById("teamSelect").selectedIndex = 0
  currentTeam = 0
  selectedYokai = -1
  document.getElementById("yokaiName").innerHTML = "Select a Yokai!"
  document.getElementById("yokaiGif").src = "./images/teambuilder/whisperPlaceholder.webp"
  if(teams.length == 0){
    teams = [["Untitled Team"]]
    document.cookie = `teams=${JSON.stringify(teams)}`
  }
  loadTeam()
}

function appendYokai(toAppend){
  if(teams[currentTeam].length <= 6){
    teams[currentTeam].push({
      code: toAppend,
      displayName: YOKAI_DATABASE[toAppend]["displayName"],
    })
    document.cookie = `teams=${JSON.stringify(teams)}`
    loadTeam()
  }else{
    alert("Team full! Remove a Yokai!")
  }
}

function selectYokai(index){
  if(index <= teams[currentTeam].length){
    selectedYokai = index
    document.getElementById("yokaiName").innerHTML = teams[currentTeam][index]["displayName"]
    document.getElementById("yokaiGif").src = YOKAI_DATABASE[teams[currentTeam][index]["code"]]["front"]
  }
}

function deleteYokai(){
  if(teams[currentTeam].length > 1 && selectedYokai > -1){
    teams[currentTeam].splice(selectedYokai, 1)
    loadTeam()
    selectedYokai = -1
    document.getElementById("yokaiName").innerHTML = "Select a Yokai!"
    document.getElementById("yokaiGif").src = "./images/teambuilder/whisperPlaceholder.webp"
    document.cookie = `teams=${JSON.stringify(teams)}`
  }
}



document.getElementById("bgm").addEventListener("ended", function(){
  document.getElementById("bgm").currentTime = 0;
  const randomSong = Math.floor(Math.random() * songs.length);
  const path = "./audios/music/" + songs[randomSong];
  document.getElementById("bgm").src = path;
  document.getElementById("bgm").play()
});