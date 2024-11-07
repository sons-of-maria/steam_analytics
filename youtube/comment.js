async function fetchVideoComments(videoId, apiKey) {
    let comments = [];
    let nextPageToken = '';
  
    while (true) {
        try {
            const response = await fetch(`https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${apiKey}`);
            const data = await response.json();
            // console.log('API Response:', JSON.stringify(data, null, 2)); // レスポンス全体をログ出力
  
            // 取得したコメントを配列に追加
            comments = comments.concat(data.items);
  
            // 次のページがあるか確認
            if (!data.nextPageToken) break;
            nextPageToken = data.nextPageToken;
  
            // APIリクエスト制限を避けるための遅延
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error('Error fetching comments:', error);
            break;
        }
    }
  
    return comments.map(item => ({
        author: item.snippet.topLevelComment.snippet.authorDisplayName,
        text: item.snippet.topLevelComment.snippet.textDisplay,
        publishedAt: item.snippet.topLevelComment.snippet.publishedAt
    }));
}
