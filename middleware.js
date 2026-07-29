export const config = {
  // サイトのすべてのページ・ファイルに鍵をかける
  matcher: "/(.*)",
};

export default function middleware(request) {
  // アクセスしてきた人から認証情報（ID/パスワード）を受け取る
  const authorizationHeader = request.headers.get("authorization");

  if (authorizationHeader) {
    // 受け取った暗号データを元の文字に戻す
    const basicAuth = authorizationHeader.split(" ")[1];
    const [user, password] = atob(basicAuth).split(":");

    // ==========================================
    // 🔐 ここで好きなIDとパスワードを設定！
    // ==========================================
    const myId = "HaruFum"; // 👈 好きなIDに変更
    const myPassword = "SetPass#1995"; // 👈 好きなパスワードに変更

    // IDとパスワードが一致したら、そのままサイトを表示する
    if (user === myId && password === myPassword) {
      return new Response(null, {
        headers: { "x-middleware-next": "1" }, // 通行許可の合図
      });
    }
  }

  // 認証失敗（またはまだ入力していない）場合：ブラウザにパスワード入力窓を出させる
  return new Response("認証が必要です。IDとパスワードを入力してください。", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Perfume Laboratory Secure Area"',
    },
  });
}
