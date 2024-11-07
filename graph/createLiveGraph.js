
function createLiveGraph() {
    const fs = require('fs');
    const { createCanvas } = require('canvas');
    const { Chart, registerables } = require('chart.js');

    // Chart.jsのコンポーネントを登録
    Chart.register(...registerables);

    // messages.jsonを読み込む
    const messages = JSON.parse(fs.readFileSync('messages.json', 'utf8'));

    // コメントの時刻を分単位で集計
    const commentCounts = {};
    messages.forEach(message => {
        const date = new Date(Date.parse(message.publishedAt.replace(' JST', '')));
        const minutes = `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
        if (!commentCounts[minutes]) {
            commentCounts[minutes] = 0;
        }
        commentCounts[minutes]++;
    });

    // データをグラフ用に整形
    const labels = Object.keys(commentCounts);
    const data = Object.values(commentCounts);

    // キャンバスを作成
    const width = 800; // グラフの幅
    const height = 600; // グラフの高さ
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // 背景色を白に設定するプラグイン
    const backgroundColorPlugin = {
        id: 'backgroundColor',
        beforeDraw: (chart) => {
            const ctx = chart.canvas.getContext('2d');
            ctx.save();
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, chart.width, chart.height);
            ctx.restore();
        }
    };

    // グラフの設定
    const configuration = {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'コメント数',
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: '時刻 (分単位)'
                    },
                    ticks: {
                        autoSkip: false, // 自動スキップを無効にする
                        callback: function(value, index, values) {
                            // 10分ごとにラベルを表示
                            const label = this.getLabelForValue(value);
                            const [hours, minutes] = label.split(':').map(Number);
                            return minutes % 10 === 0 ? label : '';
                        }
                    },
                    grid: {
                        display: true
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'コメント数'
                    },
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1 // 1ずつ
                    },
                    grid: {
                        display: true
                    }
                }
            },
            plugins: {
                backgroundColor: backgroundColorPlugin
            }
        },
        plugins: [backgroundColorPlugin]
    };

    // グラフを描画
    new Chart(ctx, configuration);

    // 画像として保存
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('liveChatGraph.png', buffer);
}

module.exports = { createLiveGraph };