# Donshi Backend Changelog
Last updated at 2023-5-9
## v0.1.0（2023-5-9）
- 將所有HTTP POST改為對應的HTTP Method，新增與修改維持使用POST
- 新增（add）與修改（update）的API未經過修改跟測試，先以原本的API進行測試即可，有問題發Issues。
- 使用GET與DELETE的API以Http query格式替代，常見response為200（成功） 與404（找不到資料）
- GET與POST的大部分API會檢查帶的資料有沒有合乎格式，錯誤會以400回覆。
使用[`express-validation`套件](https://www.npmjs.com/package/express-validation)
- 所有request可以的話都帶上Bearer Token，在已經登入的情況下。
- 使用 `/public/user/login`以Body JSON格式帶入email可以產生token。
    ```json=
    {
        "account":"<Your email>"
    }
    ```
- Post(貼文)
    1. /post/getAllWithType is deprecated.Use /post/query?typeId={} instead.
    2. /post/query 用以獲得一篇以上的貼文，limit 與 offset 可以依需要帶入，預設limit=50。
    3. /user/getUserPosts及/user/getOtherUserPosts改以/post/getUserPosts取代
- Comment(留言)+Reply（留言回覆）
    1. /private/comment/addAndGet is deprecated.改以/private/post/addComment取代，成功會回應該Comment物件
    2. /private/post/addComment取代，成功會回應該Comment物件