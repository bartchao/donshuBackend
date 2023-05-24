# 東石平台的後端API
## 環境
目前開發環境（建議未來也使用以下方式）：使用Docker部署
- HTTP Server: Nginx (HTTPS/Serve react static files/proxy to nodejs)
- Database: MySQL 5.7
- NodeJS: v16.18 LTS / ExpressJS
- OpenAPI 3.0 supported
## 專案架構

```
 ┣ 📂apk -> Android APK位置（需以Docker Mount掛接）
 ┣ 📂log  -> LOG（需以Docker Mount掛接）
 ┣ 📂uploads -> 相片上傳位置（需以Docker Mount掛接）
 ┣ 📂bin 
 ┃ ┗ 📜www -> 程式進入點（node ./bin/www)
 ┣ 📂src
 ┃ ┣ 📂db
 ┃ ┃ ┣ 📂controller -> HTTP Controller
 ┃ ┃ ┣ 📂model -> Sequelize ORM Model
 ┃ ┃ ┣ 📂validator -> Request 資料驗證
 ┃ ┃ ┗ 📜db.js
 ┃ ┣ 📂helper -> 提供2xx/4xx Error 的工具
 ┃ ┃ ┣ 📜errHandler.js 
 ┃ ┃ ┗ 📜response.js
 ┃ ┣ 📂middleware -> 中介層，處理Token/API Key...
 ┃ ┃ ┣ 📜checkAPIkey.js
 ┃ ┃ ┣ 📜checkAPKversion.js
 ┃ ┃ ┣ 📜checkToken.js
 ┃ ┃ ┣ 📜checkTokExp.js
 ┃ ┃ ┣ 📜ImgUpload.js
 ┃ ┃ ┣ 📜index.js
 ┃ ┃ ┗ 📜verifyGoogleToken.js
 ┃ ┣ 📂routes -> 定義路由地方，皆要API Key才可使用
 ┃ ┃ ┣ 📜index.js
 ┃ ┃ ┣ 📜private.js -> 需帶Bearer Token
 ┃ ┃ ┗ 📜public.js
 ┃ ┣ 📂socket -> 存放各個 socketIO
 ┃ ┃ ┗ 📜changecore.js -> ⽤來連接留⾔變化的SocketIO
 ┃ ┣ 📂util ->存放⼀些通⽤邏輯
 ┃ ┣ 📜app.js -> 主程式近入點
 ┃ ┣ 📜google_client.js -> Google 登入Token（verifyGoogleToken.js使用）
 ┃ ┗ 📜socketio.js -> socketIO的建構
 ┣ 📜.env -> 環境檔案
 ┣ 📜.env.production -> 140.123.241.50舊的環境設定
 ┣ 📜.eslintrc.js
 ┣ 📜.huskyrc
 ┣ 📜.lintstagedrc
 ┣ 📜Dockerfile -> Docker build image for dev environment
 ┣ 📜Dockerfile.production -> Docker build image for production environment
```

## Docker 環境架構

```
 ┣ 📂donshuBackendData -> 給NodeJS掛接用
 ┣ 📂mysql -> 本機開發用MySQL存放去
 ┣ 📂mysql-scripts -> 上版用的sql檔案以及Dockerfile
 ┣ 📂nginx -> NGINX Server設定
 ┣ docker-compose.yml -> Docker Compose文件(Development)
 ┣ docker-compose.yml.production -> Docker Compose文件(正式環境 Cluster support)
```

### Docker 指令

- Build image
    
    ```bash
    docker build -t gcr.io/donshibackend/donshubackend_nodejs:node16 -f Dockerfile.production .
    ```
    
- Build image and compose up
  ```bash
  docker-compose up --build
  ```
