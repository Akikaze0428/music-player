const  wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = wrapper.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list")
showMoreBtn = wrapper.querySelector("#more-music"),
hideMusicBtn = musicList.querySelector("#close");

let musicIndex = 1;

window.addEventListener("load", () => {                                     
    loadMusic(musicIndex);  
    playingNow();
})

function loadMusic(indexNumb) {
    // インデックスが範囲外の場合、最初の曲に戻す
    if (indexNumb < 1 || indexNumb > allMusic.length) {
        musicIndex = 1; // 初めの曲に戻す
        indexNumb = musicIndex; // indexNumbも更新
    }

    musicName.innerText = allMusic[indexNumb - 1].name; 
    musicArtist.innerText = allMusic[indexNumb - 1].artist; 
    musicImg.src = `images/${allMusic[indexNumb - 1].img}`; 
    mainAudio.src = `music/${allMusic[indexNumb - 1].src}`; 
}

//音楽再生機能
function playMusic(){
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";  //アイコンを一時停止に変更
    mainAudio.play()
}

//一時停止
function pauseMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";  //アイコンを再生に変更       play-arrowとplay_arrowの違いなんか気づかんてふつう...
    mainAudio.pause()
}

function nextMusic() {
    musicIndex++; // Indexを1だけ増加させる

    // 曲のインデックスが配列の長さを超えたら最初の曲に戻す
    if (musicIndex > allMusic.length) {
        musicIndex = 1; // 最初の曲にリセット
    }

    loadMusic(musicIndex); // 修正されたloadMusicを呼び出す
    playMusic();
    playingNow();
}

//再生か一時停止か
playPauseBtn.addEventListener("click", () => {
    const isMusicPaused = wrapper.classList.contains("paused");
    /*音楽が一時停止中（isPlayMusicPaused が true の場合）: pauseMusic を呼び出し、音楽を一時停止
    再生中（isPlayMusicPaused が false の場合）: play を呼び出し、再生*/
    isMusicPaused ? pauseMusic() : playMusic();
    playingNow();
});

//次の音楽に切り替える
nextBtn.addEventListener("click", () => {
    nextMusic();  //次の曲を呼び出す
});

// 前の曲に戻るボタンを取得
prevBtn.addEventListener("click", () => {
    prevMusic();  // 前の曲を呼び出す
});

// 前の曲に戻る機能を実装
function prevMusic() {
    musicIndex--;  // Indexを1だけ減少させる

    // 曲のインデックスが1より小さくなったら、最後の曲に戻す
    if (musicIndex < 1) {
        musicIndex = allMusic.length;  // 最後の曲にリセット
    }

    loadMusic(musicIndex);  // 指定されたインデックスの曲を読み込む
    playMusic();  // 音楽を再生する
    playingNow();
}

// 現在の再生の時間に応じて、progress barの幅を変更する
mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime;  // 曲の現在の再生時間を取得する
    const duration = e.target.duration;  // 曲の合計再生時間を取得する

    if (duration) {
        let progressWidth = (currentTime / duration) * 100;
        progressBar.style.width = `${progressWidth}%`;
    }
});

// 曲がロードされた時に曲の総再生時間を表示
mainAudio.addEventListener("loadeddata", () => {
    let musicDuration = wrapper.querySelector(".duration");

    // 曲の総再生時間を更新
    let audioDuration = mainAudio.duration;
    let totalMin = Math.floor(audioDuration / 60);  // 分
    let totalSec = Math.floor(audioDuration % 60);  // 秒

    // 秒が1桁の場合は0を追加
    totalSec = totalSec < 10 ? `0${totalSec}` : totalSec;
    musicDuration.innerText = `${totalMin}:${totalSec}`;  // 例: 3:40
});

// 現在の再生時間と残り時間をリアルタイムに更新
mainAudio.addEventListener("timeupdate", () => {
    const currentTimeElement = wrapper.querySelector(".current"); // 現在の時間を表示する要素
    const durationElement = wrapper.querySelector(".duration"); // 残り時間を表示する要素

    let currentTime = mainAudio.currentTime; // 現在の再生時間を取得
    let duration = mainAudio.duration; // 曲の総再生時間を取得

    // 現在の再生時間をフォーマット
    let currentMin = Math.floor(currentTime / 60); // 分
    let currentSec = Math.floor(currentTime % 60); // 秒
    currentSec = currentSec < 10 ? `0${currentSec}` : currentSec; // 1桁の秒に0を追加

    // 現在の再生時間を表示
    currentTimeElement.innerText = `${currentMin}:${currentSec}`;

    // 残り時間をフォーマットして表示
    if (!isNaN(duration)) {
        let remainingTime = duration - currentTime; // 残り時間を計算
        let remainingMin = Math.floor(remainingTime / 60); // 分
        let remainingSec = Math.floor(remainingTime % 60); // 秒
        remainingSec = remainingSec < 10 ? `0${remainingSec}` : remainingSec; // 1桁の秒に0を追加

        // 残り時間を表示
        durationElement.innerText = `-${remainingMin}:${remainingSec}`;
    }
});


//進行バーをクリックした位置から音楽を再生
progressArea.addEventListener("click", (e) => {
    let progressWidthval = progressArea.clientWidth;  //進行バー全体の幅を取得
    let clickedOffSetX = e.offsetX;  //X軸のオフセット値を取得
    let songDuration = mainAudio.duration;  //曲の総再生時間を取得

    //クリック位置に基づいて再生時間を設定
    mainAudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration;
    playMusic()
});

// リピートボタンの要素を取得
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
    // 現在のボタンのテキストを取得（repeat, repeat_one, shuffle のいずれか）
    let getText = repeatBtn.innerText;

    // テキストの内容に応じて動作を変更
    switch(getText){
        case "repeat":  // ボタンが"repeat"のとき、1曲ループモードに切り替え
            repeatBtn.innerText = "repeat_one";  // テキストを"repeat_one"に変更（1曲リピート）
            repeatBtn.setAttribute("title", "Song looped");
            break;

        case "repeat_one":  // ボタンが"repeat_one"のとき、シャッフルモードに切り替え
            repeatBtn.innerText = "shuffle";  // テキストを"shuffle"に変更（シャッフル再生）
            repeatBtn.setAttribute("title", "Playback shuffle");
            break;

        case "shuffle":  // ボタンが"shuffle"のとき、通常のリピートモードに戻す
            repeatBtn.innerText = "repeat";  // テキストを"repeat"に戻す（プレイリストループ）
            repeatBtn.setAttribute("title", "Playlist looped");
            break;
    }
});

// 音楽が再生終了した時に次の曲を再生する
mainAudio.addEventListener("ended", () => {
    let getText = repeatBtn.innerText;
    switch(getText){
        case "repeat":  
            // 通常のリピートモードでは次の曲に進む
            nextMusic();  // 次の曲を再生
            break;

        case "repeat_one":  
            // 1曲リピートモードでは同じ曲を再生
            mainAudio.currentTime = 0;  // 曲の再生時間をリセット
            playMusic();  // 同じ曲を再生
            break;

        case "shuffle": 
            // シャッフルモードではランダムな曲を再生
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do {
                randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            } while(musicIndex === randIndex);  // 同じ曲が選ばれないようにする
            musicIndex = randIndex;
            loadMusic(musicIndex);  // ランダムな曲を読み込む
            playMusic();  // ランダムな曲を再生
            playingNow();
            break;
    }
});

showMoreBtn.addEventListener("click",() => {
    musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click",() => {           //hideMusicBtnBtn:Btnが一つ多いだけで10分つぶれた。 しょうもな
    showMoreBtn.click();
});

const ulTag = wrapper.querySelector("ul");

// プレイリストを生成
for (let i = 0; i < allMusic.length; i++) {
    let liTag = `<li li-index="${i + 1}">
                    <div class="row">
                        <span class="track-number">${i + 1}</span>
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                    <audio class="audio" src="music/${allMusic[i].src}"></audio>
                 </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);
}

// 各音楽の長さを設定する関数
function setAudioDuration() {
    const allAudios = document.querySelectorAll("audio");  // すべてのaudioタグを取得
    const allDurations = document.querySelectorAll(".audio-duration");  // すべての音楽の長さの要素を取得

    allAudios.forEach((audio, index) => {
        audio.addEventListener("loadeddata", () => {
            let audioDuration = audio.duration; // 曲の総時間を取得
            let totalMin = Math.floor(audioDuration / 60);  // 分
            let totalSec = Math.floor(audioDuration % 60);  // 秒

            // 秒が1桁の場合は0を追加
            totalSec = totalSec < 10 ? `0${totalSec}` : totalSec;

            // 曲の長さを対応する`audio-duration`に表示
            allDurations[index].innerText = `${totalMin}:${totalSec}`;
        });
    });
}

// プレイリストの曲長さをロード後に設定
window.addEventListener("load", () => {
    loadMusic(musicIndex);  // 初期曲をロード
    setAudioDuration();     // 各曲の再生時間を設定
    playingNow();           // UI更新
    addPlaylistListeners(); // ここでリスナーを登録
});

function addPlaylistListeners() {
    const allLiTags = ulTag.querySelectorAll("li");
    allLiTags.forEach((li) => {
        li.addEventListener("click", function () {
            const liIndex = parseInt(this.getAttribute("li-index"));
            musicIndex = liIndex; // 選択された曲のインデックスを更新
            loadMusic(musicIndex); // 曲データを読み込み
            playMusic(); // 再生開始
            playingNow(); // UI更新
        });
    });
}

// すべてのliタグにクリックイベントを付与
const allLiTags = ulTag.querySelectorAll("li");
function playingNow() {
    allLiTags.forEach((li) => {
        li.addEventListener("click", function () {
            const liIndex = parseInt(this.getAttribute("li-index"));
            musicIndex = liIndex; // 選択された曲のインデックスを更新
            loadMusic(musicIndex); // 曲データを読み込み
            playMusic(); // 再生開始
            playingNow(); // UI更新
        });
    });
}

// リストアイテムがクリックされた時の処理
function onLiClick() {
    const liIndex = parseInt(this.getAttribute("li-index")); // liのインデックス取得
    musicIndex = liIndex; // グローバルのmusicIndexを更新
    loadMusic(musicIndex); // 曲をロード
    playMusic(); // 再生
    playingNow(); // UI更新
}

// 曲がクリックされたときの処理
function clicked(element) {
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = parseInt(getLiIndex);
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case " ":
            playPauseBtn.click(); // スペースキーで再生/一時停止
            break;
        case "ArrowRight":
            mainAudio.currentTime += 10; // →で10秒スキップ
            break;
        case "ArrowLeft":
            mainAudio.currentTime -= 10; // ←で10秒戻る
            break;
        case "ArrowUp":
            mainAudio.volume = Math.min(1, mainAudio.volume + 0.1); // ↑で音量アップ
            break;
        case "ArrowDown":
            mainAudio.volume = Math.max(0, mainAudio.volume - 0.1); // ↓で音量ダウン
            break;
    }
});

let isDragging = false;
let previousVolume = mainAudio.volume; // 元の音量を保存

progressArea.addEventListener("mousedown", (e) => {
    isDragging = true;
    previousVolume = mainAudio.volume; // 現在の音量を保存
    mainAudio.muted = true; // ドラッグ中は音楽をミュートする
    updateProgressBar(e);
});

progressArea.addEventListener("mousemove", (e) => {
    if (isDragging) {
        updateProgressBar(e);
    }
});

progressArea.addEventListener("mouseup", (e) => {
    if (isDragging) {
        updateProgressBar(e); // マウスボタンを離したときに最終位置を適用
        isDragging = false; // ドラッグ終了
        mainAudio.muted = false; // ミュート解除
        mainAudio.volume = previousVolume; // 元の音量を復元
    }
});

// マウスが外に出てもドラッグが解除されるようにする
document.addEventListener("mouseup", () => {
    if (isDragging) {
        isDragging = false;
        mainAudio.muted = false; // ミュート解除
        mainAudio.volume = previousVolume; // 元の音量を復元
    }
});

// マウスが外に出てもドラッグが解除されるようにする
document.addEventListener("mouseup", () => {
    isDragging = false;
});

function updateProgressBar(e) {
    let progressWidth = progressArea.clientWidth;
    let clickOffsetX = e.offsetX;
    let songDuration = mainAudio.duration;
    
    let newTime = (clickOffsetX / progressWidth) * songDuration;
    progressBar.style.width = `${(clickOffsetX / progressWidth) * 100}%`;

    if (isDragging) {
        mainAudio.currentTime = newTime; // ドラッグ中に時間を変更
    }
}

const darkModeToggle = document.querySelector("#dark-mode-toggle");
const musicListContainer = document.querySelector(".music-list");

// 🔹 ページロード時にダークモードを適用
window.addEventListener("load", () => {
    if (localStorage.getItem("dark-mode") === "enabled") {
        enableDarkMode();
    }
});

// 🔹 ダークモードを有効にする
function enableDarkMode() {
    document.body.classList.add("dark-mode");
    musicListContainer.classList.add("dark-mode"); // ミュージックリストにも適用
    darkModeToggle.innerText = "☀️"; // ライトモードアイコン
    localStorage.setItem("dark-mode", "enabled");
}

// 🔹 ダークモードを無効にする
function disableDarkMode() {
    document.body.classList.remove("dark-mode");
    musicListContainer.classList.remove("dark-mode");
    darkModeToggle.innerText = "🌙"; // ダークモードアイコン
    localStorage.setItem("dark-mode", "disabled");
}

// 🔹 ボタンクリックでダークモード切り替え
darkModeToggle.addEventListener("click", () => {
    if (document.body.classList.contains("dark-mode")) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
});