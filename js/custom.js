const API = "https://mbma.my20130910.workers.dev";

const ap = new APlayer({
    container: document.getElementById('aplayer'),
    fixed: true,
    mini: true,
    lrcType: 1,
    audio: []
});

// 搜索
document.getElementById("music-search").addEventListener("keydown", async (e) => {
    if (e.key !== "Enter") return;

    const keyword = e.target.value.trim();
    if (!keyword) return;

    const res = await fetch(`${API}/search?keyword=${encodeURIComponent(keyword)}&source=netease`)
        .then(r => r.json());

    if (!res.data.length) return;

    // 清空播放列表
    ap.list.clear();

    // 添加所有搜索结果
    for (const song of res.data) {
        const songRes = await fetch(`${API}/song?id=${song.id}&source=netease`).then(r => r.json());
        const lyricRes = await fetch(`${API}/lyric?id=${song.id}&source=netease`).then(r => r.json());

        ap.list.add({
            name: song.title,
            artist: song.artist,
            url: songRes.url,
            cover: song.artwork || "",
            lrc: lyricRes.raw || ""
        });

    }

    // 播放第一首
    ap.list.switch(0);
    ap.play();
});
