let player;

function onYouTubeIframeAPIReady() {
    player = new YT.Player("player", {
        height: '405',
        width: '660',
        videoId: 'M7lc1UVf-VE',
        events: {
        // 'onReady': onPlayerReady,
        // 'onStateChange': onPlayerStateChange
        },
        playerVars: {
            showInfo: 0,
            rel: 0,
            autoplay: 0,
            modestBranding: 0
        }
    });
}