const { getLiveChatId, fetchLiveChatMessages } = require('./youtube/live');
// envからAPI_KEYを取得
require('dotenv').config();
const API_KEY = process.env.YOUTUBE_API_KEY;

// VIDEO_IDを指定してコメントを取得
const VIDEO_ID = 'epeubjgG90s';

(async () => {
    const ids = await getLiveChatId(VIDEO_ID, API_KEY);
    console.log(ids);
    const messages = await fetchLiveChatMessages(ids, API_KEY);

    // messageをファイルに出力
    const fs = require('fs');
    fs.writeFileSync('messages.json', JSON.stringify(messages, null, 2));
})();