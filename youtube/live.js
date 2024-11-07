async function getLiveChatId(videoId, apiKey) {
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${videoId}&key=${apiKey}`);
        const data = await response.json();
        if (!data.items || data.items.length === 0) {
            throw new Error('No items found in the response');
        }
        // console.log(data.items[0]?.liveStreamingDetails);
        return data.items[0]?.liveStreamingDetails?.activeLiveChatId;
    } catch (error) {
        console.error('Error fetching live chat ID:', error);
        return null;
    }
}

async function fetchLiveChatMessages(liveChatId, apiKey) {
    let messages = [];
    let nextPageToken = '';
  
    while (true) {
        try {
            const response = await fetch(`https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${liveChatId}&part=snippet,authorDetails&pageToken=${nextPageToken}&key=${apiKey}`);
            const data = await response.json();
            // console.log('API Response:', JSON.stringify(data, null, 2)); // レスポンス全体をログ出力
  
            if (!data.items || data.items.length === 0) {
                throw new Error('コメントがないよ');
            }
            // 取得したメッセージを配列に追加
            messages = messages.concat(data.items);
  
            // 次のページがあるか確認
            if (!data.nextPageToken) break;
            nextPageToken = data.nextPageToken;
  
            // APIリクエスト制限を避けるための遅延
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error('Error fetching live chat messages:', error);
            break;
        }
    }
  
    return messages.map(item => ({
        author: item.authorDetails.displayName,
        message: item.snippet.displayMessage,
        publishedAt: item.snippet.publishedAt
    }));
}

module.exports = { getLiveChatId, fetchLiveChatMessages };
